import { addDots } from '@/helpers/addDots';
import { IngresoType } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionItem,
  AccordionPanel,
  Divider,
  Flex,
  Heading,
  Text,
} from '@chakra-ui/react';
import IndexTable from './Index/IndexTable';
const IngresosSeccion = ({
  seccion,
  title,
  total,
  deleteIngreso,
  isIngreso,
}: {
  seccion: IngresoType[];
  title: string;
  total: number;
  isIngreso?: boolean;
  deleteIngreso: (day: string, time: number) => Promise<void>;
}) => {
  return (
    <Flex
      gap={1}
      w='100%'
      boxShadow='0 0 5px'
      p={2}
      borderRadius={5}
      flexDir='column'
    >
      <Flex justify='space-between' align='flex-end' gap={3}>
        <Heading size='md'>{title}</Heading>
        <Text fontStyle='italic'>
          Movimientos: <b>{seccion.length}</b>
        </Text>
      </Flex>
      <Divider borderColor='gray' />
      <Accordion borderRadius={5} w='100%' mx={1} allowToggle>
        <AccordionItem>
          {({ isExpanded }) => (
            <>
              <h2>
                <AccordionButton
                  h='25px'
                  mx='auto'
                  w='100%'
                  _hover={{ textDecor: 'underline' }}
                  borderRadius={5}
                >
                  <Text w='100%' textAlign='center'>
                    {isExpanded ? 'Ver Menos' : 'Ver Más'}
                  </Text>
                </AccordionButton>
              </h2>
              <AccordionPanel pb={4}>
                <IndexTable
                  arr={seccion}
                  isIngreso={isIngreso ? true : false}
                  deleteMovimiento={deleteIngreso}
                />
              </AccordionPanel>
            </>
          )}
        </AccordionItem>
      </Accordion>
    </Flex>
  );
};

export default IngresosSeccion;
