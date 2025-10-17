const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const API_ENDPOINTS = {
  users: `${API_BASE_URL}/users`,
  products: `${API_BASE_URL}/products`,
  categories: `${API_BASE_URL}/categories`,
};