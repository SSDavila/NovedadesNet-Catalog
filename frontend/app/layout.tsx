import './globals.css';

export const metadata = {
  title: 'Novedades Net',
  description: 'Catálogo de productos',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className="bg-gray-100">
        {children}
      </body>
    </html>
  );
}
