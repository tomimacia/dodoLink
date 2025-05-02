export function divideArray(arr: any, numDivisions: number) {
  const result = [];
  const chunkSize = Math.ceil(arr.length / numDivisions);

  for (let i = 0; i < arr.length; i += chunkSize) {
    const chunk = arr.slice(i, i + chunkSize);
    result.push(chunk);
  }

  return result;
}
