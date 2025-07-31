import { Badge, Wrap, WrapItem } from '@chakra-ui/react';

const MainServiceData = ({ producto }: { producto: any }) => {
  const { type, paytype, proratabilling, is_featured, hidden } = producto;
  return (
    <Wrap mb={6} spacing={2}>
      <WrapItem>
        <Badge variant='subtle' colorScheme='blue'>
          Tipo: {type}
        </Badge>
      </WrapItem>
      <WrapItem>
        <Badge variant='subtle' colorScheme='green'>
          Pago: {paytype}
        </Badge>
      </WrapItem>
      <WrapItem>
        <Badge variant='subtle' colorScheme={hidden ? 'gray' : 'purple'}>
          {hidden ? 'Oculto' : 'Visible'}
        </Badge>
      </WrapItem>
      {is_featured === 1 && (
        <WrapItem>
          <Badge variant='subtle' colorScheme='pink'>
            Destacado
          </Badge>
        </WrapItem>
      )}
      {proratabilling === 1 && (
        <WrapItem>
          <Badge variant='subtle' colorScheme='yellow'>
            Prorrata
          </Badge>
        </WrapItem>
      )}
    </Wrap>
  );
};

export default MainServiceData;
