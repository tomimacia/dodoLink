import useGetProductos from '@/hooks/data/useGetProductos';
import { ProductoType } from '@/types/types';
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
  isPago?: boolean;
  productos: ProductoType[] | null;
  resetFilters: () => void;
  setIsPago: (newIsPago: boolean) => void;
  setProductos: (newProductos: ProductoType[]) => void; 
  loadingProductos: boolean;
}

const FormContext = createContext<FormContextProps | undefined>(undefined);

export const FormProvider = ({ children }: { children: React.ReactNode }) => {
  const [isPago, setIsPago] = useState(false);
  const { productos, loadingProductos, setProductos } =
    useGetProductos();
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
        isPago,
        productos,
        setProductos,
        setIsPago,
      }}
    >
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
