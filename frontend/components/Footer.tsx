'use client';

import Image from 'next/image';
import Link from 'next/link';
import { FaFacebook, FaInstagram, FaWhatsapp, FaEnvelope, FaMapMarkerAlt, FaShieldAlt } from 'react-icons/fa';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white/70 backdrop-blur-2xl border-t border-slate-200/60 relative z-10 overflow-hidden pt-12 pb-8">
      {/* Background Micro-patterns - Sincronizado con Header (10px) */}
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(#6b21a8 0.5px, transparent 0.5px)', backgroundSize: '10px 10px' }} />

      <div className="max-w-7xl mx-auto px-6 lg:px-10 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8">

          {/* Section 1: Brand Identity & Vibrant Socials */}
          <div className="md:col-span-12 lg:col-span-4 flex flex-col items-center lg:items-start text-center lg:text-left">
            <Link href="/site" className="flex items-center gap-3 active:scale-95 transition-transform group">
              <div className="relative group-hover:rotate-12 transition-transform duration-700">
                <Image src="/Logo-NovedadesNet.png" alt="Logo" width={36} height={36} />
              </div>
              <div className="flex flex-col">
                <span className="text-xl font-black text-purple-900 uppercase tracking-[0.1em] leading-none">
                  Novedades
                </span>
                <span className="text-[15px] font-black bg-gradient-to-r from-purple-600 to-yellow-500 text-transparent bg-clip-text uppercase tracking-[0.45em] leading-none mt-1">
                  Net
                </span>
              </div>
            </Link>
            <p className="mt-5 text-slate-500 text-sm font-medium leading-relaxed max-w-xs">
              Tu destino premium para la innovación y el estilo. Transformamos espacios con productos únicos.
            </p>

            {/* Vibrant Social Icons - Permanent Colors */}
            <div className="flex gap-4 mt-8">
              {[
                {
                  icon: <FaFacebook size={20} />,
                  href: '#',
                  label: 'FB',
                  color: 'text-white bg-[#1877F2]',
                  glow: 'hover:shadow-[0_0_20px_rgba(24,119,242,0.5)]'
                },
                {
                  icon: <FaInstagram size={20} />,
                  href: '#',
                  label: 'IG',
                  color: 'text-white bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7]',
                  glow: 'hover:shadow-[0_0_20px_rgba(238,42,123,0.5)]'
                },
                {
                  icon: <FaWhatsapp size={20} />,
                  href: 'https://wa.me/+593963988846',
                  label: 'WA',
                  color: 'text-white bg-[#25D366]',
                  glow: 'hover:shadow-[0_0_20px_rgba(37,211,102,0.5)]'
                },
              ].map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  className={`w-11 h-11 flex items-center justify-center rounded-2xl shadow-sm hover:-translate-y-1.5 active:scale-95 transition-all duration-500 relative group/social ${s.color} ${s.glow}`}
                  aria-label={s.label}
                >
                  <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-hover/social:opacity-20 transition-opacity" />
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Section 2: Links & Logistics Card */}
          <div className="md:col-span-12 lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {/* Envíos Section - Official Logos */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/50 hover:border-green-100 transition-colors group">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 group-hover:scale-150 transition-transform" />
                Envíos por
              </h3>
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 group/shipping">
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/shipping:border-green-400 group-hover/shipping:shadow-md transition-all overflow-hidden relative">
                    <Image src="/Logo-Servientrega.png" alt="Servientrega" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700 leading-tight">Servientrega</span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Envios a todo el Ecuador</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 group/shipping">
                  <div className="w-11 h-11 rounded-full bg-white border border-slate-100 flex items-center justify-center shadow-sm group-hover/shipping:border-yellow-400 group-hover/shipping:shadow-md transition-all overflow-hidden relative">
                    <Image src="/Logo-Indrive.png" alt="InDrive" fill className="object-cover" />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-[13px] font-bold text-slate-700 leading-tight">InDrive</span>
                    <span className="text-[10px] text-slate-400 font-medium whitespace-nowrap">Envios en Quito</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Card */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/50 hover:border-purple-100 transition-colors group">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-purple-500 group-hover:scale-150 transition-transform" />
                Ventas
              </h3>
              <ul className="space-y-4">
                <li>
                  <a href="https://wa.me/+593963988846" target="_blank" className="flex flex-col group/item">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">WhatsApp Directo</span>
                    <span className="text-[13px] font-bold text-slate-700 group-hover/item:text-green-600 transition-colors">
                      +593 96 398 8846
                    </span>
                  </a>
                </li>
                <li>
                  <a href="mailto:n.netec.ventas@gmail.com" className="flex flex-col group/item">
                    <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em]">Email Soporte</span>
                    <span className="text-[13px] font-bold text-slate-700 group-hover/item:text-purple-600 transition-colors break-words">
                      n.netec.ventas@gmail.com
                    </span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Location Card */}
            <div className="bg-white/40 backdrop-blur-sm p-6 rounded-3xl border border-white/50 hover:border-yellow-100 transition-colors group">
              <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.2em] mb-5 flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-yellow-500 group-hover:scale-150 transition-transform" />
                Ubicación
              </h3>
              <div className="flex flex-col gap-1 text-xs font-bold text-slate-700 leading-tight">
                <span className="flex items-center gap-2">
                  <FaMapMarkerAlt className="text-yellow-600 opacity-60 shrink-0" /> C.C Quitus
                </span>
                <span className="text-slate-400 font-medium pl-6">Segundo Piso, Local 390</span>
                <div className="mt-4 pt-4 border-t border-slate-200/40 flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-widest">
                  <FaShieldAlt className="opacity-50" /> Compras Seguras
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Minimal Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-5">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-1.5 rounded-full bg-purple-500/50" />
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-[0.15em]">
              &copy; {currentYear} <span className="text-slate-900">NovedadesNet</span> — Todos los derechos reservados
            </p>
          </div>
          <div className="flex gap-10">
            <Link href="#" className="text-[9px] text-slate-400 font-black uppercase tracking-widest hover:text-purple-600 transition-colors">Privacidad</Link>
            <Link href="#" className="text-[9px] text-slate-400 font-black uppercase tracking-widest hover:text-purple-600 transition-colors">Términos</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
