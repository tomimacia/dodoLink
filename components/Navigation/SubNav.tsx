import { useUser } from '@/context/userContext';
import { SubNavItemType } from '@/types/types';
import { Button, Flex } from '@chakra-ui/react';
import Link from 'next/link';
import { useRouter } from 'next/router';

const SubNav = ({ subNavItems }: { subNavItems: SubNavItemType[] }) => {
  const { user } = useUser();
  const { pathname } = useRouter();
  const customPath = pathname.split('/')[1];
  const showBackButton = `/${customPath}` !== pathname;
  return (
    <Flex
      zIndex={1}
      backdropFilter={'blur(20px)'}
      borderRadius={10}
      pos='sticky'
      top={0}
      gap={3}
      p={2}
      w='100%'
      justify='space-between'
    >
      <Flex gap={3}>
        {subNavItems.map((i) => {
          const { label, roles, route } = i;
          if (user && !roles.includes(user?.rol)) return;
          const finalRoute = `/${route}`;
          const isSelected = pathname === finalRoute;

          return (
            <Button
              key={`subnav-key-${finalRoute}`}
              _hover={{ opacity: 0.65 }}
              size='sm'
              border='1px solid gray'
              bg={isSelected ? 'gray.600' : 'transparent'}
              _active={{ opacity: 1 }}
              _focus={{ opacity: 1 }}
              color={isSelected ? 'white' : undefined}
              boxShadow={isSelected ? '0 0 5px' : undefined}
              as={Link}
              href={finalRoute}
            >
              {label}
            </Button>
          );
        })}
      </Flex>
      {showBackButton && (
        <Button
          bg='transparent'
          _hover={{ textDecor: 'underline' }}
          _active={{ bg: 'transparent' }}
          as={Link}
          href={`/${customPath}`}
          size='sm'
        >
          Volver
        </Button>
      )}
    </Flex>
  );
};

export default SubNav;
