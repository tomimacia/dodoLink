import { useUser } from '@/context/userContext';
import { allRoutesWithRoles } from '@/data/data';
import { useRouter } from 'next/router';

const useAdminAuth = () => {
  const { user } = useUser();
  const { pathname } = useRouter();
  const thisRoute = allRoutesWithRoles.find((r) => r.route === pathname);
  const isAuthAdmin = !thisRoute || thisRoute?.roles.includes(user?.rol || '');
  return isAuthAdmin;
};

export default useAdminAuth;
