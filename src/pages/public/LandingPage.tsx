import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Leaf, Zap, Map, Brain, ShoppingBag, BarChart3, ArrowRight, Users, Building2, Globe, Sparkles, ShieldCheck } from "lucide-react";
import { ThemeToggleButton } from "../../components/common/ThemeToggleButton";
import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import L from "leaflet";
import api from "@/services/api";
import { useTheme } from "@/context/ThemeContext";

// Stats are now fetched dynamically from backend

const features = [
  { icon: <Map size={28} />, title: "Pemetaan Energi", desc: "Peta interaktif lokasi UMKM dan sumber energi bersih di seluruh wilayah." },
  { icon: <Brain size={28} />, title: "AI Recommendation", desc: "Rekomendasi distribusi energi cerdas berbasis data dan kecerdasan buatan." },
  { icon: <BarChart3 size={28} />, title: "Impact Monitoring", desc: "Pantau dampak ekonomi dan lingkungan secara real-time dengan dashboard analitik." },
  { icon: <ShoppingBag size={28} />, title: "Marketplace Lokal", desc: "Marketplace produk UMKM yang didukung energi bersih untuk pasar yang lebih luas." },
];

const fadeUp = { hidden: { opacity: 0, y: 30 }, visible: { opacity: 1, y: 0 } };

interface RegionData {
  name: string;
  total_energy_need: number;
}

interface PublicStats {
  chart_data_harian: number[];
  chart_data_mingguan: number[];
  insight_text: string;
  sustainability_score: string;
  sustainability_percentage: number;
  top_stats?: {
    umkm_terbantu: number;
    energi_tersalurkan: number;
    pengurangan_emisi: number;
    mitra_bergabung: number;
  };
}

