import { useUser } from '@/context/userContext';
import { Routes } from '@/data/data';
import { Flex, Icon, Text } from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SideNav = () => {
  const { pathname } = useRouter();
  const { user } = useUser();
  const customPath = pathname.split('/')[1];
  return (
    <Flex
      position='sticky'
      display={['none', 'none', 'flex', 'flex']}
      top={['3.6rem', '4.9rem']}
      gap={10}
      align='center'
      px={5}
      flexDir='column'
      zIndex={1}
      pt={5}
    >
      {Routes.map((i, ind) => {
        const { iconFilled, iconEmpty, label, route, roles } = i;
        if (!roles.includes(user?.rol || '')) return;
        const formatedRoute = `${route !== 'Inicio' ? route : ''}`;
        const isPath = customPath === formatedRoute;
        const iconSelected = isPath ? iconFilled : iconEmpty;
        return (
          <Flex
            as={Link}
            href={`/${formatedRoute}`}
            cursor='pointer'
            _hover={{ fontWeight: 'bold', color: 'gray.600' }}
            borderRadius='5px'
            align='center'
            justify='center'
            w='35px'
            key={`icon-key-${ind}-${formatedRoute}`}
            flexDir='column'
          >
            <motion.div
              key={`icon-key-${ind}-${
                isPath ? 'selectedPath' : 'notSelectedPath'
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.2 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Icon fontSize={30} as={iconSelected} />
            </motion.div>

            <Text fontSize='2xs'>{label}</Text>
          </Flex>
        );
      })}
    </Flex>
  );
};

export default SideNav;
