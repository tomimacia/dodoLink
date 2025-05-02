import { NavLinkType } from '@/types/types';
import { Text } from '@chakra-ui/react';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
export const NavLink = ({ title, href, onClick }: NavLinkType) => {
  const { asPath } = useRouter();
  const currentSection = asPath.split('/')[1];
  const isSelected = currentSection === href.split('/')[1];
  return (
    <Text
      as={NextLink}
      px={2}
      py={1.5}
      fontSize={20}
      fontWeight='medium'
      _hover={{ textDecor: 'underline' }}
      textDecor={isSelected ? 'underline' : 'none'}
      borderRadius='6px'
      href={href}
      onClick={onClick}
      fontFamily='raleway'
    >
      {title}
    </Text>
  );
};
