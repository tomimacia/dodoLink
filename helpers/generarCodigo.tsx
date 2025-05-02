export function generarCodigoPromocional(longitud: number) {
  const caracteres = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let codigo = '';
  for (let i = 0; i < longitud; i++) {
    const indice = Math.floor(Math.random() * caracteres.length);
    codigo += caracteres.charAt(indice);
  }
  return codigo;
}
