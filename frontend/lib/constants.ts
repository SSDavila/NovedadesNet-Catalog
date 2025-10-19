const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

if (!API_BASE_URL) {
  throw new Error(
    'La variable de entorno NEXT_PUBLIC_API_URL no está definida. Revisa tu archivo .env.local'
  );
}

export { API_BASE_URL };