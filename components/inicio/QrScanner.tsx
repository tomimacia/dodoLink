import { useThemeColors } from '@/hooks/useThemeColors';
import {
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  useDisclosure,
} from '@chakra-ui/react';
import { Scanner } from '@yudiel/react-qr-scanner';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { FaQrcode } from 'react-icons/fa';
import ReactLoading from 'react-loading';
const QrScanner = ({
  title,
  getRoute,
}: {
  title: string;
  getRoute: (id: string) => string;
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const startLoading = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 5000);
  };
  const { brandColorLigth, brandColorDark } = useThemeColors();
  return (
    <>
      <Button
        bg={brandColorLigth}
        color={brandColorDark}
        size='sm'
        w='fit-content'
        _hover={{ opacity: 0.65 }}
        onClick={onOpen}
        isLoading={loading}
        rightIcon={<FaQrcode />}
      >
        Escanear QR
      </Button>
      <Modal
        size={['xl', '2xl', '3xl', '3xl']}
        isCentered
        blockScrollOnMount={false}
        isOpen={isOpen}
        onClose={onClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton
            zIndex={10}
            _hover={{ bg: 'blackAlpha.400' }}
            bg='blackAlpha.200'
          />
          <ModalHeader>{title}</ModalHeader>
          <ModalBody p={5}>
            <Flex position='relative'>
              <Scanner
                onScan={(scanResult) => {
                  startLoading();
                  if (scanResult.length > 0) {
                    router.push(getRoute(scanResult[0]?.rawValue));
                  }
                }}
              />
              {loading && (
                <Flex
                  justify='center'
                  align='center'
                  pos='absolute'
                  bg='blackAlpha.900'
                  h='100%'
                  w='100%'
                >
                  <ReactLoading
                    width='30%'
                    type='spinningBubbles'
                    color='#FFF'
                  />
                </Flex>
              )}
            </Flex>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default QrScanner;
