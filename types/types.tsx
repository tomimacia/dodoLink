import { Timestamp } from 'firebase/firestore';
import { ReactNode } from 'react';

export type MainLayoutType = {
  children: ReactNode;
};

export type NavLinkType = {
  title: string;
  href: string;
  onClick?: () => void;
};
export type TextAndInputType = {
  name: string;
  title: string;
  placeholder: string;
  type: string;
  yaRegistrado?: boolean;
};
export type RolType = 'Superadmin' | 'Admin' | 'Supervisor' | 'Cuadrilla';
export type UserType = {
  id: string;
  nombre: string;
  email: string;
  apellido: string;
  usuario: string;
  inventario: ProductoType[];
  rol: RolType;
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
export type PedidoFechaParcial = {
  fecha: {
    seconds: number;
    nanoseconds: number;
  } | null;
  admin: string | null;
  cambios?: string;
};
export type PedidoFechaType = {
  Inicializado: {
    fecha: {
      seconds: number;
      nanoseconds: number;
    };
    admin: string;
    cambios?: string;
  };
  Preparación: PedidoFechaParcial;
  Pendiente: PedidoFechaParcial;
  'En curso': PedidoFechaParcial;
  Finalizado: PedidoFechaParcial;
};
export type PedidoType = {
  cliente: string;
  detalle: string;
  movimientos: PedidoFechaType;
  id: string;
  isPago: boolean;
  creadorID: string;
  mapCoords: string;
  vistoPor: string[];
  items: ProductoType[];
  tramo: number | null;
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
};
export type DestinatarioType = 'Cliente' | 'Consumidor Final';
export type TipoDePagoType = 'Efectivo' | 'Mercadopago';
export type SubNavItemType = {
  label: string;
  route: string;
  roles: readonly RolType[];
  icon?: React.ComponentType; // Opcional: si hay un icono para la subruta
};

export type RouteType = {
  label: string;
  route: string;
  iconFilled: React.ComponentType;
  iconEmpty: React.ComponentType;
  roles: readonly RolType[];
  subRoutes?: readonly SubNavItemType[]; // Subrutas opcionales
};
export type IngresoType = {
  creadorID: string;
  isPago: boolean;
  items: ProductoType[];
  tipoDePago: TipoDePagoType;
  destinatario: DestinatarioType;
  cliente: PedidoType | null;
  total: number;
  fecha: {
    seconds: number;
    nanoseconds: number;
  };
  pagoParcial: number | null;
};
export type MovimientosType = {
  reservas: PedidoType[];
  compras: PedidoType[];
  fecha: string;
  id: string;
};
export type MontoInicialCajaType = {
  Efectivo: number;
  Mercadopago: number;
};
export type CierreDeCajaType = {
  cierre: Timestamp;
  apertura: Timestamp;
  montoFinal: TotalCajaType;
  montoInicial: MontoInicialCajaType;
  creadorID: string;
};
export type CajaType = {
  isOpen: boolean;
  apertura: {
    seconds: number;
    nanoseconds: number;
  };
  montoInicial: MontoInicialCajaType;
  id: string;
};
export type DataSectionType = {
  movimientos: IngresoType[] | undefined;
  total: number;
};

export type MovimientosDataType = {
  Efectivo: DataSectionType;
  Mercadopago: DataSectionType;
  Total: number | undefined;
};
export type TotalCajaType = {
  Ingresos: number;
  Egresos: number;
  Neto: number;
  NetoEfectivo: number;
  NetoMercadopago: number;
};
export type MovMetadataType = {
  cierresDeCaja: CierreDeCajaType[];
  id: string;
};
