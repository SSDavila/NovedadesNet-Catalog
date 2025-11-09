'use client';

import { useState, useEffect } from 'react';
import { Product } from '@/interfaces';
import { API_BASE_URL } from '@/lib/constants';

export function useBestSellers() {
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBestSellers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await fetch(`${API_BASE_URL}/products/bestsellers?limit=9`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los productos.`);
        }

        const text = await response.text();
        const products: Product[] = text ? JSON.parse(text) : [];

        const formattedProducts = products.map(product => ({
          name: product.productName,
          image: product.images.length > 0 ? product.images[0].productImageUrl : '/placeholder.jpg',
          price: product.productPrice,
          offerPrice: product.productOfferPrice,
          href: `/site/products/${product.productId}`,
        }));
        setFeaturedProducts(formattedProducts);
      } catch (err: any) {
        setError(err.message);
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBestSellers();
  }, []);

  return { featuredProducts, isLoading, error };
}