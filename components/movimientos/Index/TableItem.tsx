import { useUser } from '@/context/userContext';
import { addDots } from '@/helpers/addDots';
import getCajaStatus from '@/helpers/cobros/getCajaStatus';
import dateTexto from '@/helpers/dateTexto';
import { ClientType, IngresoType } from '@/types/types';
import { ViewIcon } from '@chakra-ui/icons';
import {
  Divider,
  Flex,
  Popover,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
  Td,
  Text,
  Tr,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import Link from 'next/link';
import { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { MdDelete } from 'react-icons/md';
import DeleteModal from '../../DeleteModal';
import { useMovimientos } from '@/context/useMovimientosContext';
import { Timestamp } from 'firebase/firestore';
import { MinutosPermisoDelete } from '@/data/data';

const TableItem = ({
  i,
  cliente,
  deleteMovimiento,
}: {
  i: IngresoType;
  cliente: ClientType | null;
  deleteMovimiento: () => Promise<void>;
}) => {
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { getMovimientos } = useMovimientos();
  const handleDelete = async () => {
    setLoading(true);
    try {
      const isOpenCaja = await getCajaStatus();
      if (!isOpenCaja) {
        toast({
          title: 'Caja cerrada',
          description: 'La caja está cerrada, intenta nuevamente más tarde',
          status: 'warning',
          isClosable: true,
          duration: 5000,
        });
        getMovimientos();
        return;
      }
      await deleteMovimiento();
      toast({
        status: 'success',
        title: 'Ingreso eliminado',
        description: 'Igreso eliminado con éxito.',
        duration: 5000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({});
    } finally {
      setLoading(false);
    }
  };
  const { user } = useUser();
  const { total, pagoParcial, fecha } = i;
  const customBG = useColorModeValue('gray.800', 'white');
  const customColor = useColorModeValue('white', 'black');
  const today = new Date(i?.fecha?.seconds * 1000);
  const time = today.getHours();
  const day = dateTexto(fecha.seconds).slashDate;
  const estaDentroDeHora = (vencimientoSeconds: number) => {
    const ahoraSeconds = Timestamp.now().seconds; // Timestamp actual en milisegundos
    const diferencia = Math.abs(ahoraSeconds - vencimientoSeconds); // Diferencia en milisegundos
    return diferencia <= 60 * MinutosPermisoDelete;
  };
  return (
    <Popover>
      <PopoverTrigger>
        <Tr cursor='pointer' _hover={{ fontWeight: 'bold' }}>
          <Td>{dateTexto(i?.fecha?.seconds, true).numDate}</Td>
          <Td>{dateTexto(i?.fecha?.seconds, true).hourDate}</Td>
          <Td>
            {i.items.length > 1
              ? `${i.items.length} items`
              : `${i.items[0].nombre} ${
                  i.items[0]?.unidades && i.items[0].unidades > 1
                    ? `x${i.items[0].unidades}`
                    : ''
                }`}
          </Td>
          <Td>
            ${addDots(typeof pagoParcial === 'number' ? pagoParcial : total)}
          </Td>
          <Td>${addDots(total)}</Td>
          <Td>
            <Flex align='center' gap={2}>
              <Link
                href={{
                  pathname: `/MovimientosID/${day}`,
                  query: {
                    hora: time,
                    seconds: i?.fecha?.seconds,
                    tipo: i?.isPago ? 'Egreso' : 'Ingreso',
                  },
                }}
                target='_blank'
              >
                <ViewIcon _hover={{ opacity: 0.65 }} />
              </Link>
              {(user?.rol === 'Superadmin' ||
                estaDentroDeHora(i?.fecha?.seconds)) && (
                <DeleteModal
                  textContent={<MdDelete />}
                  title={i?.isPago ? 'Egreso' : 'Ingreso'}
                  size='sm'
                  loadingForm={loading}
                  DeleteProp={handleDelete}
                  isIcon
                />
              )}
            </Flex>
          </Td>
        </Tr>
      </PopoverTrigger>
      <PopoverContent bg={customBG} color={customColor} w='100%'>
        <PopoverBody boxShadow='0 0 5px'>
          <Flex flexDir='column' gap={1}>
            {i.items.map((item) => (
              <Flex
                key={`table-item-key-${item.codigo + ''}`}
                gap={5}
                justify='space-between'
              >
                <Text>
                  {item.nombre} x {item.unidades}
                </Text>
                <Text>${addDots(item.precio)}</Text>
              </Flex>
            ))}

            <Divider />
            {cliente ? (
              <Flex
                as={Link}
                href={`/ClientesID/${cliente.id}`}
                target='_blank'
                gap={2}
                align='center'
                _hover={{ opacity: 0.85 }}
              >
                <FaUserCircle />
                <Text>
                  {cliente.nombre} {cliente.apellido}
                </Text>
              </Flex>
            ) : (
              <Text>Consumidor Final</Text>
            )}
          </Flex>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default TableItem;
