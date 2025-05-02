const getMonthDiff = (vencimientoTimestamp: string) => {
  const fechaActual = new Date();
  const fechaVencimiento = new Date(Number(vencimientoTimestamp) * 1000);
  return (
    fechaVencimiento.getMonth() -
    fechaActual.getMonth() +
    12 * (fechaVencimiento.getFullYear() - fechaActual.getFullYear())
  );
};

export default getMonthDiff;
