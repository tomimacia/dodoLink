import { SubNavItemType } from '@/types/types';
import { Flex, Heading } from '@chakra-ui/react';
import { ReactNode } from 'react';
import SubNav from './Navigation/SubNav';

const ChildrenLayout = ({
  title,
  children,
  subNavItems,
  show,
}: {
  title: string;
  show: boolean;
  children: ReactNode;
  subNavItems: SubNavItemType[];
}) => {
  if (!show)
    return (
      <Flex py={1} w='100%' flexDir='column'>
        {children}
      </Flex>
    );
  return (
    <Flex py={1} w='100%' flexDir='column'>
      <SubNav subNavItems={subNavItems} />
      {title && (
        <Heading textAlign='center' size='lg'>
          {title}
        </Heading>
      )}

      {children}
    </Flex>
  );
};

export default ChildrenLayout;
