const capitalizeFirst = (inputString: string) => {
  if (inputString.length === 0) {
    return inputString;
  }
  return inputString.charAt(0).toUpperCase() + inputString.slice(1);
};

export default capitalizeFirst;
