import { EditIcon } from '@chakra-ui/icons';
import {
  Box,
  Flex,
  Icon,
  Image,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChangeEvent, useEffect, useRef, useState } from 'react';
import { FaCloudUploadAlt, FaExpandAlt, FaTrash } from 'react-icons/fa';

type AddImagesProps = {
  defaultImage?: string | File;
  onConfirm: (file: File) => Promise<void> | void;
  width?: string | number;
  height?: string | number;
  imageFit?: 'cover' | 'contain';
  keyData: string;
};

const MotionFlex = motion(Flex);

const AddImages = ({
  defaultImage = '',
  onConfirm,
  width = 160,
  height = 130,
  imageFit = 'cover',
  keyData,
}: AddImagesProps) => {
  const [previewUrl, setPreviewUrl] = useState<string>(
    typeof defaultImage === 'string' ? defaultImage : ''
  );
  const [hovered, setHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [expandedImage, setExpandedImage] = useState(false);

  const bg = useColorModeValue('gray.100', 'gray.700');
  const border = useColorModeValue('gray.300', 'gray.500');

  // ✅ Manejar bien string vs File en defaultImage
  useEffect(() => {
    if (defaultImage instanceof File) {
      const objectUrl = URL.createObjectURL(defaultImage);
      setPreviewUrl(objectUrl);

      return () => URL.revokeObjectURL(objectUrl);
    } else if (typeof defaultImage === 'string') {
      setPreviewUrl(defaultImage);
    }
  }, [defaultImage]);

  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    setHovered(false);
    const file = e.target.files?.[0];
    if (file) {
      setLoading(true);
      try {
        await onConfirm(file);
        const objectUrl = URL.createObjectURL(file);
        setPreviewUrl(objectUrl);

        return () => URL.revokeObjectURL(objectUrl);
      } catch (e) {
        console.log(e);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Box
      position='relative'
      w={width}
      h={height}
      border={`2px dashed ${border}`}
      borderRadius='xl'
      cursor='pointer'
      overflow='hidden'
      boxShadow='0 0 3px'
      onClick={() => inputRef.current?.click()}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <Input
        type='file'
        accept='image/*'
        display='none'
        ref={inputRef}
        onChange={handleChange}
      />

      {previewUrl ? (
        <Image
          src={previewUrl}
          alt='Preview'
          objectFit={imageFit}
          w='100%'
          h='100%'
          filter={hovered ? 'brightness(0.6)' : 'none'}
          transition='0.2s ease'
        />
      ) : (
        <Flex
          direction='column'
          align='center'
          justify='center'
          h='100%'
          bg={bg}
          color='gray.500'
        >
          <Icon as={FaCloudUploadAlt} fontSize='2xl' mb={1} />
          <Text fontSize='sm'>Elegir imagen</Text>
        </Flex>
      )}

      {/* --- ICONOS flotantes --- */}
      <AnimatePresence>
        {hovered && (
          <MotionFlex
            key={`editIcon-${keyData}`}
            position='absolute'
            bottom={2}
            transform='translateX(-50%)'
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.3 }}
            align='center'
            justify='center'
            w='100%'
            pointerEvents='none'
          >
            <Flex
              bg='blackAlpha.300'
              borderRadius='full'
              p={1.5}
              justify='center'
            >
              <EditIcon color='white' boxSize={4} />
            </Flex>
          </MotionFlex>
        )}

        {/* expandir imagen */}
        {hovered && previewUrl && (
          <MotionFlex
            position='absolute'
            key={`expandIcon-${keyData}`}
            top={1}
            right={1}
            transform='translateX(-50%)'
            initial={{ opacity: 0, y: -20, x: 20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: 20 }}
            transition={{ duration: 0.3 }}
            align='center'
            justify='center'
          >
            <Flex
              borderRadius='lg'
              p={1.5}
              bg='blackAlpha.700'
              justify='center'
              onClick={(e) => {
                e.stopPropagation();
                setExpandedImage(true);
              }}
              _hover={{ opacity: 0.85, boxShadow: '0 0 3px' }}
            >
              <FaExpandAlt color='white' />
            </Flex>
          </MotionFlex>
        )}

        {/* borrar preview */}
        {hovered && previewUrl && (
          <MotionFlex
            position='absolute'
            key={`deleteicon-${keyData}`}
            top={1}
            left={1}
            transform='translateX(-50%)'
            initial={{ opacity: 0, y: -20, x: -20 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -20, x: -20 }}
            transition={{ duration: 0.3 }}
            align='center'
            justify='center'
          >
            <Flex
              borderRadius='lg'
              p={1.5}
              bg='blackAlpha.700'
              justify='center'
              onClick={(e) => {
                e.stopPropagation();
                setPreviewUrl(''); // ✅ resetea preview
                inputRef.current!.value = ''; // limpia input file
              }}
              _hover={{ opacity: 0.85, boxShadow: '0 0 3px' }}
            >
              <FaTrash color='white' />
            </Flex>
          </MotionFlex>
        )}
      </AnimatePresence>

      {/* modal expandido */}
      <AnimatePresence>
        {expandedImage && previewUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              backgroundColor: 'rgba(0,0,0,0.7)',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              zIndex: 9999,
              cursor: 'pointer',
            }}
            onClick={(e) => {
              e.stopPropagation();
              setExpandedImage(false);
            }}
          >
            <motion.img
              src={previewUrl}
              alt='Expanded'
              initial={{ scale: 0.85, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.85, opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
              style={{
                maxWidth: '90vw',
                maxHeight: '90vh',
                borderRadius: '10px',
                boxShadow: '0 0 20px rgba(255,255,255,0.1)',
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  );
};

export default AddImages;
