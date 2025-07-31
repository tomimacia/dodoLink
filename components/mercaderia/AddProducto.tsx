import { useUser } from '@/context/userContext';
import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { generateFirestoreId } from '@/helpers/generateFirestoreID';
import useGetProductos from '@/hooks/data/useGetProductos';
import useScanDetection from '@/hooks/useScanDetection';
import { ProductoType } from '@/types/types';
import { ChevronDownIcon, ChevronUpIcon, MinusIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Card,
  CardBody,
  Collapse,
  Divider,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  useDisclosure,
  useToast,
} from '@chakra-ui/react';
import { Timestamp } from 'firebase/firestore';
import { useState } from 'react';
import PopoverInfoIcon from '../inicio/PopoverInfoIcon';
import { updateProductosLastStamp } from '@/helpers/updateStamps';

const AddProducto = () => {
  const initialForm = {
    nombre: '',
    cantidad: '',
    medida: 'Un.',
    empresa: 'dodoLink',
    cantidadPorPack: 0,
    target: 0,
    categoria: 'insumos',
  };
  const [form, setForm] = useState<any>(initialForm);
  const { isOpen, onToggle } = useDisclosure();
  const { isOpen: isOpenCodigos, onToggle: onToggleCodigos } = useDisclosure();
  const { user } = useUser();
  const [codigos, setCodigos] = useState<number[]>([]);
  const [packs, setPacks] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [manualpack, setManualPack] = useState('');
  const toast = useToast();
  const { productos, allPacks, checkUpdates, setProductos } = useGetProductos();
  const onSubmit = async () => {
    const {
      nombre,
      target,
      cantidad,
      medida,
      empresa,
      cantidadPorPack,
      categoria,
    } = form;
    const test = !nombre || !medida || !cantidad || !empresa;
    if (test)
      return toast({
        status: 'error',
        title: 'Error',
        isClosable: true,
        duration: 5000,
        description: 'Completa todos los campos obligatorios',
      });
    setLoading(true);
    try {
      if (codigos.length > 0) {
        const checkProducto = (await getMultipleDocs(
          'productos',
          'codigo',
          'array-contains-any',
          codigos
        )) as ProductoType[];
        if (checkProducto.length > 0) {
          const codigosArr = checkProducto.map((p) => p.codigo).flat();
          const filterCodigo = codigos.filter((c) =>
            codigosArr.some((cod) => cod === c)
          );
          return toast({
            title: 'Ya registrado',
            description: `Código/s: ${filterCodigo.join('-')} ya registrado/s`,
            status: 'info',
            duration: 5000,
            isClosable: true,
          });
        }
      }
      const checName = (await getMultipleDocs(
        'productos',
        'nombre',
        '==',
        nombre
      )) as ProductoType[];
      if (checName.length > 0) {
        return toast({
          title: 'Ya registrado',
          description: `Producto con el nombre "${nombre}" ya registrado`,
          status: 'info',
          duration: 5000,
          isClosable: true,
        });
      }
      await checkUpdates();
      const newID = generateFirestoreId();
      const { seconds, nanoseconds } = Timestamp.now();
      const createdAt = {
        seconds,
        nanoseconds,
      };
      const newProducto = {
        nombre: nombre.toUpperCase(),
        codigo: codigos,
        cantidad: Number(cantidad) || 0,
        medida,
        empresa,
        creadorID: user?.id || 'noID',
        createdAt,
        cantidadPorPack: Number(cantidadPorPack) || 1,
        target: Number(target) || 1,
        queryArr: nombre.toLowerCase().split(' '),
        id: newID,
        categoria,
        packs,
      };
      await setSingleDoc('productos', newID, newProducto);
      await updateProductosLastStamp();
      toast({
        status: 'success',
        title: 'Éxito',
        isClosable: true,
        duration: 5000,
        description: `Producto cargado exitosamente`,
      });
      const newProductos = [...(productos || []), newProducto];
      setProductos(newProductos);
      setForm(initialForm);
      setCodigos([]);
      setPacks([]);
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const onChange = (e: any) => {
    const { name, value } = e.target;
    setForm((prev: any) => ({ ...prev, [name]: value }));
  };
  useScanDetection({
    onComplete: (code) => {
      const newForm = { ...form, codigo: code };
      setForm(newForm);
    },
    minLength: 8,
  });
  const deleteCodigo = (ind: number) => {
    const newCodigos = codigos.filter((_, i) => i !== ind);
    setCodigos(newCodigos);
  };
  const addCodigo = (newCodigo: number) => {
    setCodigos((prev: any) => [...prev, newCodigo]);
  };
  const deletePack = (pack: string) => {
    const newPacks = packs.filter((g) => g !== pack);
    setPacks(newPacks);
  };
  const addManualpack = () => {
    if (manualpack && !packs.includes(manualpack)) {
      setPacks((prev) => [...prev, manualpack]);
      setManualPack(''); // Limpiar campo después de agregar
    }
  };
  return (
    <Box maxW='450px' mx='auto' w='100%'>
      <Heading size='md' mb={4}>
        Agregar Producto
      </Heading>

      <Card w='100%' variant='outline'>
        <CardBody display='flex' flexDirection='column' gap={4}>
          <FormControl isRequired>
            <FormLabel>Nombre</FormLabel>
            <Input
              size='sm'
              name='nombre'
              value={form.nombre}
              onChange={onChange}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Cantidad</FormLabel>
            <Input
              size='sm'
              name='cantidad'
              value={form.cantidad}
              onChange={onChange}
              type='number'
              onKeyDown={(e) => {
                if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key))
                  e.preventDefault();
              }}
              onWheel={(e: any) => e.target.blur()}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Medida</FormLabel>
            <Select
              size='sm'
              name='medida'
              value={form.medida}
              onChange={onChange}
            >
              <option value='Un.'>Un.</option>
              <option value='Kg.'>Kg.</option>
              <option value='Mt.'>Mt.</option>
            </Select>
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Categoría</FormLabel>
            <Select
              size='sm'
              name='categoria'
              value={form.categoria}
              onChange={onChange}
            >
              <option value='insumos'>Insumos</option>
              <option value='herramientas'>Herramientas</option>
            </Select>
          </FormControl>

          <FormControl>
            <FormLabel display='inline-flex' gap={2} alignItems='center'>
              Cantidad por Bulto{' '}
              <PopoverInfoIcon>
                <Text>Implementado para contabilizar por bulto.</Text>
                <Text>Ejemplo: rollo de fibra, 4000 (mts) por bulto.</Text>
              </PopoverInfoIcon>
            </FormLabel>

            <Input
              size='sm'
              name='cantidadPorPack'
              value={form.cantidadPorPack || ''}
              onChange={onChange}
              type='number'
              onKeyDown={(e) => {
                if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key))
                  e.preventDefault();
              }}
              onWheel={(e: any) => e.target.blur()}
            />
          </FormControl>

          <FormControl>
            <FormLabel display='inline-flex' gap={2} alignItems='center'>
              Target de Stock
              <PopoverInfoIcon>
                <Text>Notifica cuando el stock alcanza ese valor.</Text>
              </PopoverInfoIcon>
            </FormLabel>
            <Input
              size='sm'
              name='target'
              value={form.target || ''}
              onChange={onChange}
              type='number'
              onKeyDown={(e) => {
                if (['ArrowUp', 'ArrowDown', 'e', '+', '-'].includes(e.key))
                  e.preventDefault();
              }}
              onWheel={(e: any) => e.target.blur()}
            />
          </FormControl>

          <FormControl isRequired>
            <FormLabel>Empresa</FormLabel>
            <Select
              size='sm'
              name='empresa'
              value={form.empresa}
              onChange={onChange}
            >
              <option value='dodoLink'>dodoLink</option>
              <option value='Grupo IN'>Grupo IN</option>
            </Select>
          </FormControl>

          {/* Agregar packs - con Collapse */}
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
                  value={manualpack}
                  onChange={(e) => setManualPack(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addManualpack()}
                />
                <Button size='sm' onClick={addManualpack}>
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
                        onClick={() => deletePack(pack)}
                        aria-label='Eliminar pack'
                      />
                    </Flex>
                  ))}
                </Flex>
              </>
            )}
          </Box>
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
          {/* Botón de enviar */}
          <Button
            onClick={onSubmit}
            mt={4}
            colorScheme='blue'
            isLoading={loading}
          >
            Cargar Producto
          </Button>
        </CardBody>
      </Card>
    </Box>
  );
};

export default AddProducto;
