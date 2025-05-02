import { HamburgerIcon } from '@chakra-ui/icons';
import { IconButton } from '@chakra-ui/react';
import { Dispatch, SetStateAction } from 'react';

const HamburguerButton = ({
  mx,
  setOpen,
}: {
  mx: number | number[];
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => (
  <IconButton
    aria-label='hamburguer-icon'
    as={HamburgerIcon}
    alignSelf='center'
    bg='transparent'
    color='white'
    _hover={{ opacity: 0.65 }}
    _active={{ opacity: 0.65 }}
    mx={mx}
    cursor='pointer'
    onClick={() => setOpen((prev) => !prev)}
    size='sm'
  />
);
export default HamburguerButton;
