import CargaCompraFormPage from '@/components/compras/CargaCompraFormPage';
import { FormProvider } from '@/context/useCobrarFormContext';

const Alta = () => {
  return (
    <FormProvider>
      <CargaCompraFormPage />
    </FormProvider>
  );
};

export default Alta;
