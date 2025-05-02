export const scrollIntoTheView = (id: string) => {
  let element = document.querySelector(id);
  if (!element) return;
  element.scrollIntoView({
    behavior: "smooth",
    block: "start",
    inline: "nearest",
  });
};
