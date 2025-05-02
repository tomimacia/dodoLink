import { PedidoType } from '@/types/types';
import {
  Accordion,
  AccordionButton,
  AccordionIcon,
  AccordionItem,
  AccordionPanel,
  Box,
  Text,
  UnorderedList,
} from '@chakra-ui/react';

const HourRangeIngresos = ({ data }: { data: PedidoType[] }) => {
  return (
    <Accordion p={1} justifyContent='center' allowToggle>
      {data.toReversed().map((pedido) => {
        const { cliente, fecha, id } = pedido;
        return (
          <AccordionItem
            key={`hour-range-key${id}`}
            maxW='500px'
            boxShadow='0 0 5px'
            borderRadius={10}
            my={3}
          >
            <AccordionButton>
              <Box flex='1' textAlign='left'>
                <Text fontSize={18} fontWeight='bold'>
                  {cliente}
                </Text>
              </Box>
              <AccordionIcon />
            </AccordionButton>

            <AccordionPanel p={2}>
              <UnorderedList>
                {/* {data[hour]
                  ?.toReversed()
                  .map((client: ClientType, ind: number) => {
                    return (
                      <RangeListItem
                        key={`cliente-data-hour-key${client.DNI}-${ind}`}
                        client={client}
                      />
                    );
                  })} */}
              </UnorderedList>
            </AccordionPanel>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};

export default HourRangeIngresos;
