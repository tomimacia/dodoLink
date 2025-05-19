import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ProductoType } from '@/types/types';
import { MinusIcon } from '@chakra-ui/icons';
import {
  Button,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  HStack,
  IconButton,
  Input,
  NumberInput,
  NumberInputField,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import React, { useEffect, useState } from 'react';
import AgregarCodigo from './AgregarCodigo';
import _ from 'lodash';
const ProductoForm = ({
  producto,
  onClose,
  updateProducto,
  setNewProducto,
}: {
  producto: ProductoType;
  onClose: () => void;
  updateProducto: (productID: string, producto: ProductoType) => Promise<void>;
  setNewProducto?: (newProducto: ProductoType) => void;
}) => {
  const { codigo, ...rest } = producto;
  const [formData, setFormData] = useState({ ...rest });
  const [codigos, setCodigos] = useState(codigo);
  const [loading, setLoading] = useState(false);
  const [cantidadEnPacks, setCantidaEnPacks] = useState(
    formData.cantidad / formData.cantidadPorPack
  );
  const toast = useToast();
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  useEffect(() => {
    setCantidaEnPacks(formData.cantidad / formData.cantidadPorPack);
  }, [formData.cantidad, formData.cantidadPorPack]);
  const handleNumberChange = (_: string, valueAsNumber: number) => {
    setFormData((prev) => ({ ...prev, cantidadPorPack: valueAsNumber }));
  };
  const submit = async (e: any) => {
    e.preventDefault();
    // Compara formData (producto sin codigos) + codigo, contra el producto a ver si hay cambios
    if (_.isEqual({ ...formData, codigo: codigos }, producto))
      return toast({
        title: 'No hay cambios',
        description: 'No se realizaron cambios en el producto',
        status: 'info',
        duration: 4000,
        isClosable: true,
      });
    setLoading(true);
    try {
      const newProducto = {
        ...formData,
        codigo: codigos,
      };
      await setSingleDoc('productos', producto.id, newProducto);
      await updateProducto(producto.id, newProducto);
      if (setNewProducto) setNewProducto(newProducto);
      toast({
        title: 'Actualizado',
        description: `${producto.nombre} actualizado con éxito`,
        status: 'success',
        duration: 4000,
        isClosable: true,
      });
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Ocurrió un error al intentar editar el producto',
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
      onClose();
    }
  };
  const deleteCodigo = (ind: number) => {
    const newCodigos = codigos.filter((_, i) => i !== ind);
    setCodigos(newCodigos);
  };
  const handlePacks = (isSum: boolean) => {
    setCantidaEnPacks((prev) => prev + (isSum ? 1 : -1));
    setFormData((prev) => ({
      ...prev,
      cantidad:
        prev.cantidad + (isSum ? prev.cantidadPorPack : -prev.cantidadPorPack),
    }));
  };
  const buttonBG = useColorModeValue('gray.700', 'white');
  const buttonColor = useColorModeValue('white', 'gray.900');
  return (
    <Flex flexDir='column' gap={4}>
      <Heading textAlign='center' size='md'>
        {producto.nombre}
      </Heading>
      <Flex p={2} mt={2} flexDir='column' gap={2}>
        {/* Nombre */}
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Nombre</FormLabel>
          <Input
            borderColor='gray'
            borderRadius={5}
            size='sm'
            autoComplete='off'
            formNoValidate
            required
            name='nombre'
            maxW='300px'
            value={formData.nombre}
            onChange={handleChange}
          />
        </FormControl>

        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Cantidad</FormLabel>
          <NumberInput
            borderColor='gray'
            borderRadius={5}
            size='sm'
            w='100%'
            maxW='300px'
            value={formData.cantidad || 0}
            onChange={(valueAsString, valueAsNumber) =>
              setFormData((prev) => ({ ...prev, cantidad: valueAsNumber }))
            }
            min={0}
          >
            <NumberInputField required />
          </NumberInput>
        </FormControl>
        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Total en Packs</FormLabel>
          <HStack gap={5} maxW='320px'>
            <Button
              size='sm'
              bg={buttonBG}
              color={buttonColor}
              _hover={{ opacity: 0.7 }}
              fontSize='lg'
              onClick={() => handlePacks(true)}
            >
              +
            </Button>
            <Text fontWeight='bold'>{cantidadEnPacks.toFixed(2)}</Text>
            <Button
              size='sm'
              fontSize='lg'
              bg={buttonBG}
              color={buttonColor}
              _hover={{ opacity: 0.7 }}
              onClick={() => handlePacks(false)}
            >
              -
            </Button>
          </HStack>
        </FormControl>
        <Divider borderColor='gray' />
        {/* Medida */}
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Medida</FormLabel>
          <Select
            borderColor='gray'
            borderRadius={5}
            size='sm'
            w='100%'
            cursor='pointer'
            maxW='80px'
            name='medida'
            value={formData.medida}
            onChange={handleChange}
          >
            <option value='Un.'>Un.</option>
            <option value='Kg.'>Kg.</option>
            <option value='Mt.'>Mt.</option>
          </Select>
        </FormControl>
        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Cantidad por Pack</FormLabel>
          <NumberInput
            borderColor='gray'
            borderRadius={5}
            size='sm'
            w='100%'
            maxW='300px'
            value={formData.cantidadPorPack || 0}
            onChange={handleNumberChange}
            min={0}
          >
            <NumberInputField required />
          </NumberInput>
        </FormControl>
        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Target</FormLabel>
          <NumberInput
            borderColor='gray'
            borderRadius={5}
            size='sm'
            w='100%'
            maxW='300px'
            value={formData.target || 1}
            onChange={(valueAsString, valueAsNumber) =>
              setFormData((prev) => ({ ...prev, target: valueAsNumber }))
            }
            min={0}
          >
            <NumberInputField required />
          </NumberInput>
        </FormControl>
        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          alignItems='center'
          justifyContent='space-between'
        >
          <FormLabel>Empresa</FormLabel>
          <Select
            borderColor='gray'
            borderRadius={5}
            size='sm'
            cursor='pointer'
            w='fit-content'
            name='empresa'
            value={formData.empresa}
            onChange={handleChange}
          >
            <option value='dodoLink'>dodoLink</option>
            <option value='Grupo IN'>Grupo IN</option>
          </Select>
        </FormControl>

        {/* Código */}
        <Divider borderColor='gray' />
        <FormControl
          display='flex'
          flexDir='column'
          justifyContent='space-between'
          gap={1}
        >
          <FormLabel>Códigos {!producto.codigo && '(No definido)'}</FormLabel>
          <Flex maxW='400px' gap={2} flexDir='column'>
            {codigos?.map((n, ind) => {
              return (
                <Flex
                  justify='space-between'
                  align='center'
                  key={`key-codigo-${ind}-${n}`}
                  gap={1}
                >
                  <Text>{codigos[ind]}</Text>
                  <IconButton
                    w='fit-content'
                    p={0}
                    color='white'
                    bg='gray.700'
                    size='xs'
                    onClick={() => deleteCodigo(ind)}
                    alignSelf='center'
                    _hover={{ opacity: 0.65 }}
                    aria-label='minus-codigo'
                    icon={<MinusIcon />}
                  />
                </Flex>
              );
            })}
          </Flex>
          <AgregarCodigo setCodigos={setCodigos} />
        </FormControl>
      </Flex>
      <Flex justify='flex-end' mt={4} gap={3}>
        <Button size='sm' onClick={onClose} variant='ghost'>
          Cancelar
        </Button>
        <Button
          isLoading={loading}
          size='sm'
          onClick={submit}
          colorScheme='blue'
        >
          Guardar
        </Button>
      </Flex>
    </Flex>
  );
};

export default ProductoForm;
