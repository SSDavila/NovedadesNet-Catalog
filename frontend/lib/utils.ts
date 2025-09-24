/**
 * Construye la URL completa para una imagen de producto.
 * @param imageName - El nombre del archivo de la imagen.
 * @returns La URL completa de la imagen o una URL de placeholder.
 */
export const getProductImageUrl = (imageName: string): string => {
  const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL;

  if (!backendUrl) {
    console.error("NEXT_PUBLIC_BACKEND_URL no está configurada.");
    return '/placeholder.png';
  }

  return `${backendUrl}/static/uploads/products/${imageName}`;
};
