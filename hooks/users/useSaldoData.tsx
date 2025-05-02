import { getEstado } from '@/helpers/cobros/getEstado';
import { ClientType, EstadoType } from '@/types/types';
import { useColorMode } from '@chakra-ui/react';

const useSaldoData = (client: ClientType | null) => {
  const saldo = client?.saldo || 0;
  const currentColorMode = useColorMode();
  const todaySeconds = new Date().getTime() / 1000;
  const estado = getEstado(client) as EstadoType;
  // const prevGreen = "#37A168"
  const estadoColors = {
    Habilitado: { light: '#54B441', dark: '#9AE6B4' },
    Vencido: { light: '#DD6B20', dark: '#FBD38D' },
    Inactivo: { light: '#2D3748', dark: '#d9dadb' },
    Inhabilitado: { light: '#E53E3E', dark: '#FEB2B2' },
  };
  const saldoColors = {
    Habilitado: { light: '#2db561', dark: '#097969' },
    Vencido: { light: '#e3bd64', dark: '#9e781e' },
    Inhabilitado: { light: '#f79d99', dark: '#983B1F' },
  };
  const getSaldoColor = () => {
    if (saldo > 0) return { light: '#19a65f', dark: '#097969' };
    if (saldo < 0) return { light: '#CB7E73', dark: '#983B1F' };
    return { light: '#66acf2', dark: '#3e7ff0' };
  };
  const saldoColor = getSaldoColor();
  return {
    estado,
    color: estadoColors[estado][currentColorMode.colorMode],
    saldoColor: saldoColor[currentColorMode.colorMode],
    todaySeconds,
  };
};

export default useSaldoData;
