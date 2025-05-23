import { FormProvider } from '@/context/useCobrarFormContext';
import { useUser } from '@/context/userContext';
import { CheckAdminRol } from '@/data/data';
import WelcomeComp from './WelcomeComp';
import WelcomeCuadrilla from './WelcomeCuadrilla';

const WelcomeCompContext = () => {
  const { user } = useUser();
  return CheckAdminRol(user?.rol) ? (
    <FormProvider>
      <WelcomeComp />
    </FormProvider>
  ) : (
    <WelcomeCuadrilla />
  );
};

export default WelcomeCompContext;
