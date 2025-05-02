import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { PedidoType } from '@/types/types';
import { BellIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const NotificationsButton = () => {
  const { reservas, compras } = useOnCurso();
  const { user } = useUser();
  const notifications =
    reservas?.filter((r) => !r.vistoPor.some((v) => v === user?.id)) || [];
  const { push } = useRouter();
  const updatePedido = (p: PedidoType) => {
    const { id, isPago } = p;
    const field = isPago ? 'compras' : 'reservas';
    const arr = isPago ? compras : reservas;
    const newField = arr?.map((ped) =>
      id === ped.id ? { ...ped, vistoPor: [...ped.vistoPor, user?.id] } : ped
    );
    setSingleDoc('movimientos', 'enCurso', {
      [field]: newField,
    });
    push(`/PedidosID/${id}`);
  };
  const customImageBG = useColorModeValue('gray.500', 'gray.700');
  return (
    <Flex pos='relative'>
      {notifications.length > 0 && (
        <Box
          pos='absolute'
          top={-1}
          right={-1}
          bg='red.500'
          color='white'
          borderRadius='full'
          h='1.25rem'
          minW='1.25rem'
          fontSize='xs'
          display='flex'
          alignItems='center'
          justifyContent='center'
          zIndex={1}
          pointerEvents='none'
        >
          {notifications.length}
        </Box>
      )}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<BellIcon />}
          variant='outline'
          borderColor='gray'
          _hover={{ opacity: 0.65 }}
          borderRadius='50%'
          fontSize={20}
          size='sm'
          color={customImageBG}
          bg='white'
          // _active={{ bg: 'gray.600' }}
        />
        <MenuList boxShadow='rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 5px 40px'>
          {notifications?.map((n, ind) => {
            return (
              <MenuItem
                onClick={() => updatePedido(n)}
                key={`notification-key-${n}-${ind}`}
              >
                {`${n.isPago ? 'Compra' : 'Reserva'} - `}
                {n.cliente}
              </MenuItem>
            );
          })}
          {notifications.length === 0 && (
            <MenuItem>No tienes notificaciones</MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NotificationsButton;
