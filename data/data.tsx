import { RolType } from '@/types/types';
import { CiBoxes } from 'react-icons/ci';
import { FaBoxes, FaClipboardList, FaRegUser, FaUser } from 'react-icons/fa';
import {
  IoCart,
  IoCartOutline,
  IoHomeOutline,
  IoHomeSharp,
  IoStatsChart,
  IoStatsChartOutline,
} from 'react-icons/io5';
import { PiUsersThreeFill, PiUsersThreeLight } from 'react-icons/pi';
import { TiClipboard } from 'react-icons/ti';
export const Routes = [
  {
    label: 'Inicio',
    route: 'Inicio',
    iconFilled: IoHomeSharp,
    iconEmpty: IoHomeOutline,
    roles: ['Admin', 'Superadmin', 'Supervisor', 'Cuadrilla'],
    subRoutes: [],
  },
  {
    label: 'Clientes',
    route: 'Clientes',
    iconFilled: PiUsersThreeFill,
    iconEmpty: PiUsersThreeLight,
    roles: ['Admin', 'Superadmin', 'Supervisor'],
    subRoutes: [],
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
export const AdminRoles: RolType[] = ['Admin', 'Superadmin', 'Supervisor'];
export const CheckAdminRol = (rol?: RolType) => {
  return AdminRoles.some((r) => r === rol);
};
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
