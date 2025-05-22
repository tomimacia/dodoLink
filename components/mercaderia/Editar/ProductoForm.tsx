import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { ProductoType } from '@/types/types';
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Collapse,
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
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import _ from 'lodash';
import React, { useEffect, useState } from 'react';
const ProductoForm = ({
  producto,
  onClose,
  updateProducto,
  setNewProducto,
  allPacks,
}: {
  producto: ProductoType;
  onClose: () => void;
  updateProducto: (productID: string, producto: ProductoType) => Promise<void>;
  setNewProducto?: (newProducto: ProductoType) => void;
  allPacks: string[];
}) => {
  const { codigo, packs: packsFirst, ...rest } = producto;
  const { isOpen: isOpenCodigos, onToggle: onToggleCodigos } = useDisclosure();
  const { isOpen, onToggle } = useDisclosure();
  const [formData, setFormData] = useState({ ...rest });
  const [codigos, setCodigos] = useState(codigo);
  const [packs, setPacks] = useState<string[]>(packsFirst);
  const [manualPack, setManualPack] = useState('');
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
    if (_.isEqual({ ...formData, codigo: codigos, packs }, producto))
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
        packs,
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
  const deletePack = (ind: number) => {
    const newPacks = packs.filter((_, i) => i !== ind);
    setPacks(newPacks);
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
  const addManualPack = () => {
    if (manualPack && !packs.includes(manualPack)) {
      setPacks((prev) => [...prev, manualPack]);
      setManualPack(''); // Limpiar campo después de agregar
    }
  };
  const addCodigo = (newCodigo: number) => {
    setCodigos((prev: any) => [...prev, newCodigo]);
  };
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
        <Divider borderColor='gray' />
        <Box>
          <Flex justify='space-between' align='center' mb={2}>
            <Text fontWeight='bold'>Packs</Text>
            <IconButton
              size='sm'
              variant='solid'
              icon={isOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggle}
              aria-label='Toggle Packs'
            />
          </Flex>

          <Collapse in={isOpen}>
            <Flex direction='column' gap={2}>
              <Select
                size='sm'
                placeholder='Agregar pack'
                onChange={(e) => {
                  const selected = e.target.value;
                  if (selected && !packs.includes(selected)) {
                    setPacks((prev) => [...prev, selected]);
                  }
                }}
              >
                {allPacks?.map((g) => (
                  <option key={g} value={g}>
                    {g}
                  </option>
                ))}
              </Select>

              <Input
                size='sm'
                placeholder='Pack personalizado'
                value={manualPack}
                onChange={(e) => setManualPack(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && addManualPack()}
              />
              <Button size='sm' onClick={addManualPack}>
                Agregar pack manual
              </Button>
            </Flex>
          </Collapse>
          {packs.length > 0 && (
            <>
              <Divider mt={3} mb={2} />
              <Text fontSize='sm'>Packs seleccionados:</Text>
              <Flex direction='column' gap={1}>
                {packs.map((pack, index) => (
                  <Flex key={index} justify='space-between' align='center'>
                    <Text>{pack}</Text>
                    <IconButton
                      icon={<MinusIcon />}
                      size='xs'
                      onClick={() => deletePack(index)}
                      aria-label='Eliminar pack'
                    />
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </Box>
        {/* Código */}
        <Divider borderColor='gray' />
        <Box>
          <Flex justify='space-between' align='center' mb={2}>
            <Text fontWeight='bold'>Códigos</Text>
            <IconButton
              size='sm'
              variant='solid'
              icon={isOpenCodigos ? <ChevronUpIcon /> : <ChevronDownIcon />}
              onClick={onToggleCodigos}
              aria-label='Toggle Códigos'
            />
          </Flex>

          <Collapse in={isOpenCodigos}>
            <Flex direction='column' gap={2}>
              <Input
                size='sm'
                placeholder='Ingresar código'
                type='number'
                onKeyDown={(e) => {
                  if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key))
                    e.preventDefault();
                  if (e.key === 'Enter') {
                    const val = parseInt(e.currentTarget.value);
                    if (val && !codigos.includes(val)) {
                      addCodigo(val);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                onWheel={(e: any) => e.target.blur()}
              />
            </Flex>
          </Collapse>

          {codigos.length > 0 && (
            <>
              <Divider mt={3} mb={2} />
              <Text fontSize='sm'>Códigos escaneados o ingresados:</Text>
              <Flex direction='column' gap={1}>
                {codigos.map((codigo, index) => (
                  <Flex key={index} justify='space-between' align='center'>
                    <Text>{codigo}</Text>
                    <IconButton
                      icon={<MinusIcon />}
                      size='xs'
                      onClick={() => deleteCodigo(index)}
                      aria-label='Eliminar código'
                    />
                  </Flex>
                ))}
              </Flex>
            </>
          )}
        </Box>
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
