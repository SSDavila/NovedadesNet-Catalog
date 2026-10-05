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
        {/* pt-14 on mobile = top bar height */}
        <main className="flex-1 overflow-y-auto relative scroll-smooth pt-14 md:pt-0">
          {children}
        </main>
      </div>
    </Providers>
  );
}
