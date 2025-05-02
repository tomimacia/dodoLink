import { Routes } from '@/data/data';
import useAdminAuth from '@/hooks/useAdminAuth';
import { SubNavItemType } from '@/types/types';
import { Divider, Flex } from '@chakra-ui/react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';
import ChildrenLayout from '../ChildrenLayout';
import NotAuthorized from '../Navigation/NotAuthorized';
import SideNav from '../Navigation/SideNav';

const MainChildren = ({ children }: { children: ReactNode }) => {
  const { pathname } = useRouter();
  const customPath = pathname.split('/')[1];

  // Buscar la ruta en la nueva estructura de rutas
  const currentRoute = Routes.find((r) => r.route === customPath);
  const isAuthAdmin = useAdminAuth();
  return (
    <Flex mt={['3.6rem', '4.9rem']} w='100%'>
      <SideNav />
      <Flex w='100%' flexDir='column'>
        <Divider my={1} alignSelf='center' w='95%' />
        <motion.div
          style={{
            display: 'flex',
            paddingBottom: '4rem',
          }}
          key={customPath}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {isAuthAdmin ? (
            <Flex px={[1, 2, 3, 4, 5]} mx='auto' maxW='1400px' w='100%'>
              <ChildrenLayout
                show={!!currentRoute} // Muestra el layout si la ruta existe
                subNavItems={
                  (currentRoute?.subRoutes as SubNavItemType[]) || []
                }
                title={customPath}
              >
                {children}
              </ChildrenLayout>
            </Flex>
          ) : (
            <NotAuthorized />
          )}
        </motion.div>
      </Flex>
    </Flex>
  );
};

export default MainChildren;
