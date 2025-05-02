export const getLatestClient = (data: any) => {
  if (!data) return null;
  const dataHours = Object.keys(data);
  const lastHour = dataHours[dataHours.length - 1];
  const selectedData = data[lastHour];
  const selectedClient = selectedData[selectedData.length - 1];
  return selectedClient;
};
