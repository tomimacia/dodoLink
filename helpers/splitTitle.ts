export const fTitle = (title: string) => {
  if (!title) return '';
  return title.split('-').join(' ');
};
