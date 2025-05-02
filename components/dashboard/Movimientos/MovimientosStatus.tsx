import { useMovimientosGraph } from '@/context/useMovGraphContext';
import { addDots } from '@/helpers/addDots';
import { Divider, Flex, Heading, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import DateSelector from './DateSelector';
import { TimeData } from '@/data/data';
import dateTexto from '@/helpers/dateTexto';
import MotionContainer from '../MotionContainer';

const MovimientosStatus = () => {
  const { data, date, month, lapso, loading } = useMovimientosGraph();
  const customHeigth = ['100px', '110px', '120px', '130px', '200px'];
  const getTotal = () => {
    return data.reduce(
      (acc: any, i: any) => {
        const { Ingresos, Egresos } = i;
        return (acc = {
          Ingresos: acc.Ingresos + Ingresos,
          Egresos: acc.Egresos + Egresos,
        });
      },
      { Ingresos: 0, Egresos: 0 }
    );
  };
  const { Egresos, Ingresos } = getTotal();
  const customWidth = '170px';
  const customFontSize = '3xl';
  return (
    <Flex gap={2} flexDir='column' w='fit-content'>
      <DateSelector>
        <AnimatePresence mode='wait'>
          {!loading && (
            <motion.div
              key={`label-month-key-${month}-${date.getTime()}`}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              initial={{ opacity: 0 }}
            >
              <Heading as='h3' fontSize='xl'>
                {lapso === 'Diario' &&
                  dateTexto(date.getTime() / 1000, true).numDate}
                {lapso === 'Mensual' && `${TimeData.meses[month]} - 2025`}
              </Heading>
            </motion.div>
          )}
        </AnimatePresence>
      </DateSelector>
      <Flex
        flexDir='column'
        borderRadius={5}
        gap={2}
        p={2}
        mb={2}
        color='white'
        bg='blue.800'
        maxH='50%'
        h={customHeigth}
      >
        <Flex gap={1} flexDir='column'>
          <Text fontWeight='bold'>Total Facturado Neto</Text>
          <Divider borderColor='gray.400' w='100%' />
        </Flex>
        <MotionContainer
          loading={loading}
          customKey={`neto-key-${Ingresos}-${Egresos}`}
        >
          <Text fontSize={['5xl', '5xl', '6xl', '6xl', '7xl']} lineHeight={1}>
            ${addDots(Ingresos - Egresos)}
          </Text>
        </MotionContainer>
      </Flex>

      <Flex w='100%' flexDir='row' gap={1}>
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
            <Text>Ingresos</Text>
            <Divider borderColor='gray.400' w='100%' />
          </Flex>
          <MotionContainer
            loading={loading}
            customKey={`ingresos-key-${Ingresos}-${Egresos}`}
          >
            <Text fontSize={customFontSize}>${addDots(Ingresos)}</Text>
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
          bg='#821f0d'
        >
          <Flex gap={1} flexDir='column'>
            <Text>Egresos</Text>
            <Divider borderColor='gray.400' w='100%' />
          </Flex>
          <MotionContainer customKey={`egresos-key-${Egresos}-${Ingresos}`}>
            <Text fontSize={customFontSize}>${addDots(Egresos)}</Text>
          </MotionContainer>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default MovimientosStatus;
