import useOnSnapshot from '@/firebase/services/useOnSnapshot';
import { NotaType, PedidoType } from '@/types/types';
import { ReactNode, createContext, useContext } from 'react';

interface OnCursoContextType {
  data: any;
  loading: boolean;
  reservas?: PedidoType[];
  compras?: PedidoType[];
  notas?: NotaType[];
}

const OnCursoContext = createContext<OnCursoContextType | undefined>(undefined);

interface OnCursoProviderProps {
  children: ReactNode;
}

export const OnCursoProvider = ({ children }: OnCursoProviderProps) => {
  const { data, loading } = useOnSnapshot('movimientos', 'enCurso');
  const { reservas, compras, notas } = data ?? {};

  return (
    <OnCursoContext.Provider
      value={{ data, loading, reservas, compras, notas }}
    >
      {children}
    </OnCursoContext.Provider>
  );
};

export const useOnCurso = () => {
  const context = useContext(OnCursoContext);
  if (!context) {
    throw new Error('useOnCurso must be used within an OnCursoProvider');
  }
  return context;
};
