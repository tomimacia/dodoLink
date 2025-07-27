'use client';

import { TiposDeEquipo } from '@/data/data';
import { addSingleDoc } from '@/firebase/services/addSingleDoc';
import { hasDuplicateVlanNames } from '@/helpers/hasDuplicateVlanNames';
import { EquipoType, NodoType, VLANType } from '@/types/types';
import { DeleteIcon } from '@chakra-ui/icons';
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  IconButton,
  Input,
  Select,
  Text,
  Textarea,
  useColorModeValue,
  useToast,
  VStack,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useRef, useState } from 'react';

const CargarNodo = () => {
  const [nombre, setNombre] = useState('');
  const [description, setDescription] = useState([]);
  const [equipos, setEquipos] = useState<EquipoType[]>([]);
  const [vlans, setVlans] = useState<VLANType[]>([]);
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const fontColor = useColorModeValue('blue.700', 'blue.400');
  const confirmButtonRef = useRef<HTMLButtonElement | null>(null);

  const addEquipo = () => {
    const nuevo: EquipoType = {
      id: crypto.randomUUID(),
      nombre: '',
      tipo: 'Otro',
      coordenadas: { x: 0, y: 0 },
    };
    setEquipos((prev) => [...prev, nuevo]);
  };

  const updateEquipo = (id: string, field: keyof EquipoType, value: any) => {
    setEquipos((prev) =>
      prev.map((e) => (e.id === id ? { ...e, [field]: value } : e))
    );
  };

  const removeEquipo = (id: string) => {
    setEquipos((prev) => prev.filter((e) => e.id !== id));
  };
  const removeVlan = (id: string) => {
    setVlans((prev) => prev.filter((e) => e.id !== id));
  };
  const router = useRouter();
  const addVLAN = () => {
    const nueva: VLANType = {
      id: crypto.randomUUID(),
      nombre: '',
      description: [],
    };
    setVlans((prev) => [...prev, nueva]);
  };

  const updateVLAN = (id: string, field: keyof VLANType, value: any) => {
    setVlans((prev) =>
      prev.map((v) => (v.id === id ? { ...v, [field]: value } : v))
    );
  };

  const onConfirmar = async () => {
    if (!nombre.trim()) {
      toast({
        title: 'El nombre es obligatorio',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    const duplicate = hasDuplicateVlanNames(vlans);
    if (duplicate) {
      toast({
        title: 'TIenes VLANS repetidas',
        status: 'warning',
        isClosable: true,
      });
      return;
    }
    setLoading(true);
    try {
      const nodo: NodoType = {
        nombre,
        description,
        equipos: equipos,
        vlans,
      };

      const newNode = await addSingleDoc('nodos', nodo);
      toast({
        title: 'Nodo cargado',
        description: `Nodo ${nombre} cargdo con éxito`,
        status: 'success',
        isClosable: true,
        duration: 4000,
      });
      router.push(`/NodosID/${newNode.id}`);
    } catch (e) {
      console.log(e);
      toast({
        title: 'Error',
        description: 'Ocurrió un error en al carga del nodo',
        status: 'error',
        isClosable: true,
        duration: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Flex p={4} minH='80vh' maxW='800px' flexDir='column' gap={6}>
      <Heading fontSize={24}>Cargar Nodo</Heading>

      <FormControl isRequired>
        <FormLabel>Nombre del Nodo</FormLabel>
        <Input
          placeholder='Agregar nombre'
          size='sm'
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
        />
      </FormControl>

      <FormControl>
        <FormLabel>Detalle</FormLabel>
        <Textarea
          placeholder='Agregar detalle'
          size='sm'
          value={description.join('\n')}
          onChange={(e) => setDescription(e.target.value.split('\n') as any)}
        />
      </FormControl>

      <Box>
        <Flex justify='space-between' align='center'>
          <FormLabel mb={0}>Equipos</FormLabel>
          <Button size='xs' onClick={addEquipo}>
            Agregar equipo
          </Button>
        </Flex>
        <VStack spacing={3} mt={2}>
          {equipos.length === 0 && (
            <Flex justify='flex-start' w='100%'>
              <Text fontSize='sm' fontStyle='italic'>
                No tienes equipos aún
              </Text>
            </Flex>
          )}
          {equipos.map((e) => (
            <Flex key={e.id} gap={2} w='100%'>
              <Input
                placeholder='Nombre'
                size='sm'
                value={e.nombre}
                onChange={(ev) => updateEquipo(e.id, 'nombre', ev.target.value)}
              />
              <Select
                size='sm'
                placeholder='Tipo'
                value={e.tipo}
                onChange={(ev) => updateEquipo(e.id, 'tipo', ev.target.value)}
              >
                {TiposDeEquipo.map((t) => {
                  return (
                    <option key={`tipo-equipo-list-key-${t}`} value={t}>
                      {t}
                    </option>
                  );
                })}
              </Select>
              <IconButton
                size='sm'
                icon={<DeleteIcon />}
                aria-label='Eliminar equipo'
                onClick={() => removeEquipo(e.id)}
              />
            </Flex>
          ))}
        </VStack>
      </Box>

      <Box>
        <Flex justify='space-between' align='center'>
          <FormLabel mb={0}>VLANS</FormLabel>
          <Button size='xs' onClick={addVLAN}>
            Agregar VLAN
          </Button>
        </Flex>
        <VStack spacing={3} mt={2}>
          {vlans.length === 0 && (
            <Flex justify='flex-start' w='100%'>
              <Text fontSize='sm' fontStyle='italic'>
                No tienes VLANS aún
              </Text>
            </Flex>
          )}
          {vlans.map((v) => (
            <Box
              key={v.id}
              w='100%'
              border='1px solid #ccc'
              borderRadius={4}
              p={3}
            >
              <Input
                placeholder='Nombre VLAN'
                size='sm'
                mb={2}
                value={v.nombre}
                onChange={(ev) => updateVLAN(v.id, 'nombre', ev.target.value)}
              />
              <Textarea
                placeholder='Descripción'
                size='sm'
                mb={2}
                value={v.description?.join('\n')}
                onChange={(ev) =>
                  updateVLAN(v.id, 'description', ev.target.value.split('\n'))
                }
              />
              <Flex justify='flex-end'>
                <Button
                  onClick={() => removeVlan(v.id)}
                  size='xs'
                  colorScheme='red'
                  variant='outline'
                >
                  Eliminar
                </Button>
              </Flex>
            </Box>
          ))}
        </VStack>
      </Box>

      <Button
        w='fit-content'
        mx='auto'
        ref={confirmButtonRef}
        fontWeight='bold'
        size='sm'
        bg={fontColor}
        color='white'
        _hover={{ opacity: 0.7 }}
        isLoading={loading}
        onClick={onConfirmar}
      >
        Confirmar
      </Button>
    </Flex>
  );
};

export default CargarNodo;