export default function LandingPage() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [topRegions, setTopRegions] = useState<RegionData[]>([]);
  const [totalNeed, setTotalNeed] = useState<number>(0);
  const [mapMarkers, setMapMarkers] = useState<any[]>([]);
  const [loadingMap, setLoadingMap] = useState<boolean>(true);
  const [publicStats, setPublicStats] = useState<PublicStats>({
    chart_data_harian: [40, 70, 35, 90, 50, 80, 45],
    chart_data_mingguan: [280, 490, 245, 630, 350, 560, 315],
    insight_text: "Memuat insight...",
    sustainability_score: "-",
    sustainability_percentage: 0
  });
  const [chartPeriod, setChartPeriod] = useState<"harian" | "mingguan">("harian");

  useEffect(() => {
    // Fetch Priority Areas
    api.get("/map/priority-areas").then(res => {
      if (res.data.success) {
        const regions: RegionData[] = res.data.data;
        const total = regions.reduce((sum, r) => sum + Number(r.total_energy_need), 0);
        setTotalNeed(total);
        // Sort by total energy need descending
        const sorted = [...regions].sort((a, b) => Number(b.total_energy_need) - Number(a.total_energy_need));
        setTopRegions(sorted);
      }
    }).catch(console.error);

    // Fetch Map Markers
    api.get("/map/markers").then(res => {
      if (res.data.success) {
        setMapMarkers([...res.data.data.businesses, ...res.data.data.energy_sources]);
      }
    }).catch(console.error).finally(() => setLoadingMap(false));

    // Fetch Public Stats
    api.get("/dashboard/public-stats").then(res => {
      if (res.data.success) {
        setPublicStats(res.data.data);
      }
    }).catch(console.error);
  }, []);
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
          {[
            { label: "UMKM Terbantu", value: publicStats.top_stats ? `${publicStats.top_stats.umkm_terbantu}+` : "...", icon: <Building2 size={20} /> },
            { label: "Energi Tersalurkan", value: publicStats.top_stats ? `${publicStats.top_stats.energi_tersalurkan.toLocaleString()} kWh` : "...", icon: <Zap size={20} /> },
            { label: "Pengurangan Emisi", value: publicStats.top_stats ? `${publicStats.top_stats.pengurangan_emisi} Ton CO₂` : "...", icon: <Globe size={20} /> },
            { label: "Mitra Bergabung", value: publicStats.top_stats ? `${publicStats.top_stats.mitra_bergabung}+` : "...", icon: <Users size={20} /> },
          ].map((s, i) => (
            <motion.div key={s.label} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1, duration: 0.5 }} className="p-6 text-center transition-all bg-white border border-gray-100 shadow-sm rounded-2xl dark:bg-gray-900/40 dark:border-gray-800/60 dark:shadow-none hover:shadow-md dark:hover:border-emerald-500/30 group">
              <div className="inline-flex p-3 mb-4 transition-colors rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 group-hover:bg-emerald-100 dark:group-hover:bg-emerald-500/20">{s.icon}</div>
              <p className="text-3xl font-extrabold text-gray-900 dark:text-white">{s.value}</p>
              <p className="mt-2 text-sm font-medium text-gray-500 dark:text-gray-400">{s.label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Map Interactive UI Mockup Section */}
      <section className="px-6 py-24 bg-white dark:bg-gray-950">
        <div className="max-w-6xl mx-auto">
          {/* Header & Legend */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div className="max-w-2xl">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight mb-4">Sebaran Energi Nasional</h2>
              <p className="text-lg text-gray-600 dark:text-gray-400">Monitoring real-time kapasitas energi terbarukan di berbagai titik strategis Indonesia.</p>
            </div>
            <div className="flex items-center gap-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 px-5 py-3 rounded-full shadow-sm">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_#10B981]"></div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Optimal</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-[0_0_8px_#F59E0B]"></div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Maintenance</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_#EF4444]"></div>
                <span className="text-xs font-bold text-gray-700 dark:text-gray-300">Critical</span>
              </div>
            </div>
          </div>

            {/* Real Interactive Map Container */}
            <div className="relative w-full h-[500px] rounded-3xl overflow-hidden bg-gray-100 dark:bg-[#0A1015] border border-gray-200 dark:border-gray-800/50 shadow-2xl flex items-center justify-center">
              {loadingMap && (
                <div className="absolute inset-0 z-50 flex items-center justify-center bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm">
                  <div className="w-10 h-10 border-t-2 border-b-2 rounded-full animate-spin border-emerald-500" />
                </div>
              )}
              
              <MapContainer center={[-2.5489, 118.0149]} zoom={5} className="z-0 w-full h-full">
                {isDark ? (
                  <TileLayer
                    key="dark-tiles"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
                  />
                ) : (
                  <TileLayer
                    key="light-tiles"
                    attribution='&copy; <a href="https://carto.com/">CARTO</a>'
                    url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  />
                )}
                
                {mapMarkers.map((marker) => {
                  let colorClass = "bg-gray-500 shadow-gray-500";
                  if (marker.type === "business") colorClass = "bg-emerald-500 shadow-[0_0_15px_#10B981]";
                  else if (marker.type === "energy_source") colorClass = "bg-amber-500 shadow-[0_0_15px_#F59E0B]";
                  
                  // Priority check
                  if (marker.priority_category === "Sangat Prioritas") colorClass = "bg-red-500 shadow-[0_0_15px_#EF4444]";
                  else if (marker.priority_category === "Prioritas") colorClass = "bg-purple-500 shadow-[0_0_15px_#A855F7]";

                  const iconHtml = `<div class="relative flex items-center justify-center w-4 h-4"><div class="absolute w-full h-full rounded-full animate-ping opacity-75 ${colorClass}"></div><div class="relative w-3 h-3 rounded-full ${colorClass}"></div></div>`;
                  
                  const customIcon = L.divIcon({
                    html: iconHtml,
                    className: "bg-transparent border-none",
                    iconSize: [16, 16],
                    iconAnchor: [8, 8],
                  });

                  return (
                    <Marker key={`${marker.type}-${marker.id}`} position={[Number(marker.latitude), Number(marker.longitude)]} icon={customIcon} />
                  );
                })}
              </MapContainer>

              {/* Floating Info Card */}
              <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="absolute z-10 w-72 p-6 border shadow-[0_8px_30px_rgb(0,0,0,0.12)] top-10 left-10 bg-white/90 dark:bg-gray-800/80 backdrop-blur-md border-white/20 dark:border-gray-700/50 rounded-2xl">
                <h3 className="mb-6 text-xs font-bold tracking-wider text-gray-900 uppercase dark:text-white">Ringkasan Wilayah</h3>
                
                <div className="space-y-4 max-h-[250px] overflow-y-auto pr-2 custom-scrollbar">
                  {topRegions.length > 0 ? topRegions.map((region, index) => {
                    const percentage = totalNeed > 0 ? Math.round((Number(region.total_energy_need) / totalNeed) * 100) : 0;
                    const colorStyles = [
                      { text: "text-emerald-600 dark:text-emerald-400", bg: "bg-emerald-500" },
                      { text: "text-teal-600 dark:text-teal-400", bg: "bg-teal-500" },
                      { text: "text-cyan-600 dark:text-cyan-400", bg: "bg-cyan-500" },
                      { text: "text-sky-600 dark:text-sky-400", bg: "bg-sky-500" },
                      { text: "text-blue-600 dark:text-blue-400", bg: "bg-blue-500" }
                    ];
                    const currentStyle = colorStyles[index % colorStyles.length];
                    
                    return (
                      <div key={region.name}>
                        <div className="flex items-end justify-between mb-2">
                          <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">{region.name}</span>
                          <span className={`text-sm font-bold ${currentStyle.text}`}>{percentage}%</span>
                        </div>
                        <div className="w-full overflow-hidden bg-gray-200 rounded-full h-1.5 dark:bg-gray-700">
                          <div className={`h-full rounded-full ${currentStyle.bg}`} style={{ width: `${percentage}%` }}></div>
                        </div>
                      </div>
                    );
                  }) : (
                    <div className="text-sm text-gray-500">Memuat data...</div>
                  )}
                </div>
              </motion.div>
            </div>
        </div>
      </section>

      {/* Ecosystem & Analytics Section */}
      <section className="px-6 py-24 bg-gray-50/50 dark:bg-gray-900/20">
        <div className="max-w-6xl mx-auto space-y-16">
          
          {/* Top Cards Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            
            {/* Chart Card */}
            <div className="lg:col-span-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-8 shadow-sm">
              <div className="flex justify-between items-center mb-8">
                <div className="flex items-center gap-2">
                  <BarChart3 className="text-emerald-500" size={20} />
                  <h3 className="font-bold text-gray-900 dark:text-white text-lg">Analisis Prediktif AI</h3>
                </div>
                <div className="flex p-1 bg-gray-100 rounded-lg dark:bg-gray-800">
                  <button 
                    onClick={() => setChartPeriod("harian")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${chartPeriod === "harian" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                    Harian
                  </button>
                  <button 
                    onClick={() => setChartPeriod("mingguan")}
                    className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${chartPeriod === "mingguan" ? "bg-white dark:bg-gray-700 shadow-sm text-gray-900 dark:text-white" : "text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white"}`}>
                    Mingguan
                  </button>
                </div>
              </div>
              
              {/* CSS Bar Chart */}
              <div className="flex items-end justify-between h-64 gap-2 mt-4 md:gap-6">
                {(chartPeriod === "harian" ? publicStats.chart_data_harian : publicStats.chart_data_mingguan).map((h, i) => {
                  const currentData = chartPeriod === "harian" ? publicStats.chart_data_harian : publicStats.chart_data_mingguan;
                  const maxVal = Math.max(...currentData, 1);
                  const percentage = (h / maxVal) * 100;
                  return (
                  <div key={`${chartPeriod}-${i}`} className="flex flex-col items-center flex-1 gap-4">
                    <div className="relative w-full h-48 overflow-hidden bg-gray-100 rounded-t-xl dark:bg-gray-800 group">
                      <motion.div 
                        initial={{ height: 0 }} 
                        animate={{ height: `${percentage}%` }} 
                        transition={{ duration: 1, type: "spring", stiffness: 50 }}
                        className={`absolute bottom-0 w-full rounded-t-xl transition-colors flex items-start justify-center pt-2 ${i === new Date().getDay() - 1 ? "bg-emerald-500" : "bg-emerald-500/40 dark:bg-emerald-500/30 group-hover:bg-emerald-500/60"}`} 
                      >
                        <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">
                          {h >= 1000 ? (h/1000).toFixed(1) + 'k' : h}
                        </span>
                      </motion.div>
                    </div>
                    <span className="text-xs font-medium text-gray-500 dark:text-gray-400">
                      {['Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu', 'Minggu'][i]}
                    </span>
                  </div>
                )})}
              </div>
            </div>

            {/* Right Column Cards */}
            <div className="space-y-6 flex flex-col">
              {/* Insight Card */}
              <div className="bg-white dark:bg-gray-900 border border-emerald-100 dark:border-emerald-500/20 rounded-3xl p-6 shadow-sm flex-1 flex flex-col relative overflow-hidden group hover:border-emerald-300 dark:hover:border-emerald-500/50 transition-colors">
                <div className="absolute -top-4 -right-4 p-4 opacity-[0.03] dark:opacity-[0.02] group-hover:scale-110 transition-transform duration-500">
                  <Brain size={120} />
                </div>
                <div className="flex items-center gap-2 mb-4 relative z-10">
                  <div className="w-8 h-8 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center">
                    <Sparkles size={16} className="text-emerald-500" />
                  </div>
                  <h3 className="font-bold text-gray-900 dark:text-white text-sm">Insight AI Hari Ini</h3>
                </div>
                <p className="flex-1 mb-6 text-sm italic leading-relaxed text-gray-600 relative z-10 dark:text-gray-400">
                  "{publicStats.insight_text}"
                </p>
                <button className="w-full py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-semibold text-sm hover:bg-emerald-100 dark:hover:bg-emerald-500/20 transition-colors relative z-10">
                  Optimasi Sekarang
                </button>
              </div>

              {/* Score Card */}
              <div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-3xl p-6 shadow-sm flex items-center justify-center flex-col relative">
                <h3 className="font-bold text-gray-900 dark:text-white text-sm w-full text-left mb-6">Sustainability Score</h3>
                <div className="relative mb-6 drop-shadow-sm w-32 h-32">
                  {/* Background Circle */}
                  <svg className="w-full h-full transform -rotate-90">
                    <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" className="text-gray-100 dark:text-gray-800" />
                    {/* Progress Circle */}
                    <motion.circle 
                      initial={{ strokeDasharray: "0 400" }} 
                      whileInView={{ strokeDasharray: `${(publicStats.sustainability_percentage / 100) * 350} 400` }} 
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: "easeOut" }}
                      cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="12" fill="transparent" strokeLinecap="round" 
                      className="text-emerald-500" 
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-extrabold text-gray-900 dark:text-white">{publicStats.sustainability_score}</span>
                    <span className="mt-1 text-[8px] font-bold tracking-widest text-gray-400 uppercase">Global Rank</span>
                  </div>
                </div>
                <p className="text-xs text-center text-gray-500 dark:text-gray-400">
                  Cakupan suplai energi bersih mencapai <span className="font-bold text-emerald-500">{publicStats.sustainability_percentage}%</span> dari total kebutuhan sistem.
                </p>
              </div>
            </div>
          </div>

          {/* Ecosystem Bottom Section */}
          <div className="pt-16 border-t border-gray-200 dark:border-gray-800 text-center">
            <motion.div initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white mb-4 tracking-tight">Ekosistem Sinergi Terintegrasi</h2>
              <p className="text-gray-600 dark:text-gray-400 mb-16 max-w-2xl mx-auto text-lg">Menghubungkan seluruh stakeholder energi dalam satu platform kolaborasi transparan.</p>
            </motion.div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {[
                { icon: <Users size={24} />, title: "UMKM & Koperasi", desc: "Penerima manfaat langsung distribusi energi bersih." },
                { icon: <Building2 size={24} />, title: "Lembaga Keuangan", desc: "Investor hijau untuk pendanaan infrastruktur energi." },
                { icon: <ShieldCheck size={24} />, title: "Pemerintah", desc: "Regulator dan pemantau kebijakan energi nasional." },
                { icon: <Globe size={24} />, title: "Global Partner", desc: "Kolaborasi riset dan teknologi skala internasional." }
              ].map((item, i) => (
                <motion.div key={i} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp} transition={{ delay: i * 0.1 }} className="flex flex-col items-center group">
                  <div className="w-16 h-16 rounded-full bg-gray-50 dark:bg-gray-800/50 border border-gray-100 dark:border-gray-800 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-6 shadow-sm group-hover:bg-emerald-50 dark:group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white text-sm mb-3 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">{item.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed max-w-[150px]">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>

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
