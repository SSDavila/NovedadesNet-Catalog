import './globals.css';
import { NotificationProvider } from '@/components/Notifications/NotificationContext';
import NotificationContainer from '@/components/Notifications/NotificationContainer';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Novedades Net',
  description: 'Catálogo de productos',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es" className={inter.className}>
      <NotificationProvider>
        <body className="bg-gray-100">
          {children}
          <NotificationContainer />
        </body>
      </NotificationProvider>
    </html>
  );
}
