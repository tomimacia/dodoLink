import {
  Popover,
  PopoverArrow,
  PopoverBody,
  PopoverContent,
  PopoverTrigger,
} from '@chakra-ui/react';
import { ReactNode } from 'react';
import { BsInfoCircle } from 'react-icons/bs';

const PopoverInfoIcon = ({
  children,
  size = 20,
}: {
  children: ReactNode;
  size?: number;
}) => {
  return (
    <Popover placement='top' gutter={4}>
      <PopoverTrigger>
        <span>
          <BsInfoCircle cursor='pointer' fontSize={size} />
        </span>
      </PopoverTrigger>
      <PopoverContent boxShadow='lg' p={2}>
        <PopoverArrow />
        <PopoverBody fontSize='sm'>{children}</PopoverBody>
      </PopoverContent>
    </Popover>
  );
};

export default PopoverInfoIcon;
