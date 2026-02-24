'use client';

import Providers from '../providers';
import Sidebar from './components/Sidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <div className="flex h-screen bg-[#f8f9ff] overflow-hidden font-sans antialiased selection:bg-purple-100 selection:text-purple-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto relative scroll-smooth">
          {children}
        </main>
      </div>
    </Providers>
  );
}
