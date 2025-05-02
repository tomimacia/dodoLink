export const toFirestoreTimestamp = (dateString: string) => {
  const [year, month, day] = dateString.split('-').map(Number);
  const localDate = new Date(year, month - 1, day, 12); // Fuerza la zona horaria correcta
  return {
    seconds: Math.floor(localDate.getTime() / 1000),
    nanoseconds: 0,
  };
};
