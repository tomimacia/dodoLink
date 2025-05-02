import { clientesFilteredByEstado } from '@/helpers/cobros/filterByEstado';
import useGetClientes from '@/hooks/useGetClientes';
import {
  Divider,
  Flex,
  IconButton,
  Text,
  useBreakpointValue,
  useDisclosure,
} from '@chakra-ui/react';
import { useState } from 'react';
import { MdUpdate } from 'react-icons/md';
import { Cell, Pie, PieChart } from 'recharts';
import MotionContainer from '../MotionContainer';
import ClientesCtaCte from './ClientesCtaCte';
import ClientesModal from './ClientesModal';

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill='white'
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline='central'
      fontSize={15}
      fontWeight='bold'
    >
      {`${(percent * 100).toFixed(1)}%`}
    </text>
  );
};
const ClientesStatus = () => {
  const { clientes, getClientes, clientesInactivos, loadingClientes } =
    useGetClientes();
  const [modalData, setModalData] = useState({
    title: '',
    list: [],
  });
  const clientesHabilitados = clientesFilteredByEstado('Habilitado', clientes);
  const clientesVencidos = clientesFilteredByEstado('Vencido', clientes);
  const clientesInhabilitados = clientesFilteredByEstado(
    'Inhabilitado',
    clientes
  );
  const customHeigth = ['100px', '110px', '120px', '130px'];
  const data = [
    { name: 'Habilitado', value: clientesHabilitados?.length },
    { name: 'Vencido', value: clientesVencidos?.length },
    { name: 'Inhabilitado', value: clientesInhabilitados?.length },
  ];

  const COLORS = ['#098f72', '#de7c3a', '#b50b0b'];
  const customRadius = useBreakpointValue([100, 110, 110, 110, 110]);
  const customWidth = '110px';
  const { isOpen, onOpen, onClose } = useDisclosure();
  const handleOpenModal = (title: string, list: any) => {
    setModalData({ title, list });
    onOpen();
  };
  // const brokenClientes = clientes.filter(
  //   (c) => c?.ingresoVencido?.seconds < c?.vencimiento?.seconds
  // );
  return (
    <Flex gap={2} flexDir='column' w='fit-content'>
      {/* <Text onClick={() => handleOpenModal('Rotos', brokenClientes)}>
        Clientes BUG: {brokenClientes.length}
      </Text> */}
      <Flex
        flexDir='column'
        borderRadius={5}
        flex={1}
        gap={2}
        p={2}
        mb={2}
        color='white'
        bg='blue.800'
      >
        <Flex gap={1} flexDir='column'>
          <Flex gap={2} align='center'>
            <Text
              cursor='pointer'
              onClick={() => handleOpenModal('Clientes Activos', clientes)}
              _hover={{ textDecor: 'underline' }}
              fontWeight='bold'
            >
              Clientes Activos
            </Text>
            <IconButton
              onClick={getClientes}
              isLoading={loadingClientes}
              aria-label='uptade-clientes'
              size='xs'
              fontSize='lg'
              bg='transparent'
              color='white'
              _hover={{ opacity: 0.65 }}
              icon={<MdUpdate />}
            />
          </Flex>
          <Divider borderColor='gray.400' w='100%' />
        </Flex>
        <MotionContainer
          loading={loadingClientes}
          customKey={`total-clientes-key-${clientes.length}`}
        >
          <Text fontSize='6xl' lineHeight={1}>
            {clientes?.length}
          </Text>
        </MotionContainer>
      </Flex>
      <Flex gap={2}>
        <Flex w='fit-content' flexDir='column' gap={1}>
          <Flex
            h={customHeigth}
            flexDir='column'
            minW={customWidth}
            borderRadius={5}
            flex={1}
            gap={2}
            p={2}
            color='white'
            bg='#098f72'
          >
            <Flex gap={1} flexDir='column'>
              <Text
                cursor='pointer'
                onClick={() =>
                  handleOpenModal('Clientes Al Día', clientesHabilitados)
                }
                _hover={{ textDecor: 'underline' }}
              >
                Al Día
              </Text>
              <Divider borderColor='gray.400' w='100%' />
            </Flex>
            <MotionContainer
              loading={loadingClientes}
              customKey={`total-clientes-aldia-key-${clientesHabilitados?.length}`}
            >
              <Text fontSize='5xl'>{clientesHabilitados?.length}</Text>
            </MotionContainer>
          </Flex>
          <Flex
            h={customHeigth}
            flexDir='column'
            minW={customWidth}
            borderRadius={5}
            flex={1}
            gap={2}
            p={2}
            color='white'
            bg='#de7c3a'
          >
            <Flex gap={1} flexDir='column'>
              <Text
                cursor='pointer'
                onClick={() =>
                  handleOpenModal('Clientes Vencidos', clientesVencidos)
                }
                _hover={{ textDecor: 'underline' }}
              >
                Vencidos
              </Text>
              <Divider borderColor='gray.400' w='100%' />
            </Flex>
            <MotionContainer
              loading={loadingClientes}
              customKey={`total-clientes-vencidos-key-${clientesVencidos?.length}`}
            >
              <Text fontSize='5xl'>{clientesVencidos?.length}</Text>
            </MotionContainer>
          </Flex>
        </Flex>
        <Flex align='center' justify='center' w='fit-content'>
          <PieChart
            width={(customRadius || 0) * 2}
            height={(customRadius || 0) * 2}
          >
            <Pie
              data={data.filter((d) => d.value > 0)}
              cx='50%'
              cy='50%'
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={customRadius}
              fill='#8884d8'
              dataKey='value'
            >
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </Flex>
      </Flex>
      <Text
        fontSize='lg'
        cursor='pointer'
        _hover={{ textDecor: 'underline' }}
        onClick={() =>
          handleOpenModal('Clientes Inhabilitados', clientesInhabilitados)
        }
        color={COLORS[2]}
      >
        Clientes Inhabilitados: <b>{clientesInhabilitados?.length}</b>
      </Text>
      <Text
        fontSize='lg'
        cursor='pointer'
        _hover={{ textDecor: 'underline' }}
        onClick={() => handleOpenModal('Clientes Inactivos', clientesInactivos)}
        color={'gray'}
      >
        Clientes Inactivos: <b>{clientesInactivos?.length}</b>
      </Text>
      <ClientesCtaCte
        handleOpenModal={handleOpenModal}
        clientes={[...clientes, ...clientesInactivos]}
      />
      <ClientesModal isOpen={isOpen} onClose={onClose} modalData={modalData} />
    </Flex>
  );
};

export default ClientesStatus;
