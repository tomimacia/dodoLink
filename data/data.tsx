import { EdgeLineType, RolType, TipoEquipo } from '@/types/types';
import { CiBoxes } from 'react-icons/ci';
import { FaBoxes, FaClipboardList, FaRegUser, FaUser } from 'react-icons/fa';
import { HiOutlineServer } from 'react-icons/hi';
import {
  IoCart,
  IoCartOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoStatsChart,
  IoStatsChartOutline,
} from 'react-icons/io5';
import { PiUsersThreeFill, PiUsersThreeLight } from 'react-icons/pi';
import { RiServerFill } from 'react-icons/ri';
import { TiClipboard } from 'react-icons/ti';
export const allRoles: RolType[] = [
  'Superadmin',
  'Supervisor',
  'Admin',
  'Cuadrilla',
  'NOC Support',
];
export const Routes = [
  {
    label: 'Inicio',
    route: 'Inicio',
    iconFilled: IoHomeSharp,
    iconEmpty: IoHomeOutline,
    roles: ['Admin', 'Superadmin', 'Supervisor', 'Cuadrilla', 'NOC Support'],
    subRoutes: [],
  },
  {
    label: 'Clientes',
    route: 'Clientes',
    iconFilled: PiUsersThreeFill,
    iconEmpty: PiUsersThreeLight,
    roles: ['Admin', 'Superadmin', 'Supervisor', 'NOC Support'],
    subRoutes: [
      {
        label: 'Servicios',
        route: 'Clientes/Servicios',
        roles: ['Superadmin', 'Supervisor', 'Admin', 'NOC Support'],
      },
    ],
  },
  {
    label: 'Nodos',
    route: 'Nodos',
    iconFilled: RiServerFill,
    iconEmpty: HiOutlineServer,
    roles: ['Admin', 'Superadmin', 'Supervisor'],
    subRoutes: [
      {
        label: 'Carga',
        route: 'Nodos/Carga',
        roles: ['Superadmin', 'Supervisor'],
      },
    ],
  },
  {
    label: 'Inventario',
    route: 'Inventario',
    iconFilled: FaBoxes,
    iconEmpty: CiBoxes,
    roles: ['Admin', 'Superadmin', 'Supervisor'],
    subRoutes: [
      {
        label: 'Carga',
        route: 'Inventario/Carga',
        roles: ['Superadmin', 'Supervisor'],
      },
      {
        label: 'Listado',
        route: 'Inventario/Listado',
        roles: ['Admin', 'Superadmin', 'Supervisor'],
      },
      {
        label: 'Asignados ',
        route: 'Inventario/Asignados',
        roles: ['Admin', 'Superadmin', 'Supervisor'],
      },
    ],
  },
  {
    label: 'Reservas',
    route: 'Reservas',
    iconFilled: FaClipboardList,
    iconEmpty: TiClipboard,
    roles: ['Admin', 'Superadmin', 'Supervisor'],
    subRoutes: [
      {
        label: 'Carga',
        route: 'Reservas/Carga',
        roles: ['Admin', 'Superadmin', 'Supervisor'],
      },
      {
        label: 'Listado',
        route: 'Reservas/Listado',
        roles: ['Superadmin', 'Supervisor'],
      },
    ],
  },
  {
    label: 'Compras',
    route: 'Compras',
    iconFilled: IoCart,
    iconEmpty: IoCartOutline,
    roles: ['Admin', 'Superadmin', 'Supervisor'],
    subRoutes: [
      {
        label: 'Carga',
        route: 'Compras/Carga',
        roles: ['Admin', 'Superadmin', 'Supervisor'],
      },
      {
        label: 'Listado',
        route: 'Compras/Listado',
        roles: ['Superadmin', 'Supervisor'],
      },
    ],
  },
  {
    label: 'Usuarios',
    route: 'Usuarios',
    iconFilled: FaUser,
    iconEmpty: FaRegUser,
    roles: ['Superadmin', 'Supervisor'],
    subRoutes: [
      {
        label: 'Alta',
        route: 'Usuarios/Alta',
        roles: ['Superadmin', 'Supervisor'],
      },
    ],
  },
  {
    label: 'Dashboard',
    route: 'Dashboard',
    iconFilled: IoStatsChart,
    iconEmpty: IoStatsChartOutline,
    roles: ['Superadmin'],
    subRoutes: [
      {
        label: 'Reservas',
        route: 'Dashboard/Reservas',
        roles: ['Superadmin'],
      },
      { label: 'Compras', route: 'Dashboard/Compras', roles: ['Superadmin'] },
    ],
  },
];
export const allRoutesWithRoles = Routes.flatMap((route) => [
  {
    route: route.route === 'Inicio' ? '/' : `/${route.route}`,
    roles: route.roles,
  },
  ...route.subRoutes.map((subRoute) => ({
    route: `/${subRoute.route}`,
    roles: subRoute.roles,
  })),
]);
export const AdminRoles: RolType[] = ['Admin', 'Superadmin', 'Supervisor'];
export const CheckAdminRol = (rol?: RolType) => {
  return AdminRoles.some((r) => r === rol);
};

export const TimeData = {
  meses: [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre',
  ],
  dias: [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado',
  ],
};
export const CurrentURL = process.env.NEXT_PUBLIC_CURRENT_URL;
export const mailsForNotification = [
  'mdoval@dodolink.com.ar',
  'lperez@dodolink.com.ar',
  'arian.f@dodolink.com.ar',
  'acarvalho@dodolink.com.ar',
];
export const statusColors = {
  Active: '#779500',
  Cancelled: '#888888',
  Terminated: '#888888',
  Pending: '#cc0000',
};
export const TiposDeEquipo: TipoEquipo[] = [
  'Switch',
  'Router',
  'Core',
  'Túnel',
  'VXLAN',
  'Otro',
];
export const lineTypes: EdgeLineType[] = [
  'default',
  'straight',
  'step',
  'smoothstep',
];
export const lineIcons = {
  straight: (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <line
        x1='4'
        y1='20'
        x2='20'
        y2='4'
        stroke='currentColor'
        strokeWidth='2'
      />
    </svg>
  ),
  step: (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        d='M4 20 H10 V14 H16'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
      />
    </svg>
  ),
  smoothstep: (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        d='M4 20 Q10 20, 10 14 Q10 14, 16 14'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
        stroke-linecap='butt'
        stroke-linejoin='round'
      />
    </svg>
  ),
  default: (
    <svg width='24' height='24' viewBox='0 0 24 24'>
      <path
        d='M4 20 C8 10, 16 20, 20 10'
        stroke='currentColor'
        strokeWidth='2'
        fill='none'
        stroke-linecap='round'
      />
    </svg>
  ),
};
