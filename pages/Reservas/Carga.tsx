import CargaReservaFormPage from '@/components/reservas/CargaReservaFormPage';
import { FormProvider } from '@/context/useCobrarFormContext';

const Alta = () => {
  // return <AltaCliente />;
  return (
    <FormProvider>
      <CargaReservaFormPage />;
    </FormProvider>
  );
};

export default Alta;
