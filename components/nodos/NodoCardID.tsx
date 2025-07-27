'use client';

import { deleteSingleDoc } from '@/firebase/services/deleteSingleDoc';
import { setSingleDoc } from '@/firebase/services/setSingleDoc';
import { hasDuplicateVlanNames } from '@/helpers/hasDuplicateVlanNames';
import { scrollIntoTheView } from '@/helpers/scrollIntoTheView';
import {
  EquipoType,
  HighlightType,
  NodoType,
  OpenModalType,
  VLANType,
} from '@/types/types';
import {
  Box,
  Button,
  Flex,
  Select,
  Text,
  useColorModeValue,
  useToast,
} from '@chakra-ui/react';
import { useRouter } from 'next/router';
import { useCallback, useMemo, useState } from 'react';
import ReactFlow, {
  Background,
  Controls,
  Node,
  useEdgesState,
  useNodesState,
} from 'reactflow'; // Usamos 'reactflow' en vez de 'react-flow-renderer'
import 'reactflow/dist/style.css';
import StatCard from '../dashboard/StatCard';
import AgregarNodoModal from './AgregarNodoModal';
import AgregarVlanModal from './AgregarVlanModal';
import DeleteDataModal from './DeleteDataModal';
import EditTitle from './EditTitle';
import EquipoCard from './EquipoCard';
import CustomNode from './ReactFlow/CustomNode';
import ReactFlowPathPanel from './ReactFlow/ReactFlowPathPanel';
import ReactFlowVlanPanel from './ReactFlow/ReactFlowVlanPanel';
const nodeTypes = {
  equipo: CustomNode,
  equipoSource: CustomNode,
  equipoTarget: CustomNode,
};
type VlanPath = {
  source: string;
  target: string;
};

