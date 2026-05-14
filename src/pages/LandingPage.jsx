import { Link } from 'react-router-dom';
import { Zap, Building2, Map, BrainCircuit, BarChart3, Handshake, ShoppingBag, Leaf, ArrowRight, ChevronRight, Globe, Target, TrendingUp, Shield, Users, Sun, Wind, Droplets } from 'lucide-react';
import { useState, useEffect } from 'react';
import api from '../services/api';

function AnimatedCounter({ target, suffix = '', prefix = '' }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const end = parseInt(target);
    if (start === end) return;
    const duration = 2000;
    const increment = end / (duration / 16);
    const timer = setInterval(() => {
      start += increment;
      if (start >= end) { setCount(end); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return <span>{prefix}{count.toLocaleString('id-ID')}{suffix}</span>;
}

export default function LandingPage() {
  const [stats, setStats] = useState(null);
  useEffect(() => {
    api.get('/dashboard/summary').then(r => setStats(r.data.data)).catch(() => {});
  }, []);

  const features = [
    { icon: BrainCircuit, title: 'Rekomendasi AI', desc: 'Sistem AI menghitung skor prioritas dan merekomendasikan distribusi energi optimal untuk setiap UMKM.' },
    { icon: Map, title: 'Peta Potensi Energi', desc: 'Visualisasi peta interaktif lokasi sumber energi bersih dan UMKM yang membutuhkan.' },
    { icon: BarChart3, title: 'Monitoring Dampak', desc: 'Pantau penghematan biaya, peningkatan produktivitas, dan pengurangan emisi karbon secara real-time.' },
    { icon: ShoppingBag, title: 'Marketplace Lokal', desc: 'UMKM dapat menampilkan produk lokal mereka yang diproduksi dengan energi bersih.' },
    { icon: Handshake, title: 'Kemitraan Strategis', desc: 'Hubungkan UMKM dengan investor, koperasi, dan pemerintah dalam satu ekosistem digital.' },
    { icon: Shield, title: 'Data Terverifikasi', desc: 'Seluruh data UMKM dan sumber energi diverifikasi dan dikelola oleh admin sistem.' },
  ];

  const problems = [
    { icon: Zap, title: 'Akses Energi Belum Merata', desc: 'Banyak UMKM di daerah terpencil masih bergantung pada energi mahal dan tidak ramah lingkungan.' },
    { icon: Building2, title: 'UMKM Sulit Berkembang', desc: 'Biaya energi yang tinggi menggerus margin keuntungan dan menghambat pertumbuhan usaha lokal.' },
    { icon: Target, title: 'Prioritas Tidak Jelas', desc: 'Pemerintah kesulitan menentukan wilayah dan sektor mana yang harus diprioritaskan.' },
    { icon: Globe, title: 'Data Belum Terintegrasi', desc: 'Data energi dan ekonomi lokal tersebar di berbagai instansi tanpa sistem terpadu.' },
  ];

  const sdgs = [
    { num: 1, title: 'No Poverty', desc: 'Mendukung perekonomian UMKM lokal', color: '#E5243B' },
    { num: 7, title: 'Affordable & Clean Energy', desc: 'Distribusi energi bersih terjangkau', color: '#FCC30B' },
    { num: 9, title: 'Industry, Innovation & Infrastructure', desc: 'Inovasi teknologi AI untuk infrastruktur energi', color: '#FD6925' },
    { num: 17, title: 'Partnerships for the Goals', desc: 'Kolaborasi multi-stakeholder', color: '#19486A' },
  ];

  const steps = [
    { step: '01', title: 'Daftarkan Usaha', desc: 'UMKM mendaftarkan profil usaha dan kebutuhan energi bulanan.' },
    { step: '02', title: 'AI Analisis Data', desc: 'Sistem menghitung skor prioritas berdasarkan kebutuhan, lokasi, dan dampak ekonomi.' },
    { step: '03', title: 'Rekomendasi Distribusi', desc: 'AI memberikan rekomendasi sumber energi bersih terdekat dan paling efisien.' },
    { step: '04', title: 'Monitoring Dampak', desc: 'Pantau penghematan biaya, produktivitas, dan pengurangan emisi secara berkala.' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-emerald-700" style={{fontFamily:'var(--font-heading)'}}>
            <Zap className="h-7 w-7" /> EnergEco <span className="text-slate-400 font-normal text-sm ml-1">GlobalChain</span>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-emerald-600 transition-colors">Fitur</a>
            <a href="#sdgs" className="hover:text-emerald-600 transition-colors">SDGs</a>
            <a href="#how-it-works" className="hover:text-emerald-600 transition-colors">Cara Kerja</a>
            <a href="#marketplace" className="hover:text-emerald-600 transition-colors">Marketplace</a>
          </div>
          <div className="flex items-center gap-3">
            <Link to="/login" className="text-sm font-medium text-slate-600 hover:text-emerald-600 transition-colors">Masuk</Link>
            <Link to="/register" className="text-sm font-semibold bg-emerald-600 text-white px-5 py-2 rounded-lg hover:bg-emerald-700 transition-colors shadow-sm">Daftar</Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-16 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-emerald-950 to-slate-900"></div>
        <div className="absolute inset-0 opacity-20" style={{backgroundImage:'radial-gradient(circle at 25% 50%, rgba(16,185,129,0.3) 0%, transparent 50%), radial-gradient(circle at 75% 50%, rgba(2,132,199,0.2) 0%, transparent 50%)'}}></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-sm font-medium px-4 py-1.5 rounded-full mb-6">
                <Leaf className="h-4 w-4" /> Berbasis AI &bull; Energi Berkelanjutan
              </div>
              <h1 className="text-4xl lg:text-5xl xl:text-6xl font-extrabold text-white leading-tight" style={{fontFamily:'var(--font-heading)'}}>
                Distribusi Energi Bersih untuk{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-lime-300">Ekonomi Lokal Berkelanjutan</span>
              </h1>
              <p className="mt-6 text-lg text-slate-300 leading-relaxed max-w-lg">
                Memberdayakan UMKM Indonesia dengan akses energi terbarukan yang andal, efisien, dan transparan melalui teknologi AI dan data terintegrasi.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link to="/register" className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-7 py-3 rounded-xl transition-all shadow-lg shadow-emerald-500/25">
                  Mulai Sekarang <ArrowRight className="h-5 w-5" />
                </Link>
                <a href="#how-it-works" className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3 rounded-xl transition-all border border-white/10">
                  Lihat Demo AI <ChevronRight className="h-5 w-5" />
                </a>
              </div>
            </div>
            <div className="hidden lg:grid grid-cols-2 gap-4">
              {[
                { icon: Sun, label: 'Energi Surya', val: 'Solar' },
                { icon: Wind, label: 'Energi Angin', val: 'Wind' },
                { icon: Droplets, label: 'Mikrohidro', val: 'Hydro' },
                { icon: Leaf, label: 'Biomassa', val: 'Biomass' },
              ].map((e, i) => (
                <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-5 hover:bg-white/10 transition-all">
                  <e.icon className="h-8 w-8 text-emerald-400 mb-3" />
                  <p className="text-white font-semibold">{e.label}</p>
                  <p className="text-slate-400 text-sm mt-1">{e.val}</p>
                </div>
              ))}
            </div>
          </div>
          {/* Stats bar */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: 'UMKM Terdaftar', val: stats?.businesses?.active || 0 },
              { label: 'Sumber Energi', val: stats?.energy?.active_sources || 0 },
              { label: 'Kapasitas (kWh)', val: Math.round(stats?.energy?.total_capacity_kwh || 0) },
              { label: 'Emisi Dikurangi (kg)', val: Math.round(stats?.impact?.total_emission_reduction_kg || 0) },
            ].map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-xl p-4 text-center">
                <p className="text-2xl lg:text-3xl font-bold text-white"><AnimatedCounter target={s.val} /></p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Problem Section */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Masalah</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Mengapa Distribusi Energi Bersih Penting?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {problems.map((p, i) => (
              <div key={i} className="bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-red-50 rounded-xl flex items-center justify-center mb-4">
                  <p.icon className="h-6 w-6 text-red-500" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{p.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution / Feature Section */}
      <section id="features" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Solusi</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Platform All-in-One untuk Ekosistem Energi Bersih</h2>
            <p className="mt-4 text-slate-500">EnergEco menghubungkan UMKM, pemerintah, penyedia energi, dan investor dalam satu sistem terintegrasi.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group bg-white rounded-2xl p-6 border border-slate-100 shadow-sm hover:shadow-lg hover:border-emerald-200 transition-all">
                <div className="w-12 h-12 bg-emerald-50 group-hover:bg-emerald-100 rounded-xl flex items-center justify-center mb-4 transition-colors">
                  <f.icon className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{f.title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SDGs Section */}
      <section id="sdgs" className="py-20 bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-400 font-semibold text-sm uppercase tracking-wider mb-2">Sustainable Development Goals</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white" style={{fontFamily:'var(--font-heading)'}}>Mendukung Tujuan Pembangunan Berkelanjutan</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {sdgs.map((s, i) => (
              <div key={i} className="bg-white/5 backdrop-blur border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all">
                <div className="w-14 h-14 rounded-xl flex items-center justify-center text-white text-2xl font-bold mb-4" style={{backgroundColor: s.color}}>
                  {s.num}
                </div>
                <h3 className="font-semibold text-white mb-1">{s.title}</h3>
                <p className="text-sm text-slate-400">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Cara Kerja</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Bagaimana EnergEco Bekerja?</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {steps.map((s, i) => (
              <div key={i} className="text-center">
                <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-emerald-600">{s.step}</span>
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{s.title}</h3>
                <p className="text-sm text-slate-500">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Recommendation Preview */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Kecerdasan Buatan</p>
              <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Rekomendasi Cerdas oleh AI</h2>
              <p className="mt-4 text-slate-500 leading-relaxed">Sistem AI kami menganalisis kebutuhan energi, dampak ekonomi, jarak distribusi, dan potensi reduksi emisi untuk menentukan prioritas distribusi yang optimal.</p>
              <div className="mt-6 space-y-3">
                {[
                  { label: 'Kebutuhan Energi', weight: '30%', color: 'bg-emerald-500' },
                  { label: 'Dampak Ekonomi', weight: '25%', color: 'bg-sky-500' },
                  { label: 'Jarak Distribusi', weight: '15%', color: 'bg-amber-500' },
                  { label: 'Keberlanjutan', weight: '15%', color: 'bg-violet-500' },
                  { label: 'Reduksi Emisi', weight: '15%', color: 'bg-rose-500' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className={`w-2.5 h-2.5 rounded-full ${item.color} flex-shrink-0`}></div>
                    <div className="flex-1 bg-slate-200 rounded-full h-2.5">
                      <div className={`h-2.5 rounded-full ${item.color}`} style={{width: item.weight}}></div>
                    </div>
                    <span className="text-sm text-slate-600 w-40">{item.label} ({item.weight})</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <BrainCircuit className="h-5 w-5 text-emerald-500" />
                <span className="font-semibold text-slate-800">Contoh Hasil Rekomendasi</span>
              </div>
              {[
                { name: 'UMKM Batik Lestari', score: 87, level: 'Urgent', sector: 'Kerajinan', color: 'border-red-200 bg-red-50' },
                { name: 'Cold Storage Ikan Segar', score: 72, level: 'High', sector: 'Perikanan', color: 'border-orange-200 bg-orange-50' },
                { name: 'Pengeringan Kopi Mandiri', score: 65, level: 'Medium', sector: 'Pertanian', color: 'border-yellow-200 bg-yellow-50' },
              ].map((rec, i) => (
                <div key={i} className={`rounded-xl border p-4 ${rec.color}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-slate-800">{rec.name}</p>
                      <p className="text-xs text-slate-500">{rec.sector}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-slate-800">{rec.score}</p>
                      <p className="text-xs text-slate-500">{rec.level}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Energy Map Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Peta Interaktif</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Visualisasi Potensi Energi Bersih</h2>
            <p className="mt-4 text-slate-500">Lihat sebaran UMKM dan sumber energi bersih di peta interaktif. Identifikasi wilayah prioritas dan jarak distribusi optimal.</p>
          </div>
          <div className="bg-slate-100 rounded-2xl border border-slate-200 overflow-hidden shadow-lg">
            <div className="relative h-80 bg-gradient-to-br from-emerald-50 to-sky-50 flex items-center justify-center">
              <div className="absolute inset-0 opacity-30" style={{backgroundImage:'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%23059669\' fill-opacity=\'0.1\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'}}></div>
              <div className="relative text-center">
                <Map className="h-16 w-16 text-emerald-500 mx-auto mb-4" />
                <p className="text-lg font-semibold text-slate-700">Peta Energi Interaktif</p>
                <p className="text-slate-500 text-sm mt-1">Marker UMKM, sumber energi, dan garis distribusi</p>
                <div className="flex justify-center gap-4 mt-4">
                  {[
                    { color: 'bg-emerald-500', label: 'UMKM' },
                    { color: 'bg-sky-500', label: 'Sumber Energi' },
                    { color: 'bg-amber-500', label: 'Koneksi AI' },
                  ].map((l, i) => (
                    <div key={i} className="flex items-center gap-1.5 text-xs text-slate-600">
                      <div className={`w-3 h-3 rounded-full ${l.color}`}></div> {l.label}
                    </div>
                  ))}
                </div>
                <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-6 py-2.5 rounded-xl mt-6 hover:bg-emerald-700 transition-colors text-sm">
                  Buka Peta <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace Preview */}
      <section id="marketplace" className="py-20 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Marketplace</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Produk Lokal Berbasis Energi Bersih</h2>
            <p className="mt-4 text-slate-500">UMKM yang menggunakan energi bersih dapat memamerkan produk mereka di marketplace EnergEco.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { name: 'Keripik Pisang Premium', umkm: 'UMKM Keripik Pak Budi', price: 'Rp 35.000', sector: 'Makanan' },
              { name: 'Ikan Fillet Segar', umkm: 'Cold Storage Bu Sari', price: 'Rp 85.000', sector: 'Perikanan' },
              { name: 'Kopi Arabica Roasted', umkm: 'Pengeringan Kopi Pak Joko', price: 'Rp 120.000', sector: 'Pertanian' },
              { name: 'Batik Tulis Eco', umkm: 'UMKM Batik Lestari', price: 'Rp 250.000', sector: 'Kerajinan' },
            ].map((p, i) => (
              <div key={i} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="h-40 bg-gradient-to-br from-slate-100 to-slate-50 flex items-center justify-center relative">
                  <ShoppingBag className="h-12 w-12 text-slate-300 group-hover:text-emerald-400 transition-colors" />
                  <div className="absolute top-3 right-3 bg-emerald-500 text-white text-xs font-semibold px-2 py-0.5 rounded-md flex items-center gap-1">
                    <Leaf className="h-3 w-3" /> Clean Energy
                  </div>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-slate-800">{p.name}</p>
                  <p className="text-xs text-slate-400 mt-1">{p.umkm}</p>
                  <div className="flex justify-between items-center mt-3">
                    <span className="text-emerald-600 font-bold">{p.price}</span>
                    <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded">{p.sector}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-600 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-700 transition-colors shadow-sm">
              Jelajahi Marketplace <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Impact Statistics */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <p className="text-emerald-600 font-semibold text-sm uppercase tracking-wider mb-2">Dampak Nyata</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-slate-900" style={{fontFamily:'var(--font-heading)'}}>Dampak Positif yang Terukur</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { icon: Building2, label: 'UMKM Terdukung', value: stats?.businesses?.active || 0, suffix: ' usaha', color: 'from-emerald-500 to-emerald-600' },
              { icon: Zap, label: 'Energi Didistribusikan', value: Math.round(stats?.energy?.total_capacity_kwh || 0), suffix: ' kWh', color: 'from-sky-500 to-sky-600' },
              { icon: Users, label: 'Tenaga Kerja Terdampak', value: stats?.businesses?.total_employees || 0, suffix: ' orang', color: 'from-amber-500 to-amber-600' },
              { icon: Leaf, label: 'Emisi CO₂ Dikurangi', value: Math.round(stats?.impact?.total_emission_reduction_kg || 0), suffix: ' kg', color: 'from-violet-500 to-violet-600' },
            ].map((s, i) => (
              <div key={i} className={`bg-gradient-to-br ${s.color} rounded-2xl p-6 text-white text-center`}>
                <s.icon className="h-8 w-8 mx-auto opacity-80 mb-3" />
                <p className="text-3xl font-bold"><AnimatedCounter target={s.value} />{s.suffix}</p>
                <p className="text-sm opacity-80 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-emerald-600 to-emerald-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-white mb-4" style={{fontFamily:'var(--font-heading)'}}>Siap Memulai Transformasi Energi?</h2>
          <p className="text-emerald-100 text-lg mb-8 max-w-2xl mx-auto">Bergabunglah dengan ekosistem energi bersih EnergEco dan jadilah bagian dari perubahan ekonomi lokal berkelanjutan.</p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link to="/register" className="inline-flex items-center gap-2 bg-white text-emerald-700 font-semibold px-8 py-3 rounded-xl hover:bg-emerald-50 transition-colors shadow-lg">
              Daftar Sekarang <ArrowRight className="h-5 w-5" />
            </Link>
            <Link to="/login" className="inline-flex items-center gap-2 bg-emerald-500/30 text-white font-semibold px-8 py-3 rounded-xl hover:bg-emerald-500/40 transition-colors border border-white/20">
              Masuk ke Sistem
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2 text-white font-bold text-lg">
              <Zap className="h-6 w-6 text-emerald-400" /> EnergEco GlobalChain
            </div>
            <div className="flex gap-6 text-sm">
              <a href="#features" className="hover:text-white transition-colors">Fitur</a>
              <a href="#sdgs" className="hover:text-white transition-colors">SDGs</a>
              <a href="#how-it-works" className="hover:text-white transition-colors">Cara Kerja</a>
            </div>
            <p className="text-sm">&copy; 2026 EnergEco GlobalChain. Hackathon Project.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
