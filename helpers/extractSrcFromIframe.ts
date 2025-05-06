export function extractSrcFromIframe(iframe: string) {
    // Extraemos el src del iframe
    const srcMatch = iframe.match(/src="([^"]+)"/);

    if (srcMatch) {
      const src = srcMatch[1];
      return src; // Devuelve solo el src
    }

    // Si no se encuentra un src, retornar null
    return null;
  }