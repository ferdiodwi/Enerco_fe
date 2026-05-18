import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Zap, Map, Brain, ShoppingBag, BarChart3, ArrowRight, Users, Building2, Globe } from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";

const stats = [
  { label: "UMKM Terbantu", value: "150+", icon: <Building2 size={20} /> },
  { label: "Energi Tersalurkan", value: "45,000 kWh", icon: <Zap size={20} /> },
  { label: "Pengurangan Emisi", value: "12 Ton CO₂", icon: <Globe size={20} /> },
  { label: "Mitra Bergabung", value: "30+", icon: <Users size={20} /> },
];

const features = [
  { icon: <Map size={28} />, title: "Pemetaan Energi", desc: "Peta interaktif lokasi UMKM dan sumber energi bersih di seluruh wilayah." },
  { icon: <Brain size={28} />, title: "AI Recommendation", desc: "Rekomendasi distribusi energi cerdas berbasis data dan kecerdasan buatan." },
  { icon: <BarChart3 size={28} />, title: "Impact Monitoring", desc: "Pantau dampak ekonomi dan lingkungan secara real-time dengan dashboard analitik." },
  { icon: <ShoppingBag size={28} />, title: "Marketplace Lokal", desc: "Marketplace produk UMKM yang didukung energi bersih untuk pasar yang lebih luas." },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 text-gray-900 dark:text-white overflow-x-hidden font-satoshi transition-colors duration-300">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-gray-950/80 backdrop-blur-xl border-b border-gray-200 dark:border-gray-800 transition-colors duration-300">
        <div className="flex items-center justify-between px-6 py-4 mx-auto max-w-7xl">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 shadow-lg rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-emerald-500/20">
              <Leaf size={22} className="text-white" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">EnergEco</span>
              <span className="block text-[10px] font-medium tracking-widest uppercase text-emerald-600 dark:text-emerald-400 -mt-1">
                GlobalChain
              </span>
            </div>
          </Link>
          
          <div className="items-center hidden gap-8 text-sm font-medium md:flex text-gray-600 dark:text-gray-400">
            <a href="#features" className="transition hover:text-emerald-500 dark:hover:text-white">Fitur</a>
            <a href="#impact" className="transition hover:text-emerald-500 dark:hover:text-white">Dampak</a>
            <Link to="/marketplace" className="transition hover:text-emerald-500 dark:hover:text-white">Marketplace</Link>
          </div>
          
          <div className="flex items-center gap-3 lg:gap-4">
            <ThemeToggleButton />
            <Link to="/login" className="px-4 py-2 text-sm font-medium transition-colors text-gray-600 dark:text-gray-300 hover:text-emerald-600 dark:hover:text-white">Masuk</Link>
            <Link to="/register" className="inline-flex items-center px-4 py-2 text-sm font-medium text-white transition-all rounded-lg shadow-lg bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/20 hover:shadow-emerald-500/40">
              Daftar Gratis
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-32 pb-20 lg:pt-40 lg:pb-28">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute w-96 h-96 bg-emerald-500/20 dark:bg-emerald-500/10 rounded-full blur-3xl top-20 left-1/4 mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute w-80 h-80 bg-teal-500/20 dark:bg-teal-500/10 rounded-full blur-3xl top-40 right-1/4 mix-blend-multiply dark:mix-blend-screen" />
          <div className="absolute w-72 h-72 bg-cyan-500/10 dark:bg-cyan-500/8 rounded-full blur-3xl bottom-0 left-1/2 mix-blend-multiply dark:mix-blend-screen" />
        </div>
        
        <div className="relative z-10 max-w-5xl mx-auto text-center">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-1.5 mb-8 text-xs font-semibold rounded-full border bg-emerald-50 text-emerald-600 border-emerald-200 dark:bg-emerald-500/10 dark:text-emerald-400 dark:border-emerald-500/20">
              <Zap size={14} className="text-amber-500" /> Platform Energi Bersih Berbasis AI
            </span>
          </motion.div>
          
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mb-6 text-5xl font-extrabold leading-tight tracking-tight text-gray-900 md:text-7xl dark:text-white">
            Distribusi Energi Bersih <br className="hidden md:block" />
            <span className="text-transparent bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 bg-clip-text drop-shadow-sm">Cerdas & Merata</span>
          </motion.h1>
          
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="max-w-2xl mx-auto mb-10 text-lg leading-relaxed text-gray-600 md:text-xl dark:text-gray-400">
            Platform AI tingkat lanjut yang menghubungkan UMKM, penyedia energi, dan pemerintah untuk orkestrasi energi bersih yang akurat dan berdampak nyata.
          </motion.p>
          
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link to="/register" className="inline-flex items-center h-14 px-8 text-lg font-semibold text-white transition-all rounded-2xl shadow-xl group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-0.5">
              Mulai Sekarang <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="#features" className="inline-flex items-center h-14 px-8 text-lg font-medium transition-all bg-white border rounded-2xl text-gray-700 border-gray-300 hover:bg-gray-50 hover:text-gray-900 dark:bg-transparent dark:text-gray-300 dark:border-gray-700 dark:hover:border-gray-500 dark:hover:bg-gray-800/50 hover:-translate-y-0.5">
              Pelajari Lebih Lanjut
            </a>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="px-6 py-16 bg-gray-50/50 dark:bg-transparent border-y border-gray-200 dark:border-gray-800/50">
        <div className="grid max-w-6xl grid-cols-2 gap-6 mx-auto md:grid-cols-4">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="p-6 text-center transition-all bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-900/40 dark:border-gray-800/60 dark:shadow-none hover:shadow-md dark:hover:border-emerald-500/30 group">
              <div className="inline-flex p-3 mb-4 transition-colors rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20">{s.icon}</div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="px-6 py-24">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="mb-16 text-center">
            <h2 className="mb-4 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">Eksplorasi Fitur GlobalChain</h2>
            <p className="max-w-2xl mx-auto text-lg text-gray-600 dark:text-gray-400">Solusi digital terintegrasi untuk ekosistem energi bersih, mengoptimalkan setiap aspek operasional dan ekonomi lokal secara cerdas.</p>
          </motion.div>
          <div className="grid gap-6 md:grid-cols-2">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="p-8 transition-all duration-300 bg-white border border-gray-200 shadow-sm group rounded-2xl dark:bg-gray-900/40 dark:border-gray-800/60 dark:shadow-none hover:border-emerald-500/40 dark:hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 dark:hover:shadow-emerald-500/10 hover:-translate-y-1">
                <div className="flex items-center justify-center mb-6 transition-transform shadow-sm w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-100 to-teal-100 dark:from-emerald-500/20 dark:to-teal-500/20 text-emerald-600 dark:text-emerald-400 group-hover:scale-110">
                  {f.icon}
                </div>
                <h3 className="mb-3 text-xl font-bold text-gray-900 dark:text-white group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{f.title}</h3>
                <p className="leading-relaxed text-gray-600 dark:text-gray-400">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="impact" className="px-6 py-24 relative overflow-hidden bg-gray-50 dark:bg-gray-900/30">
        <div className="absolute inset-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-emerald-500/5 via-transparent to-transparent pointer-events-none"></div>
        <div className="relative z-10 max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="mb-6 text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
              Katalisator Transformasi <br/>
              <span className="text-transparent bg-gradient-to-r from-emerald-500 to-cyan-500 bg-clip-text">Energi Masa Depan</span>
            </h2>
            <p className="max-w-2xl mx-auto mb-10 text-lg text-gray-600 dark:text-gray-400">
              Dukung SDG 7, SDG 9, dan SDG 17. Ambil bagian dalam orkestrasi ekosistem energi yang memberdayakan ekonomi sirkular dan menekan jejak karbon.
            </p>
            <Link to="/register" className="inline-flex items-center h-14 px-8 text-lg font-bold text-white transition-all rounded-2xl shadow-xl group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:-translate-y-1">
              Bergabung Sekarang <ArrowRight size={20} className="ml-2 transition-transform group-hover:translate-x-1" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-6 py-12 bg-white border-t border-gray-200 dark:bg-gray-950 dark:border-gray-800/80">
        <div className="flex flex-col items-center justify-between max-w-6xl gap-6 mx-auto md:flex-row">
          <div className="flex items-center gap-2">
            <Leaf size={24} className="text-emerald-500" />
            <span className="text-lg font-bold tracking-tight text-gray-900 dark:text-white">EnergEco <span className="font-medium text-emerald-500">GlobalChain</span></span>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} EnergEco. PLAY IT! Hackathon 2026.
          </p>
        </div>
      </footer>
    </div>
  );
}
