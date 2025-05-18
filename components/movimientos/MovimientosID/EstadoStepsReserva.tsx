import { useThemeColors } from '@/hooks/useThemeColors';
import { EstadoColors, Estados, EstadoType } from '@/types/types';
import {
  Box,
  Flex,
  Step,
  StepDescription,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  Text,
  useBreakpointValue,
  useColorModeValue,
  useSteps,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';
const descriptions = {
  Inicializado: 'Verificación de datos',
  Preparación: 'Preparado materiales',
  Pendiente: 'Listo para retirar',
  'En curso': 'Proceso de instalación',
};
const steps = Estados.filter((est) => est !== 'Finalizado').map((e) => {
  return { title: e, description: descriptions[e] };
});

const MotionStepIndicator = motion(StepIndicator);

const EstadoStepsReserva = ({ estado }: { estado: EstadoType }) => {
  const { activeStep, setActiveStep } = useSteps({
    index: estado === 'Finalizado' ? Estados.length : Estados.indexOf(estado),
    count: steps.length,
  });
  useEffect(() => {
    const newStep =
      estado === 'Finalizado' ? Estados.length : Estados.indexOf(estado);
    setActiveStep(newStep);
  }, [estado]);
  const customOrientation = useBreakpointValue([
    'vertical',
    'vertical',
    'vertical',
    'horizontal',
  ]);
  const { invertedTextColor } = useThemeColors();
  const prevColor =
    EstadoColors[Estados[Estados.indexOf(estado) - 1]] ?? 'gray';
  const customBlue = useColorModeValue('blue', '#8FCDF4');
  const customGreen = useColorModeValue('green', '#9AE6B4');
  const customWhite = useColorModeValue('white', 'gray.50');
  const stepColor = {
    Inicializado: 'gray',
    Preparación: customBlue,
    Pendiente: customBlue,
    'En curso': customBlue,
    Finalizado: customGreen,
  };
  return (
    <Flex flexDir='column' gap={2}>
      <Flex flexDir='column'>
        <motion.div
          key={EstadoColors[estado]}
          style={{
            display: 'flex',
            borderRadius: '10px',
            gap: 8,
            flexDirection: 'column',
            paddingRight: 6,
            paddingLeft: 6,
            color: invertedTextColor,
            width: 'fit-content',
          }}
          initial={{ backgroundColor: prevColor }}
          animate={{ backgroundColor: EstadoColors[estado] }}
          transition={{ duration: 1 }}
        >
          <Flex color={customWhite} fontSize='lg' w='fit-content' gap={2}>
            <Text>Estado:</Text>

            <motion.p
              style={{ fontWeight: 'bold' }}
              initial={{ y: -20 }}
              animate={{ y: 0 }}
              transition={{ type: 'tween' }}
            >
              {estado}
            </motion.p>
          </Flex>
        </motion.div>
        <Text fontStyle='italic' fontSize='sm'>
          {steps[activeStep]?.description || 'Pedido concluido'}
        </Text>
      </Flex>
      <AnimatePresence mode='wait'>
        <motion.div
          key={estado}
          style={{
            display: 'flex',
            flexDirection: 'column',
          }}
          initial={{ x: 50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -50, opacity: 0 }}
          transition={{ type: 'tween', duration: 0.5 }}
        >
          <Stepper
            colorScheme={estado === 'Finalizado' ? 'green' : 'blue'}
            orientation={customOrientation as any}
            index={activeStep}
            size='sm'
            maxW='900px'
            gap={1}
            boxShadow='0 0 5px'
            p='8px 4px'
            borderRadius={10}
          >
            {steps.map((step, index) => (
              <Step key={index + step.title}>
                {index === activeStep ? (
                  <MotionStepIndicator
                    animate={{ borderColor: ['#90CDF4', '#3182CE', '#90CDF4'] }}
                    transition={{
                      repeat: Infinity,
                      duration: 3,
                      ease: 'easeInOut',
                    }}
                    borderWidth='2px'
                  >
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </MotionStepIndicator>
                ) : (
                  <StepIndicator>
                    <StepStatus
                      complete={<StepIcon />}
                      incomplete={<StepNumber />}
                      active={<StepNumber />}
                    />
                  </StepIndicator>
                )}

                <Box flexShrink='0'>
                  <StepTitle>{step.title}</StepTitle>
                  <StepDescription>{step.description}</StepDescription>
                </Box>

                <StepSeparator>
                  {index === activeStep - 1 ? (
                    <Box
                      height='2px'
                      width='100%'
                      bg='gray.300'
                      overflow='hidden'
                      position='relative'
                    >
                      <motion.div
                        style={{
                          height: '100%',
                          width: '100%',
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          backgroundColor: stepColor[estado], // blue.600
                          transformOrigin: 'left',
                        }}
                        animate={{ scaleX: [0.5, 1, 0.5] }}
                        transition={{
                          repeat: Infinity,
                          duration: 3,
                          ease: 'easeInOut',
                        }}
                      />
                    </Box>
                  ) : (
                    <Box
                      height='2px'
                      width='100%'
                      bg={
                        index < activeStep - 1 ? stepColor[estado] : 'gray.300'
                      }
                    />
                  )}
                </StepSeparator>
              </Step>
            ))}
          </Stepper>
        </motion.div>
      </AnimatePresence>
    </Flex>
  );
};

export default EstadoStepsReserva;
