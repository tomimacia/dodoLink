import {
  DiasParaInhabilitacion,
  limiteCtaCte,
  MinutosPermisoDelete,
} from '@/data/data';
import { addDots } from '@/helpers/addDots';
import { Flex, Text } from '@chakra-ui/react';
import PopoverInfoIcon from '../inicio/PopoverInfoIcon';

const AppData = () => {
  return (
    <Flex boxShadow='0 0 3px' p={1} borderRadius={5} flexDir='column'>
      <Flex justify='space-between'>
        <Flex align='center' gap={1}>
          <PopoverInfoIcon size={14}>
            <Text>Límite de monto de cuenta corriente por cliente</Text>
          </PopoverInfoIcon>
          <Text>Límite de cta/cte: </Text>
        </Flex>
        <b>${addDots(limiteCtaCte)} </b>
      </Flex>
      <Flex justify='space-between'>
        <Flex align='center' gap={1}>
          <PopoverInfoIcon size={14}>
            <Text>
              Límite de tolerancia para inhabilitar a cliente vencidos
            </Text>
          </PopoverInfoIcon>
          <Text>Tolerancia vencimiento: </Text>
        </Flex>
        <b>{DiasParaInhabilitacion} días </b>
      </Flex>
      <Flex justify='space-between'>
        <Flex align='center' gap={1}>
          <PopoverInfoIcon size={14}>
            <Text>
              Límite de tiempo de Admins para eliminar ingresos o egresos
            </Text>
          </PopoverInfoIcon>
          <Text>Eliminar movimientos: </Text>
        </Flex>
        <b>{MinutosPermisoDelete} min. </b>
      </Flex>
    </Flex>
  );
};

export default AppData;
