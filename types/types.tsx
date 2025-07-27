import { ReactNode } from 'react';
import { Edge } from 'reactflow';

export type MainLayoutType = {
  children: ReactNode;
};
export type TextAndInputType = {
  name: string;
  title: string;
  placeholder: string;
  type: string;
  yaRegistrado?: boolean;
};
export type RolType =
  | 'Superadmin'
  | 'Admin'
  | 'Supervisor'
  | 'Cuadrilla'
  | 'NOC Support';

export type UserType = {
  id: string;
  nombre: string;
  email: string;
  apellido: string;
  usuario: string;
  inventario: ProductoType[];
  rol: RolType;
  cuadrilla: number | null;
};
export type OpenModalType = {
  title: string;
  description: string;
  func: (data?: any) => void;
};
export interface CreatedAt {
  seconds: number;
  nanoseconds: number;
}
export const Estados: EstadoType[] = [
  'Inicializado',
  'Preparación',
  'Pendiente',
  'En curso',
  'Finalizado',
];
export const EstadosCompra: EstadoType[] = [
  'Inicializado',
  'En curso',
  'Finalizado',
];
export const EstadoColors: Record<EstadoType, string> = {
  Inicializado: '#A0AEC0', // gris medio (gray.400)
  Preparación: '#63B3ED', // azul claro (blue.300)
  Pendiente: '#ED8936', // naranja (orange.400)
  'En curso': '#3182CE', // azul fuerte (blue.600)
  Finalizado: '#38A169', // verde (green.500)
};
export type EstadoType =
  | 'Inicializado'
  | 'Preparación'
  | 'Pendiente'
  | 'En curso'
  | 'Finalizado';
// Representa un cambio completo con datos del usuario, ítems y fecha
export type MovCambioObject = {
  user: UserType;
  items: ProductoType[];
  date: {
    seconds: number;
    nanoseconds: number;
  };
};

// Puede ser una lista de cambios completos o simplemente una lista de strings
export type CambiosType = MovCambioObject[] | string[];

// Estado parcial (usado en varios estados del pedido)
export type PedidoFechaParcial = {
  fecha: {
    seconds: number;
    nanoseconds: number;
  } | null;
  admin: string | null;
  cambios?: CambiosType | null;
};

// Estado completo (Inicializado) tiene campos obligatorios
export type PedidoFechaInicializado = {
  fecha: {
    seconds: number;
    nanoseconds: number;
  };
  admin: string;
  cambios?: CambiosType | null;
};

// Agrupa todos los estados del pedido
export type PedidoFechaType = {
  Inicializado: PedidoFechaInicializado;
  Preparación: PedidoFechaParcial;
  Pendiente: PedidoFechaParcial;
  'En curso': PedidoFechaParcial;
  Finalizado: PedidoFechaParcial;
};

// Tipo completo del pedido
export type PedidoType = {
  cliente: string;
  detalle: string[];
  movimientos: PedidoFechaType;
  id: string;
  isPago: boolean;
  creadorID: string;
  mapCoords: string;
  vistoPor: string[];
  nota?: string[];
  items: ProductoType[];
  tramo: number | null;
  cuadrilla: number | null;
  confirmedItems?: ProductoType[];
  isRetiro: boolean;
  isNota?: boolean;
};
export type MedidaType = 'Un.' | 'Kg.' | 'Mt.';
export type ProductoType = {
  nombre: string;
  cantidad: number;
  id: string;
  medida: MedidaType;
  codigo: number[];
  unidades?: number;
  creadorID?: string;
  createdAt?: any;
  empresa: string;
  cantidadPorPack: number;
  target: number;
  queryArr: string[];
  isChecked?: boolean;
  categoria: string;
  packs: string[];
};
export type NotaType = {
  id: string;
  cliente: string;
  nota: string[];
  createdAt: Date;
  creadorID: string;
  isNota: true;
  vistoPor: string[];
};
export type SubNavItemType = {
  label: string;
  route: string;
  roles: readonly RolType[];
  icon?: React.ComponentType; // Opcional: si hay un icono para la subruta
};
export type MovimientosType = {
  reservas: PedidoType[];
  compras: PedidoType[];
  notas: NotaType[];
  fecha: string;
  id: string;
};
export type VLANType = {
  id: string;
  nombre: string;
  description?: string[];
};
export type HighlightType = null | 'path' | 'vlan';
export type TipoEquipo =
  | 'Switch'
  | 'Router'
  | 'Core'
  | 'Túnel'
  | 'VXLAN'
  | 'Otro';
export type CoordenadasType = { x: number; y: number };
export type EquipoType = {
  id: string;
  nombre: string;
  tipo: TipoEquipo;
  coordenadas: CoordenadasType;
  selectedType?: string;
};

export type NodoType = {
  id?: string;
  nombre: string;
  description?: string[];
  equipos: EquipoType[];
  vlans: VLANType[];
  edges?: Edge[];
};
export type EdgeLineType = 'straight' | 'step' | 'smoothstep' | 'default';
export type ServicioFirebaseType = {
  id: string;
  description: string[] | null;
  graphId: string | null;
};
