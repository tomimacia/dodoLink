import useGetProductos from '@/hooks/data/useGetProductos';
import { ProductoType } from '@/types/types';
import { Flex, Progress } from '@chakra-ui/react';
import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useState,
} from 'react';

interface FormContextProps {
  items: ProductoType[];
  setItems: (items: ProductoType[]) => void;
  cliente: string;
  setCliente: Dispatch<SetStateAction<string>>;
  detalle: string;
  setDetalle: Dispatch<SetStateAction<string>>;
  productos: ProductoType[] | null;
  resetFilters: () => void;
  setProductos: (newProductos: ProductoType[]) => void;
  loadingProductos: boolean;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const { productos, loadingProductos, setProductos } = useGetProductos(true);
  const [items, setItems] = useState<ProductoType[]>([]);
  const [cliente, setCliente] = useState('');
  const [detalle, setDetalle] = useState('');
  const resetFilters = () => {
    setDetalle('');
    setCliente('');
    setItems([]);
  };
  return (
    <FormContext.Provider
      value={{
        items,
        setItems,
        loadingProductos,
        // availableProducts,
        resetFilters,
        cliente,
        setCliente,
        detalle,
        setDetalle,
        productos,
        setProductos,
      }}
    >
      {loadingProductos && (
        <Flex pos='absolute' top={2} left={0} w='100vw' h='5px' zIndex={20000}>
          <Progress
            h='100%'
            colorScheme='blue'
            bg='transparent'
            w='100%'
            isIndeterminate
          />
        </Flex>
      )}
      {children}
    </FormContext.Provider>
  );
};

export const useCobrarFormContext = () => {
  const context = useContext(FormContext);
  if (!context)
    throw new Error('useFormContext must be used within a FormProvider');
  return context;
};
