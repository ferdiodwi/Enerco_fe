import { Link } from 'react-router-dom';
import { Zap, Building2, Map, BrainCircuit, BarChart3, Handshake, ShoppingBag, Leaf, ArrowRight, ChevronRight, Globe, TrendingUp, Shield, Users, Battery, Landmark } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

const meshBg = `radial-gradient(ellipse 80% 60% at 10% 40%, #ecfdf5 0%, transparent 60%),
  radial-gradient(ellipse 60% 50% at 50% 20%, #a7f3d055 0%, transparent 55%),
  radial-gradient(ellipse 50% 60% at 85% 30%, #d1fae5 0%, transparent 55%),
  radial-gradient(ellipse 70% 40% at 70% 60%, #f0fdf4 0%, transparent 50%),
  linear-gradient(180deg, #f0fdf4 0%, #ffffff 100%)`;

function AnimatedCounter({ target, suffix = '' }) {
  const [c, setC] = useState(0);
  useEffect(() => {
    let v = 0; const end = parseInt(target); if (!end) return;
    const inc = end / 125;
    const t = setInterval(() => { v += inc; if (v >= end) { setC(end); clearInterval(t); } else setC(Math.floor(v)); }, 16);
    return () => clearInterval(t);
  }, [target]);
  return <span>{c.toLocaleString('id-ID')}{suffix}</span>;
}

