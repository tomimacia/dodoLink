import { useOnCurso } from '@/context/useOnCursoContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import { getEstado } from '@/helpers/cobros/getEstado';
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
import NextLink from 'next/link';

const NotificationButton = () => {
  const { reservas, compras, notas } = useOnCurso();
  const reservasYCompras = [...(reservas || []), ...(compras || [])];
  const { user } = useUser();
  const notasToShow =
    notas?.filter((r) => {
      const puedeVer = CheckAdminRol(user?.rol);
      return puedeVer;
    }) || [];
  const notasUnseen =
    notasToShow?.filter((r) => !r.vistoPor.some((v) => v === user?.id)) || [];
  const notificationsToShow =
    reservasYCompras?.filter((r) => {
      const puedeVer =
        (getEstado(r.movimientos) === 'Pendiente' && !r.isRetiro) ||
        CheckAdminRol(user?.rol);
      return puedeVer;
    }) || [];
  const notificationsUnseen =
    notificationsToShow?.filter((r) => {
      const noVisto = !r.vistoPor.some((v) => v === user?.id);
      return noVisto;
    }) || [];
  const toShow = [...notificationsToShow, ...notasToShow];
  const unseen = [...notasUnseen, ...notificationsUnseen];
  const customImageColor = useColorModeValue('#FFF', 'gray.700');
  const customImageGray = useColorModeValue('gray.100', 'gray.600');
  const customImageBG = useColorModeValue('gray.700', '#FFF');
  const customSize = useBreakpointValue(['xs', 'sm', 'sm', 'sm', 'sm']) || 'sm';

  return (
    <Flex pos='relative'>
      {unseen.length > 0 && (
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
          {unseen.length}
        </Box>
      )}
      <Menu>
        <MenuButton
          as={IconButton}
          aria-label='Options'
          icon={<BellIcon />}
          borderColor='gray'
          _hover={{ opacity: 0.65 }}
          borderRadius='50%'
          fontSize={[18, 20, 20, 20, 20]}
          size={customSize}
          color={customImageColor}
          bg={customImageBG}
          // _active={{ bg: 'gray.600' }}
        />
        <MenuList
          fontSize='sm'
          boxShadow='rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 5px 40px'
        >
          {toShow.map((n, ind) => {
            const noVisto = !n.vistoPor?.includes(user?.id || '');
            return (
              <MenuItem
                as={NextLink}
                href={`/PedidosID/${n.id}`}
                key={`notification-key-${n.id}-${ind}`}
                fontWeight={noVisto ? 'bold' : 'normal'}
                bg={noVisto ? customImageGray : 'transparent'}
                _hover={{
                  color: 'black',
                  bg: noVisto ? 'gray.200' : 'gray.100',
                  textDecor: 'none',
                }}
                display='flex'
                justifyContent='space-between'
                my={1}
              >
                <Box>{`${
                  n.isNota ? 'Nota' : n.isPago ? 'Compra' : 'Reserva'
                } - ${n.cliente}`}</Box>

                {noVisto && (
                  <Box
                    w='8px'
                    h='8px'
                    bg='red.500'
                    borderRadius='full'
                    ml={2}
                    alignSelf='center'
                  />
                )}
              </MenuItem>
            );
          })}
          {toShow.length === 0 && (
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
