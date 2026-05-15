import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Zap, Map, Brain, ShoppingBag, BarChart3, ArrowRight, Users, Building2, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      <nav className="fixed top-0 w-full z-50 bg-slate-950/70 backdrop-blur-xl border-b border-slate-800/50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center"><Leaf size={22} className="text-white" /></div>
            <div>
              <span className="text-lg font-bold tracking-tight">EnergEco</span>
              <span className="text-[10px] text-slate-400 block -mt-1 uppercase tracking-widest">GlobalChain</span>
            </div>
          </Link>
          <div className="hidden md:flex items-center gap-8 text-sm text-slate-400">
            <a href="#features" className="hover:text-white transition">Fitur</a>
            <a href="#impact" className="hover:text-white transition">Dampak</a>
            <Link to="/marketplace" className="hover:text-white transition">Marketplace</Link>
          </div>
          <div className="flex items-center gap-3">
            <Button variant="ghost" asChild className="text-slate-300 hover:text-white">
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white shadow-lg shadow-emerald-500/20">
              <Link to="/register">Daftar Gratis</Link>
            </Button>
          </div>
        </div>
      </nav>

      <section className="relative pt-32 pb-20 px-6">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl" />
          <div className="absolute top-40 right-1/4 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-cyan-500/8 rounded-full blur-3xl" />
        </div>
        <div className="max-w-5xl mx-auto text-center relative z-10">
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 text-xs font-medium bg-emerald-500/10 text-emerald-400 px-4 py-1.5 rounded-full border border-emerald-500/20 mb-8">
              <Zap size={14} /> Platform Energi Bersih Berbasis AI
            </span>
          </motion.div>
          <motion.h1 initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="text-5xl md:text-7xl font-bold tracking-tight leading-tight mb-6">
            Distribusi Energi Bersih <span className="bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 bg-clip-text text-transparent">Cerdas & Merata</span>
          </motion.h1>
          <motion.p initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Platform AI yang menghubungkan UMKM, penyedia energi, dan pemerintah untuk distribusi energi bersih yang tepat sasaran dan berdampak.
          </motion.p>
          <motion.div initial="hidden" animate="visible" variants={fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button asChild size="lg" className="group bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-xl shadow-emerald-500/25 h-14 px-8 text-lg rounded-2xl">
              <Link to="/register">Mulai Sekarang <ArrowRight size={20} className="ml-2 group-hover:translate-x-1 transition-transform" /></Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-slate-400 hover:text-white border-slate-700 hover:border-slate-500 h-14 px-8 text-lg rounded-2xl bg-transparent hover:bg-slate-800/50">
              <a href="#features">Pelajari Lebih Lanjut</a>
            </Button>
          </motion.div>
        </div>
      </section>

      <section className="py-16 px-6 border-y border-slate-800/50">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6">
          {stats.map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="text-center p-6 rounded-2xl bg-slate-900/50 border border-slate-800/50">
              <div className="inline-flex p-3 rounded-xl bg-emerald-500/10 text-emerald-400 mb-3">{s.icon}</div>
              <p className="text-3xl font-bold text-white">{s.value}</p>
              <p className="text-sm text-slate-400 mt-1">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      <section id="features" className="py-24 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Fitur Utama</h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">Solusi digital terintegrasi untuk ekosistem energi bersih dan ekonomi lokal.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 gap-6">
            {features.map((f, i) => (
              <motion.div key={f.title} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="group p-8 rounded-2xl bg-slate-900/50 border border-slate-800/50 hover:border-emerald-500/30 transition-all duration-300">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-emerald-500/20 to-teal-500/20 flex items-center justify-center text-emerald-400 mb-5 group-hover:scale-110 transition-transform">{f.icon}</div>
                <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                <p className="text-slate-400 leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="impact" className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
            <h2 className="text-4xl font-bold mb-6">Bergabung dalam Transformasi <span className="bg-gradient-to-r from-emerald-400 to-cyan-400 bg-clip-text text-transparent">Energi Bersih</span></h2>
            <p className="text-lg text-slate-400 mb-10 max-w-2xl mx-auto">Dukung SDG 7, SDG 9, dan SDG 17. Jadilah bagian dari ekosistem energi bersih yang adil dan berdampak.</p>
            <Button asChild size="lg" className="bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-white font-semibold shadow-xl shadow-emerald-500/25 h-14 px-8 text-lg rounded-2xl">
              <Link to="/register">Daftar Sekarang <ArrowRight size={20} className="ml-2" /></Link>
            </Button>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-slate-800/50 py-12 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2"><Leaf size={20} className="text-emerald-400" /><span className="font-bold">EnergEco GlobalChain</span></div>
          <p className="text-sm text-slate-500">© 2026 EnergEco GlobalChain. PLAY IT! Hackathon 2026.</p>
        </div>
      </footer>
    </div>
  );
}
