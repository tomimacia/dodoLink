export const addDots = (num: string | number) => {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
};
