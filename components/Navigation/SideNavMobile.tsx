import { useUser } from '@/context/userContext';
import { Routes } from '@/data/data';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Icon,
  Image,
  ListItem,
  Text,
  UnorderedList,
  useBreakpointValue,
  useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';

const SideNavMobile = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) => {
  const { user } = useUser();
  const isOnline = user !== null;
  const { pathname, push } = useRouter();
  const handleRoute = (thisRoute: string) => {
    push(thisRoute), onClose();
  };
  const imageWidth = useBreakpointValue(['70%', '80%', '90%', '90%', '90%']);
  const customBG = useColorModeValue(
    'linear(to-t, gray.200, blue.500)',
    'linear(to-t, gray.700, blue.500)'
  );
  if (!isOnline) return <></>;
  return (
    <Drawer isOpen={open} placement='left' onClose={onClose}>
      <DrawerOverlay />
      <DrawerContent maxW='300px'>
        <DrawerCloseButton
          boxShadow='0 0 3px'
          size='sm'
          _hover={{ bg: 'gray.300' }}
          zIndex={10}
        />
        <DrawerHeader
          h={['3.6rem', '4.9rem']}
          padding={2}
          bgGradient={customBG}
        >
          <Flex flexDir='column' w='100%'>
            <Image
              alt='dodolink-logo'
              width={imageWidth}
              style={{
                objectFit: 'contain',
                borderRadius: '5px',
                objectPosition: '0',
                height: '100%',
              }}
              filter='drop-shadow(0 0 2px rgba(0, 0, 0, 0.5))'
              src='/Hlogo.png'
            />
          </Flex>
        </DrawerHeader>

        <DrawerBody p={[2, 3, 4, 5, 6]} mt={5}>
          <Flex
            position='sticky'
            top={0}
            zIndex={1000}
            gap={2}
            flexDir='column'
          >
            {Routes.map((i, ind) => {
              const { iconFilled, subRoutes, iconEmpty, label, route, roles } =
                i;
              if (!roles.includes(user?.rol || '')) return;
              const iconSelected = pathname === route ? iconFilled : iconEmpty;
              return (
                <Flex key={`icon-key-${ind}-${route}`} flexDir='column'>
                  <Flex
                    onClick={() =>
                      handleRoute(`/${route === 'Inicio' ? '' : route}`)
                    }
                    cursor='pointer'
                    borderRadius='5px'
                    align='center'
                    gap={1}
                    fontWeight='normal'
                    _hover={{ fontWeight: 'bold' }}
                  >
                    <Icon fontSize={30} as={iconSelected} />
                    <Text fontSize='lg'>{label}</Text>
                  </Flex>
                  {/* {rutas.length > 0 && <Divider borderColor='gray' />} */}
                  <UnorderedList p={2} mr={1} flexDir='column'>
                    {subRoutes.map((r, ind) => {
                      const { label, route, roles } = r;
                      if (!roles.includes(user?.rol || '')) return;
                      const customRoute = `/${route}`;
                      return (
                        <ListItem
                          fontSize='md'
                          key={`custom-key-${`/${route}`}-${ind}`}
                          onClick={() => {
                            handleRoute(customRoute);
                          }}
                          cursor='pointer'
                          fontWeight='normal'
                          _hover={{ fontWeight: 'bold' }}
                        >
                          {label}
                        </ListItem>
                      );
                    })}
                  </UnorderedList>
                </Flex>
              );
            })}
          </Flex>
        </DrawerBody>

        {/* <DrawerFooter>
        <Button variant='outline' mr={3} onClick={onClose}>
          Cancel
        </Button>
        <Button colorScheme='blue'>Save</Button>
      </DrawerFooter> */}
      </DrawerContent>
    </Drawer>
  );
};

export default SideNavMobile;
