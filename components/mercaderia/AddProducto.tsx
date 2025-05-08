import { useUser } from '@/context/userContext';
import { addSingleDoc } from '@/firebase/services/addSingleDoc';
import { getMultipleDocs } from '@/firebase/services/getMultipleDocs';
import updateProductosLastStamp from '@/helpers/updateProductosLastStamp';
import useGetProductos from '@/hooks/data/useGetProductos';
import useScanDetection from '@/hooks/useScanDetection';
import { ProductoType } from '@/types/types';
import { MinusIcon } from '@chakra-ui/icons';
import {
  Button,
  Flex,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { useState } from 'react';
import PopoverInfoIcon from '../inicio/PopoverInfoIcon';
import AddCodigoForm from './AddCodigoForm';

const AddProducto = () => {
  const initialForm = {
    nombre: '',
    cantidad: '',
    medida: 'Un.',
    empresa: 'dodoLink',
    cantidadPorPack: 0,
    target: 0,
  };
  const [form, setForm] = useState<any>(initialForm);
  const [adding, setAdding] = useState(false);

  const { user } = useUser();
  const [codigos, setCodigos] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { productos, setProductos } = useGetProductos();
  const onSubmit = async (e: any) => {
    e.preventDefault();
    const { nombre, target, cantidad, medida, empresa, cantidadPorPack } = form;
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
      const newProducto = {
        nombre,
        codigo: codigos,
        cantidad: Number(cantidad) || 1,
        medida,
        empresa,
        creadorID: user?.id || 'noID',
        createdAt: new Date(),
        cantidadPorPack: Number(cantidadPorPack) || 1,
        target: Number(target) || 1,
      };
      const producto = await addSingleDoc('productos', newProducto);
      await updateProductosLastStamp();
      toast({
        status: 'success',
        title: 'Éxito',
        isClosable: true,
        duration: 5000,
        description: `Producto cargado exitosamente`,
      });
      const newProductos = [
        ...(productos || []),
        { ...newProducto, id: producto.id },
      ];
      setProductos(newProductos);
      setForm(initialForm);
      setCodigos([]);
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
  return (
    <Flex flexDir='column' gap={2}>
      <Heading size='md'>Agregar Producto</Heading>
      <Flex gap={2} p={2} w='100%' maxW='400px' flexDir='column'>
        <Text>*Nombre:</Text>
        <Input
          onChange={onChange}
          value={form.nombre}
          name='nombre'
          autoComplete='off'
          formNoValidate
          type='text'
          required
          borderColor='gray'
          size='sm'
          borderRadius='5px'
        />

        <Text>*Cantidad:</Text>
        <Input
          onChange={onChange}
          name='cantidad'
          value={form.cantidad}
          type='number'
          autoComplete='off'
          formNoValidate
          required
          borderColor='gray'
          size='sm'
          borderRadius='5px'
        />
        <Text>*Medida:</Text>
        <Select
          onChange={onChange}
          name='medida'
          required
          borderColor='gray'
          size='sm'
          borderRadius='5px'
          value={form.medida}
        >
          <option value='Un.'>Un.</option>
          <option value='Kg.'>Kg.</option>
          <option value='Mt.'>Mt.</option>
        </Select>
        <Flex gap={2} align='center'>
          <Text>Cantidad por Pack</Text>
          <PopoverInfoIcon>
            <Text>Implementado para contabilizar packs.</Text>
            <Text>Ejemplo rollo de fibra, 4000 por pack.</Text>
          </PopoverInfoIcon>
        </Flex>
        <Input
          onChange={onChange}
          name='cantidadPorPack'
          value={form.cantidadPorPack || ''}
          type='number'
          autoComplete='off'
          formNoValidate
          borderColor='gray'
          size='sm'
          borderRadius='5px'
        />
        <Flex gap={2} align='center'>
          <Text>Target de stock</Text>
          <PopoverInfoIcon>
            <Text>Notifica cuando el stock alcanza ese valor.</Text>
          </PopoverInfoIcon>
        </Flex>
        <Input
          onChange={onChange}
          name='target'
          value={form.target || ''}
          type='number'
          autoComplete='off'
          formNoValidate
          borderColor='gray'
          size='sm'
          borderRadius='5px'
        />
        <Text>*Empresa:</Text>
        <Select
          onChange={onChange}
          name='empresa'
          required
          borderColor='gray'
          size='sm'
          borderRadius='5px'
          value={form.empresa}
        >
          <option value='dodoLink'>dodoLink</option>
          <option value='Grupo IN'>Grupo IN</option>
        </Select>

        <Flex flexDir='column'>
          <Text>Códigos:</Text>
          {codigos.length === 0 && !adding && (
            <Text fontStyle='italic'>No tienes codigos</Text>
          )}
          <Flex flexDir='column' gap={1}>
            {codigos?.map((c, ind) => (
              <Flex
                key={`codigo-${ind}-key-${c}`}
                justify='space-between'
                gap={1}
              >
                <Text>{c}</Text>
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
            ))}
          </Flex>
          <AddCodigoForm
            adding={adding}
            setAdding={setAdding}
            addCodigo={addCodigo}
          />
        </Flex>
        <Button
          bg='gray.600'
          color='white'
          w='fit-content'
          size='sm'
          alignSelf='center'
          onClick={onSubmit}
          _hover={{ opacity: 0.65 }}
          isLoading={loading}
        >
          Aceptar
        </Button>
      </Flex>
    </Flex>
  );
};

export default AddProducto;
