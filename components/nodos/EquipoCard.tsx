import { EquipoType, TipoEquipo } from '@/types/types';
import {
  Badge,
  Box,
  Button,
  Flex,
  Image,
  Input,
  Select,
  Text,
  useToast,
} from '@chakra-ui/react';
import { Node } from 'reactflow';
import { IconMap } from './ReactFlow/SVGs/IconMap';
import { useState } from 'react';
import { TiposDeEquipo } from '@/data/data';

const EquipoCard = ({
  n,
  eliminarEquipo,
  editEquipo,
}: {
  n: Node;
  eliminarEquipo: (n: Node) => void;
  editEquipo: (newEquipo: EquipoType) => void;
}) => {
  const { tipo, nombre } = n?.data ?? {};
  const [editing, setEditing] = useState(false);
  const [localTipo, setLocalTipo] = useState(tipo);
  const [localNombre, setLocalNombre] = useState(nombre);
  const cancelar = () => {
    setLocalTipo(tipo);
    setLocalNombre(nombre);
    setEditing(false);
  };
  const toast = useToast();
  const handleEdit = () => {
    if (!localTipo || !localNombre) {
      toast({
        title: 'Error',
        description: 'Tienes datos incompletos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (tipo === localTipo && nombre === localNombre) {
      toast({
        title: 'Error',
        description: 'Debes modificar algún dato',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    const newEquipo = {
      ...n.data,
      nombre: localNombre,
      tipo: localTipo,
    };
    editEquipo(newEquipo);
    toast({
      title: 'Actualizado',
      description: 'Equipo actualizado. Para confirmar, guardá los cambios.',
      status: 'info',
      isClosable: true,
      duration: 1500,
    });
    setEditing(false);
  };
  if (!tipo || !nombre) return null;
  return (
    <Box
      key={n.id}
      p={4}
      borderRadius='lg'
      boxShadow='md'
      border='1px solid'
      borderColor='gray.200'
      w='220px'
      transition='all 0.2s'
      _hover={{ boxShadow: 'xl', transform: 'translateY(-2px)' }}
    >
      <Flex
        h='100%'
        justify='space-between'
        direction='column'
        align='center'
        gap={2}
      >
        {editing ? (
          <Flex gap={2} align='center' flexDir='column'>
            <Text>Nombre</Text>
            <Input
              size='sm'
              borderRadius='md'
              value={localNombre}
              onChange={(e) => setLocalNombre(e.target.value)}
            />
            <Text>Tipo</Text>
            <Select
              size='sm'
              borderRadius='md'
              value={localTipo}
              onChange={(e) => setLocalTipo(e.target.value as TipoEquipo)}
            >
              {TiposDeEquipo.map((t) => {
                return (
                  <option key={`tipo-equipo-list-key-${t}`} value={t}>
                    {t}
                  </option>
                );
              })}
            </Select>
          </Flex>
        ) : (
          <Flex gap={2} align='center' flexDir='column'>
            <Image
              boxSize='60px'
              objectFit='contain'
              src={IconMap[tipo as TipoEquipo]?.src}
              alt={tipo}
            />
            <Text wordBreak='break-word' fontWeight='bold' textAlign='center'>
              {nombre}
            </Text>
            <Badge colorScheme='purple' variant='subtle'>
              {tipo}
            </Badge>
          </Flex>
        )}
        {editing ? (
          <Flex gap={2} justify='space-around' w='100%'>
            <Button
              w='45%'
              mt={2}
              size='xs'
              colorScheme='blue'
              onClick={handleEdit}
            >
              Confirmar
            </Button>
            <Button
              mt={2}
              size='xs'
              w='45%'
              colorScheme='red'
              variant='outline'
              onClick={cancelar}
            >
              Cancelar
            </Button>
          </Flex>
        ) : (
          <Flex gap={2} justify='center' w='100%'>
            <Button
              mt={2}
              size='xs'
              w='45%'
              colorScheme='blue'
              onClick={() => setEditing(true)}
            >
              Editar
            </Button>
            <Button
              mt={2}
              size='xs'
              w='45%'
              colorScheme='red'
              variant='outline'
              onClick={() => eliminarEquipo(n)}
            >
              Eliminar
            </Button>
          </Flex>
        )}
      </Flex>
    </Box>
  );
};

export default EquipoCard;
