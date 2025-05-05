import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
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
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const NotificationButton = () => {
  const { reservas, compras } = useOnCurso();
  const { user } = useUser();
  const notificationsUnseen =
    reservas?.filter((r) => {
      const noVisto = !r.vistoPor.some((v) => v === user?.id);
      const puedeVer = r.estado === 'Pendiente' || CheckAdminRol(user?.rol);
      return noVisto && puedeVer;
    }) || [];
  const notificationsToShow =
    reservas?.filter((r) => {
      const puedeVer = r.estado === 'Pendiente' || CheckAdminRol(user?.rol);
      return puedeVer;
    }) || [];
  const { push } = useRouter();
  const updateNotifications = () => {
    if (notificationsUnseen.length > 0) {
      const actualizadas = reservas?.map((r) =>
        notificationsUnseen.some((n) => n.id === r.id)
          ? { ...r, vistoPor: [...r.vistoPor, user?.id] }
          : r
      );
      setSingleDoc('movimientos', 'enCurso', {
        reservas: actualizadas,
      });
    }
  };
  const customImageBG = useColorModeValue('gray.500', 'gray.700');
  const customSize = useBreakpointValue(['xs', 'sm', 'sm', 'sm', 'sm']) || 'sm';

  return (
    <Flex pos='relative'>
      {notificationsUnseen.length > 0 && (
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
          {notificationsUnseen.length}
        </Box>
      )}
      <Menu onOpen={updateNotifications}>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<BellIcon />}
          variant='outline'
          borderColor='gray'
          _hover={{ opacity: 0.65 }}
          borderRadius='50%'
          fontSize={[18, 20, 20, 20, 20]}
          size={customSize}
          color={customImageBG}
          bg='white'
          // _active={{ bg: 'gray.600' }}
        />
        <MenuList
          fontSize='sm'
          boxShadow='rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 5px 40px'
        >
          {notificationsToShow?.map((n, ind) => {
            return (
              <MenuItem
                onClick={() => push(`/PedidosID/${n.id}`)}
                key={`notification-key-${n}-${ind}`}
              >
                {`${n.isPago ? 'Compra' : 'Reserva'} - `}
                {n.cliente}
              </MenuItem>
            );
          })}
          {notificationsToShow.length === 0 && (
            <MenuItem bg='transparent' cursor='default'>
              No tienes notificaciones
            </MenuItem>
          )}
        </MenuList>
      </Menu>
    </Flex>
  );
};

export default NotificationButton;