export default function LandingPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => { api.get('/dashboard/summary').then(r => setStats(r.data.data)).catch(() => {}); }, []);

  return (
    <div className="text-slate-800 font-light">

      {/* ═══ NAV ═══ */}
      <nav className="fixed top-0 inset-x-0 z-50 h-16 backdrop-blur-md bg-white/85 border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 h-full flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-600" />
            <span className="text-[17px] font-light text-slate-800 tracking-tight">EnergEco</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-[15px] font-light text-slate-500">
            <a href="#features" className="hover:opacity-70 transition">Fitur</a>
            <a href="#how-it-works" className="hover:opacity-70 transition">Cara Kerja</a>
            <a href="#sdgs" className="hover:opacity-70 transition">Dampak</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-[15px] font-light px-4 py-2 rounded-full border border-emerald-600 text-emerald-600 hover:opacity-70 transition">
              Masuk
            </Link>
            <Link to="/register" className="text-[15px] font-normal px-4 py-2 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Daftar →
            </Link>
          </div>
        </div>
      </nav>

      {/* ═══ HERO + MESH ═══ */}
      <section className="pt-16" style={{ background: meshBg }}>
        <div className="max-w-6xl mx-auto px-6 py-24 lg:py-36">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 text-[10px] font-medium uppercase px-2.5 py-1 rounded-full mb-8 bg-emerald-100/50 text-emerald-700 tracking-wide">
              <Leaf className="h-3 w-3" /> Distribusi Energi Berbasis AI
            </div>
            <h1 className="text-5xl lg:text-[56px] font-light leading-[1.03] -tracking-[1.4px] text-slate-800">
              Distribusi Energi Bersih untuk Masa Depan Ekonomi Lokal
            </h1>
            <p className="mt-6 text-base font-light text-slate-500 leading-relaxed max-w-lg">
              Optimalkan distribusi energi terbarukan ke UMKM Indonesia dengan sistem prioritas AI, pemetaan cerdas, dan ekosistem kolaboratif.
            </p>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link to="/register" className="inline-flex items-center gap-2 text-base font-normal px-5 py-2.5 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
                Mulai Sekarang <ArrowRight className="h-4 w-4" />
              </Link>
              <a href="#features" className="inline-flex items-center gap-2 text-base font-light px-5 py-2.5 rounded-full border border-emerald-600 text-emerald-600 hover:opacity-70 transition">
                Pelajari <ChevronRight className="h-4 w-4" />
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ STATS ═══ */}
      <section className="py-16 bg-white border-b border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { icon: Zap, label: 'Total Kapasitas', val: `${((stats?.energy?.total_capacity_kwh || 0) / 1000).toFixed(1)}`, unit: 'GWh' },
            { icon: Building2, label: 'UMKM Terdaftar', val: `${stats?.businesses?.active || 0}`, unit: 'Unit' },
            { icon: Leaf, label: 'Emisi Dikurangi', val: `${Math.round(stats?.impact?.total_emission_reduction_kg || 0)}`, unit: 'Ton CO₂' },
            { icon: TrendingUp, label: 'Efisiensi', val: '94.2', unit: '%' },
          ].map((st, i) => (
            <div key={i} className="text-center">
              <st.icon className="h-5 w-5 mx-auto mb-3 text-emerald-400" />
              <p className="text-[32px] font-light tracking-tight text-slate-800">{st.val}</p>
              <p className="text-[13px] font-normal text-slate-500 mt-1">{st.unit} · {st.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ═══ FEATURES ═══ */}
      <section id="features" className="py-24 bg-emerald-50/50">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-medium uppercase mb-3 text-emerald-700 tracking-wide">Fitur Platform</p>
          <h2 className="text-[32px] font-light tracking-tight mb-4">Satu ekosistem terintegrasi</h2>
          <p className="text-base font-light text-slate-500 mb-14 max-w-lg">
            EnergEco menghubungkan seluruh aktor distribusi energi bersih dalam satu platform.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: BrainCircuit, title: 'Skor Prioritas AI', desc: 'Sistem AI menghitung skor prioritas distribusi berdasarkan 5 faktor tertimbang.' },
              { icon: Map, title: 'Pemetaan Energi', desc: 'Peta interaktif menampilkan sumber energi bersih dan UMKM secara real-time.' },
              { icon: BarChart3, title: 'Pemantauan Dampak', desc: 'Lacak penghematan biaya, produktivitas, dan pengurangan emisi karbon.' },
              { icon: ShoppingBag, title: 'Pasar UMKM', desc: 'Platform marketplace produk lokal yang diproduksi dengan energi bersih.' },
              { icon: Handshake, title: 'Pusat Kemitraan', desc: 'Hubungkan UMKM, investor, penyedia energi, dan pemerintah.' },
              { icon: Shield, title: 'Data Terverifikasi', desc: 'Data terverifikasi dan dikelola transparan oleh admin dan pemerintah.' },
            ].map((f, i) => (
              <div key={i} className="p-8 rounded-xl bg-white border border-emerald-100 shadow-sm">
                <f.icon className="h-5 w-5 mb-4 text-emerald-600" />
                <h3 className="text-xl font-light tracking-tight mb-2">{f.title}</h3>
                <p className="text-[15px] font-light text-slate-500">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ AI PREVIEW ═══ */}
      <section className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-medium uppercase mb-3 text-emerald-700 tracking-wide">Mesin AI</p>
              <h2 className="text-[32px] font-light tracking-tight mb-4">Rekomendasi cerdas berbasis multi-faktor</h2>
              <p className="text-base font-light text-slate-500 mb-8">
                Sistem menghitung skor prioritas distribusi dari 5 faktor tertimbang untuk setiap UMKM.
              </p>
              <div className="space-y-4">
                {[
                  { label: 'Kebutuhan Energi', w: '30%' },
                  { label: 'Dampak Ekonomi', w: '25%' },
                  { label: 'Jarak Distribusi', w: '15%' },
                  { label: 'Keberlanjutan', w: '15%' },
                  { label: 'Reduksi Emisi', w: '15%' },
                ].map((item, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-[13px] font-normal text-slate-500 mb-1.5">
                      <span>{item.label}</span><span>{item.w}</span>
                    </div>
                    <div className="h-1.5 rounded-full bg-emerald-100">
                      <div className="h-1.5 rounded-full bg-emerald-600" style={{ width: item.w, opacity: 1 - i * 0.15 }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            {/* Dashboard mockup */}
            <div className="rounded-2xl overflow-hidden bg-emerald-950 shadow-xl shadow-emerald-900/10">
              <div className="px-5 py-3 flex items-center gap-2 border-b border-white/10">
                <div className="flex gap-1.5"><div className="w-2.5 h-2.5 rounded-full bg-white/20"></div><div className="w-2.5 h-2.5 rounded-full bg-white/20"></div><div className="w-2.5 h-2.5 rounded-full bg-white/20"></div></div>
                <span className="text-[11px] font-light text-white/40 ml-2">energeco.ai/skor-prioritas</span>
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center gap-2 mb-4">
                  <BrainCircuit className="h-4 w-4 text-emerald-400" />
                  <span className="text-sm font-normal text-white">Hasil Skor Prioritas</span>
                </div>
                {[
                  { name: 'UMKM Batik Lestari', score: 87, tag: 'MENDESAK', tc: 'text-red-400' },
                  { name: 'Penyimpanan Dingin Ikan', score: 72, tag: 'TINGGI', tc: 'text-emerald-400' },
                  { name: 'Pengeringan Kopi Mandiri', score: 65, tag: 'SEDANG', tc: 'text-amber-400' },
                ].map((r, i) => (
                  <div key={i} className="flex items-center justify-between p-3.5 rounded-lg bg-white/5 border border-white/10">
                    <div>
                      <p className="text-sm font-normal text-white">{r.name}</p>
                      <span className={`text-[10px] uppercase px-2 py-0.5 rounded-full mt-1 inline-block bg-white/10 ${r.tc} tracking-wide`}>{r.tag}</span>
                    </div>
                    <span className="text-[28px] font-light text-white tracking-tight">{r.score}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ ECOSYSTEM ═══ */}
      <section className="py-24 bg-emerald-50">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <p className="text-[10px] font-medium uppercase mb-3 text-emerald-800 tracking-wide">Ekosistem</p>
          <h2 className="text-[32px] font-light tracking-tight mb-3">Sinergi terintegrasi</h2>
          <p className="text-base font-light text-slate-500 mb-14 max-w-lg mx-auto">
            Platform multi-stakeholder yang menghubungkan seluruh aktor distribusi energi bersih.
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { icon: Building2, title: 'UMKM', desc: 'Pelaku usaha lokal' },
              { icon: Landmark, title: 'Pemerintah', desc: 'Dinas & regulator' },
              { icon: Battery, title: 'Penyedia Energi', desc: 'Penyedia energi terbarukan' },
              { icon: TrendingUp, title: 'Investor', desc: 'Mitra pendanaan' },
            ].map((r, i) => (
              <div key={i} className="p-6 rounded-xl bg-white border border-emerald-100 shadow-sm">
                <r.icon className="h-6 w-6 mx-auto mb-3 text-emerald-600" />
                <p className="text-base font-light">{r.title}</p>
                <p className="text-[13px] font-normal text-slate-500 mt-1">{r.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ HOW IT WORKS ═══ */}
      <section id="how-it-works" className="py-24 bg-white border-t border-emerald-100">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-medium uppercase mb-3 text-emerald-700 tracking-wide">Cara Kerja</p>
          <h2 className="text-[32px] font-light tracking-tight mb-14">Empat langkah menuju energi bersih</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { n: '01', title: 'Pendaftaran', desc: 'UMKM mendaftarkan profil dan kebutuhan energi.' },
              { n: '02', title: 'Analisis AI', desc: 'Sistem menghitung skor prioritas multi-faktor.' },
              { n: '03', title: 'Distribusi', desc: 'Rekomendasi sumber energi terdekat dan efisien.' },
              { n: '04', title: 'Pemantauan', desc: 'Pantau dampak ekonomi dan lingkungan berkala.' },
            ].map((st, i) => (
              <div key={i}>
                <span className="text-5xl font-light text-emerald-200 tracking-tight block mb-4">{st.n}</span>
                <h3 className="text-xl font-light tracking-tight mb-2">{st.title}</h3>
                <p className="text-[15px] font-light text-slate-500">{st.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ SDGs ═══ */}
      <section id="sdgs" className="py-24 bg-emerald-950">
        <div className="max-w-6xl mx-auto px-6">
          <p className="text-[10px] font-medium uppercase mb-3 text-emerald-300 tracking-wide">Dampak</p>
          <h2 className="text-[32px] font-light tracking-tight mb-14 text-white">Tujuan Pembangunan Berkelanjutan</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { num: '01', title: 'Tanpa Kemiskinan', color: 'text-red-400' },
              { num: '07', title: 'Energi Bersih', color: 'text-amber-400' },
              { num: '09', title: 'Industri & Inovasi', color: 'text-emerald-400' },
              { num: '17', title: 'Kemitraan Global', color: 'text-emerald-200' },
            ].map((sg, i) => (
              <div key={i} className="p-6 rounded-xl bg-white/5 border border-white/10">
                <span className={`text-[32px] font-light tracking-tight block mb-2 ${sg.color}`}>{sg.num}</span>
                <p className="text-[15px] font-light text-white/70">{sg.title}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ CTA ═══ */}
      <section className="py-24 bg-emerald-50/50">
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-light tracking-tight mb-4">Siap memulai transformasi energi?</h2>
          <p className="text-base font-light text-slate-500 mb-10 max-w-md mx-auto">
            Bergabunglah dengan ekosistem EnergEco dan jadilah bagian dari ekonomi lokal berkelanjutan.
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/register" className="inline-flex items-center gap-2 text-base font-normal px-6 py-3 rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition">
              Daftar Sekarang <ArrowRight className="h-4 w-4" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 text-base font-light px-6 py-3 rounded-full border border-emerald-600 text-emerald-600 hover:opacity-70 transition">
              Masuk ke Sistem
            </Link>
          </div>
        </div>
      </section>

      {/* ═══ FOOTER ═══ */}
      <footer className="py-16 bg-white border-t border-emerald-100">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <Zap className="h-5 w-5 text-emerald-600" />
            <span className="text-[15px] font-light text-slate-800">EnergEco GlobalChain</span>
          </div>
          <div className="flex gap-8 text-[13px] font-normal text-slate-500">
            <a href="#features" className="hover:opacity-70 transition">Fitur</a>
            <a href="#how-it-works" className="hover:opacity-70 transition">Cara Kerja</a>
            <a href="#sdgs" className="hover:opacity-70 transition">Dampak</a>
          </div>
          <p className="text-[13px] font-normal text-slate-500">© 2026 EnergEco GlobalChain</p>
        </div>
      </footer>
    </div>
  );
}