const NodoCardID = ({ initialNodo }: { initialNodo: NodoType }) => {
  const [firstNodo, setFirstNodo] = useState(initialNodo);
  const [nodo, setNodo] = useState(firstNodo);
  const initialNodes = useMemo(() => {
    return (
      firstNodo.equipos?.map((equipo) => ({
        id: equipo.id,
        type: 'equipo',
        data: equipo,
        position: equipo.coordenadas,
        draggable: true,
        connectable: true,
      })) || []
    );
  }, [firstNodo]);
  const [vlanSelected, setVlanSelected] = useState<string | null>(null);
  const [vlanPath, setVlanPath] = useState<VlanPath | null>(null);
  const [highlight, setHighlight] = useState<HighlightType>(null);
  const [loading, setLoading] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    firstNodo?.edges || []
  );
  const toast = useToast();
  const [openModal, setOpenModal] = useState<OpenModalType | null>(null);
  const getOffsetIndex = (source: string, target: string) =>
    edges.filter((e) => e.source === source && e.target === target).length;
  const colors = {
    portsCompleted: '#43d13eff',
    incompletPorts: '#b98e17ff',
    pathSelected: '#FF0072',
  };
  const onConnect = useCallback(
    (params: any) => {
      if (!vlanSelected) {
        toast({
          title: 'Debe seleccionar una VLAN para trazar una conexión',
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }

      const source = params.source;
      const target = params.target;
      const vlan = vlanSelected;
      const id = `edge-${source}-${target}-vlan-${vlan}`;

      if (edges.find((e) => e.id === id)) {
        toast({
          title: `La VLAN ${vlan} ya pasa por este tramo`,
          status: 'warning',
          duration: 3000,
          isClosable: true,
        });
        return;
      }
      if (highlight !== 'vlan') setHighlight('vlan');
      setVlanPath(null);
      const offsetIndex = getOffsetIndex(source, target);
      const paramType = edges.find(
        (e) => e.source === source && e.target === target
      );
      const newEdge = {
        ...params,
        id, // 👈 aseguramos un ID único
        label: `VLAN ${vlan}`,
        type: paramType?.type || 'default',
        data: {
          vlan,
          offsetIndex,
          sourcePort: null,
          targetPort: null,
        },
      };
      setEdges((eds) => [...eds, newEdge]);
    },
    [setEdges, vlanSelected, toast, edges]
  );
  const router = useRouter();
  const coloredEdges = edges.map((edge) => {
    const { source, target } = edge;
    const vlansPath = edges.filter(
      (e) => e.source === source && e.target === target
    );

    const selectedPath =
      highlight == 'path' &&
      vlanPath?.source === edge.source &&
      vlanPath?.target === edge.target;
    const isSelected =
      (highlight === 'vlan' &&
        vlansPath.some((e) => e.data.vlan === vlanSelected)) ||
      selectedPath;
    const offset = (edge.data?.offsetIndex ?? 0) * 5;

    const selectedLabel =
      vlansPath.length > 1 ? `${vlansPath.length} VLANS` : edge.label;
    const highlightVlan = vlansPath.find((v) => v.data.vlan === vlanSelected);

    const vlanPathColor =
      !highlightVlan?.data.targetPort || !highlightVlan?.data.sourcePort
        ? colors.incompletPorts
        : colors.portsCompleted;

    const selectedColor =
      highlight === 'path' ? colors.pathSelected : vlanPathColor;
    return {
      ...edge,
      label: selectedLabel,
      style: {
        strokeWidth: 2,
        stroke: isSelected ? selectedColor : 'gray',
        // strokeDasharray: isSelected ? '0' : '4 2',
        strokeDashoffset: offset, // desplaza cada uno un poco más
        zIndex: isSelected ? 15 : 1,
      },
    };
  });
  const selectedEdges = useMemo(
    () =>
      edges.filter(
        (e) => e.source === vlanPath?.source && e.target === vlanPath?.target
      ),
    [edges, vlanPath] // Dependencias
  );
  const selectedSourceNode = useMemo(
    () =>
      [...nodo.equipos, { id: nodo.id, nombre: 'Nodo ' + nodo.nombre }]?.find(
        (n) => n.id === vlanPath?.source
      ),
    [edges, vlanPath] // Dependencias
  );
  const selectedTargetNode = useMemo(
    () =>
      [...nodo.equipos, { id: nodo.id, nombre: 'Nodo ' + nodo.nombre }]?.find(
        (n) => n.id === vlanPath?.target
      ),
    [edges, vlanPath] // Dependencias
  );
  const save = async () => {
    if (!nodo?.id || !nodo) {
      return;
    }
    setLoading(true);
    try {
      const newEquipos = nodes.map((n) => {
        return {
          ...n?.data,
          coordenadas: n?.position || { x: 0, y: 0 },
        };
      });
      const newNodo = {
        ...nodo,
        equipos: newEquipos,
        edges,
      };
      await setSingleDoc('nodos', nodo?.id, newNodo);
      setNodo(newNodo);
      setFirstNodo(newNodo);
      toast({
        title: 'Actualizado',
        description: `Nodo ${nodo.nombre} actualizado correctamente`,
        status: 'success',
        isClosable: true,
        duration: 4000,
      });
    } catch (e) {
      console.log(e);
    } finally {
      setLoading(false);
    }
  };
  const removeEdge = (edgeID: string) => {
    const handleRemove = () => {
      setEdges((prev) => prev.filter((e) => e.id !== edgeID));
      toast({
        title: 'Eliminado',
        description: 'Tramo eliminado. Para confirmar, guardá los cambios.',
        status: 'info',
        isClosable: true,
        duration: 1500,
      });
    };
    setOpenModal(() => ({
      description: '¿Estás seguro que quieres eliminar el tramo?',
      func: handleRemove,
      title: 'Eliminar Tramo',
    }));
  };
  const removeVlan = (VLAN: VLANType) => {
    const handleRemove = () => {
      setEdges((prev) => prev.filter((e) => e.data.vlan !== VLAN.nombre));
      setNodo((n) => ({
        ...n,
        vlans: n.vlans.filter((v) => v.id !== VLAN.id),
      }));
      setVlanSelected(null);
      setHighlight(null);
      toast({
        title: 'Eliminada',
        description: 'VLAN eliminada. Para confirmar, guardá los cambios.',
        status: 'info',
        isClosable: true,
        duration: 1500,
      });
    };
    setOpenModal(() => ({
      description: `¿Estás seguro que quieres eliminar la VLAN ${VLAN.nombre}?`,
      func: handleRemove,
      title: 'Eliminar VLAN',
    }));
  };
  const lowGray = useColorModeValue('gray.600', 'gray.200');
  const deleteNodo = async () => {
    const handleRemove = async () => {
      if (!nodo?.id) return;
      setLoadingDelete(true);
      try {
        await deleteSingleDoc('nodos', nodo?.id);
        toast({
          title: 'Eliminado',
          description: `Nodo ${nodo.nombre} eliminado correctamente. Redireccionando...`,
          status: 'info',
          isClosable: true,
          duration: 1500,
        });
        router.push('/Nodos');
      } catch (e) {
        console.log(e);
      } finally {
        setLoadingDelete(false);
      }
    };
    setOpenModal(() => ({
      description: `¿Estás seguro que quieres eliminar el nodo ${nodo?.nombre}? Esta acción no se puede deshacer`,
      func: handleRemove,
      title: 'Eliminar Nodo',
    }));
  };
  const infoTitles = {
    portsCompleted: 'Puertos completos',
    incompletPorts: 'Puertos incompletos',
    pathSelected: 'Tramo seleccionado',
  };
  const agregarEquipo = (nuevoEquipo: EquipoType) => {
    const newNode = {
      id: nuevoEquipo.id,
      type: 'equipo', // <- esto es clave
      data: nuevoEquipo, // Pasás el equipo completo para que CustomNode lo reciba como espera
      position: nuevoEquipo.coordenadas,
      draggable: true,
      connectable: true,
    };
    setNodo((n) => ({ ...n, equipos: [...n.equipos, nuevoEquipo] }));
    setNodes((nds) => [...nds, newNode]);
    toast({
      title: 'Agregado',
      description: `Equipo ${nuevoEquipo.nombre} agregado. Para confirmar, guardá los cambios.`,
      status: 'success',
      isClosable: true,
      duration: 3000,
    });
  };

  const agregarVlan = (nuevaVlan: VLANType) => {
    const duplicate = hasDuplicateVlanNames([...nodo.vlans, nuevaVlan]);
    if (duplicate) {
      toast({
        title: 'TIenes VLANS repetidas',
        status: 'warning',
        isClosable: true,
      });
      return false;
    }
    setNodo((n) => ({ ...n, vlans: [...n.vlans, nuevaVlan] }));
    toast({
      title: 'Agregada',
      description: `VLAN ${nuevaVlan.nombre} agregada. Para confirmar, guardá los cambios.`,
      status: 'success',
      isClosable: true,
      duration: 3000,
    });
    return true;
  };
  const removeEquipo = (equipo: Node) => {
    const equipoID = equipo?.id;
    const handleRemove = () => {
      const newEquipos = nodo.equipos.filter((e) => e.id !== equipoID);
      setNodo((n) => ({ ...n, equipos: newEquipos }));
      setNodes((nds) => nds.filter((n) => n.id !== equipoID));
      const newEdges = edges.filter(
        (e) => e.source !== equipoID && e.target !== equipoID
      );
      setEdges(newEdges);
      toast({
        title: 'Eliminado',
        description: 'Equipo eliminado. Para confirmar, guardá los cambios.',
        status: 'info',
        isClosable: true,
        duration: 3000,
      });
    };
    setOpenModal(() => ({
      description: `¿Estás seguro que quieres eliminar el equipo ${equipo?.data?.nombre}?`,
      func: handleRemove,
      title: 'Eliminar Equipo',
    }));
  };
  const changeTitle = (newTitle: string) => {
    setNodo((n) => ({ ...n, nombre: newTitle }));
  };
  const editVlan = (newVlan: VLANType) => {
    setNodo((n) => ({
      ...n,
      vlans: n.vlans.map((v) => (v.id === newVlan.id ? newVlan : v)),
    }));
  };
  const tramosTotales = useMemo(() => {
    return edges.filter((edge) => edge.data.vlan === vlanSelected);
  }, [vlanSelected, edges]);
  const editEquipo = (newEquipo: EquipoType) => {
    const newNode = {
      id: newEquipo.id,
      type: 'equipo',
      data: newEquipo,
      position: newEquipo.coordenadas,
      draggable: true,
      connectable: true,
    };
    const newNodes = nodes.map((n) =>
      n.data.id === newEquipo.id ? newNode : n
    );
    setNodes(newNodes);
  };
  const mappedNodes = useMemo(() => {
    return nodes.map((n) => {
      let selectedType = n.type;
      if (vlanPath?.source === n.id) {
        selectedType = 'equipoSource';
      }
      if (vlanPath?.target === n.id) {
        selectedType = 'equipoTarget';
      }
      return { ...n, type: selectedType, data: { ...n.data, selectedType } };
    });
  }, [nodes, vlanPath]);
  return (
    <Box p={4}>
      <Flex direction='column' gap={[2, 3, 4, 5, 6]}>
        {/* Header - Info + Select + Botones */}
        <EditTitle
          key={nodo.nombre}
          confirm={changeTitle}
          title={nodo.nombre}
          fontSize='2xl'
        />
        <DeleteDataModal data={openModal} onClose={() => setOpenModal(null)} />
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify='space-between'
          align={{ base: 'flex-start', md: 'flex-end' }}
          gap={2}
        >
          <Flex flexDir='column'>
            <Flex gap={3} align='center'>
              <Text fontSize='sm' color={lowGray}>
                {nodo.equipos?.length ?? 0}{' '}
                {nodo.equipos.length === 1
                  ? 'equipo conectado'
                  : 'equipos conectados'}
              </Text>
              <Text>-</Text>
              <Button
                onClick={() => scrollIntoTheView('nodos-list-section')}
                colorScheme='blue'
                size='xs'
                variant='link'
              >
                Ver Equipos
              </Button>
            </Flex>
          </Flex>

          <Flex wrap='wrap' align='flex-end' gap={3}>
            <Flex align='flex-end' gap={2}>
              <AgregarVlanModal AgregarVlan={agregarVlan} />
              <Select
                placeholder='Elegir VLAN'
                onChange={(e) => {
                  const nombre = e.target.value;
                  const newVlanSelected =
                    nombre === vlanSelected ? null : nombre;
                  setHighlight(() => (newVlanSelected ? 'vlan' : null));
                  setVlanSelected(newVlanSelected);
                  setVlanPath(null);
                }}
                size='sm'
                maxW='150px'
                borderRadius='md'
                borderColor='gray.300'
                cursor='pointer'
                value={vlanSelected || ''}
              >
                {nodo?.vlans?.map((vlan) => (
                  <option key={vlan.id} value={vlan.nombre}>
                    VLAN {vlan.nombre}
                  </option>
                ))}
              </Select>
            </Flex>
            <Flex align='flex-end' flexDir='row' gap={2}>
              <Button
                isLoading={loading}
                isDisabled={loading}
                colorScheme='green'
                size='sm'
                onClick={save}
              >
                Guardar
              </Button>
              <Button
                onClick={() => {
                  setNodo(firstNodo);
                  setNodes(initialNodes);
                  setEdges(nodo?.edges || []);
                }}
                isDisabled={loading}
                size='sm'
                colorScheme='red'
                variant='outline'
              >
                Reset
              </Button>
            </Flex>
          </Flex>
        </Flex>

        {/* ReactFlow Box */}
        <Flex flexDir='column'>
          <Flex mb={2} flexDir={{ base: 'column', sm: 'row' }} gap={2}>
            {Object.keys(colors).map((c) => (
              <StatCard
                key={c + '-stat-colors-key'}
                label={infoTitles[c as keyof typeof infoTitles]}
                value={''}
                color={colors[c as keyof typeof colors]}
                helper={''}
                p={1}
              />
            ))}
          </Flex>

          <Box
            boxShadow='md'
            border='1px solid'
            borderColor='gray.200'
            borderRadius='lg'
            overflow='hidden'
            h='650px'
            maxH='70vh'
          >
            <ReactFlow
              nodeTypes={nodeTypes}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onEdgeClick={(e, edge) => {
                setVlanPath({
                  source: edge.source,
                  target: edge.target,
                });
                setHighlight('path');
              }}
              fitView
              nodes={mappedNodes}
              edges={coloredEdges}
            >
              <Background />
              <Controls />
              <ReactFlowPathPanel
                key={`panel-vlan-key-${vlanPath?.source}-${vlanPath?.target}`}
                highlight={highlight}
                removeEdge={removeEdge}
                removeTramo={() => {
                  setVlanPath(null);
                  if (highlight === 'path') {
                    {
                    }
                    setHighlight(vlanSelected ? 'vlan' : null);
                  }
                }}
                selectedEdges={selectedEdges}
                vlanPath={vlanPath}
                vlanSelected={vlanSelected}
                selectedNode={{
                  selectedSourceNode,
                  selectedTargetNode,
                }}
                setEdges={setEdges}
              />
              <ReactFlowVlanPanel
                key={vlanSelected + '-vlan-panel-key'}
                removeVlan={() => {
                  setVlanSelected(null);
                  setHighlight(null);
                }}
                highlight={highlight}
                vlan={nodo.vlans.find((v) => v.nombre === vlanSelected) || null}
                deleteVlan={removeVlan}
                editVlan={editVlan}
                tramosTotales={tramosTotales.length}
              />
            </ReactFlow>
          </Box>
        </Flex>

        {/* Cards de Equipos */}
        <Flex
          id='nodos-list-section'
          mb={10}
          gap={4}
          flexDir='column'
          boxShadow='lg'
          p={3}
          mt={6}
        >
          <Text fontSize='lg' fontWeight='bold' mb={3}>
            Equipos del nodo
          </Text>
          <Flex mb={4} wrap='wrap' gap={4}>
            {nodes.map((n) => {
              return (
                <EquipoCard
                  editEquipo={editEquipo}
                  n={n}
                  eliminarEquipo={removeEquipo}
                />
              );
            })}
          </Flex>
          <AgregarNodoModal AgregarNodo={agregarEquipo} />
        </Flex>
        <Button
          isLoading={loadingDelete}
          isDisabled={loadingDelete}
          colorScheme='red'
          alignSelf='center'
          onClick={deleteNodo}
        >
          Eliminar Nodo
        </Button>
      </Flex>
    </Box>
  );
};

export default NodoCardID;
