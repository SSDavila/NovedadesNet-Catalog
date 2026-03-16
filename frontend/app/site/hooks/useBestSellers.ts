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
        const response = await fetch(`${API_BASE_URL}/dashboard/bestsellers?limit=12`);

        if (!response.ok) {
          throw new Error(`Error ${response.status}: No se pudieron cargar los productos.`);
        }

        const text = await response.text();
        let products: Product[] = text ? JSON.parse(text) : [];

        // RANDOM FALLBACK: If no bestsellers exist, fetch all products and pick up to 12 random ones
        if (products.length === 0) {
          try {
            const fallbackResponse = await fetch(`${API_BASE_URL}/products`);
            if (fallbackResponse.ok) {
              const fallbackText = await fallbackResponse.text();
              let allProducts: Product[] = fallbackText ? JSON.parse(fallbackText) : [];
              
              // Shuffle array to get random products
              allProducts = allProducts.sort(() => 0.5 - Math.random());
              products = allProducts.slice(0, 12); // Take exactly up to 12
            }
          } catch (e) {
            console.warn('Failed to fetch fallback products', e);
          }
        }

        const formattedProducts = products.map(product => ({
          name: product.productName,
          image: product.images.length > 0 ? product.images[0].productImageUrl : '/placeholder.jpg',
          category: product.category?.categoryName || 'Sin Categoría',
          price: parseFloat(product.productPrice as any) || 0,
          offerPrice: product.productOfferPrice ? parseFloat(product.productOfferPrice as any) : null,
          stock: product.productStock || 0,
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