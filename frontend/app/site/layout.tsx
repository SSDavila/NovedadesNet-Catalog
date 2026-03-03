import Header from '../../components/Header';
import Footer from '../../components/Footer';

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Header />
      <main className="flex-1 pt-20 transition-all duration-300">
        {children}
      </main>
      <Footer />
    </div>
  );
}
