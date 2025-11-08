import { useState, useEffect } from 'react';
import { Product } from '@/interfaces/index';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/products`);
        if (!response.ok) {
          throw new Error('No se pudieron cargar los productos desde el servidor.');
        }
        const data: any[] = await response.json();
        
        const formattedProducts: Product[] = data.map(p => ({
          ...p,
          prodPrice: parseFloat(p.prodPrice)
        }));
        setProducts(formattedProducts);
      } catch (err: any) {
        setError(err.message || 'Ocurrió un error inesperado.');
      } finally {
        setIsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return { products, isLoading, error };
}