export const getDateRangeFromLapso = (lapso: string) => {
  const now = new Date(); // Fecha actual
  
  // Validación del formato de lapso
  const match = lapso.match(/^(\d+)([hd])$/); // solo acepta formato como '4h' o '10d'

  if (!match) {
    throw new Error('Formato de lapso inválido. Usá por ejemplo "4h" o "10d"');
  }

  const cantidad = parseInt(match[1]);
  const unidad = match[2]; // 'h' o 'd'

  // Calcular 'from' restando el lapso al tiempo actual
  if (unidad === 'h') {
    now.setHours(now.getHours() - cantidad); // Restamos horas
  } else if (unidad === 'd') {
    now.setDate(now.getDate() - cantidad); // Restamos días
  }

  const from = new Date(now);

  // Formatear las fechas a 'YYYY-MM-DD HH:mm:ss'
  const formatDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  // El 'to' es la fecha actual
  const to = formatDate(new Date());

  return {
    from: formatDate(from),
    to,
  };
};
