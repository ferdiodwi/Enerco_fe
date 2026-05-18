import { useEffect, useState } from "react";
import { useTheme } from "@/context/ThemeContext";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Building2, Zap, AlertTriangle, CheckCircle2, Navigation, Filter, Sun, Wind, Droplet, Flame, Check } from "lucide-react";
import L from "leaflet";
import api from "@/services/api";

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons (Sci-Fi Glowing)
const umkmIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0B1110" stroke="#10B981" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 5px #10B981);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3" fill="#10B981"></circle></svg>`),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
});

const energyIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0B1110" stroke="#F59E0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="filter: drop-shadow(0px 0px 5px #F59E0B);"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="#F59E0B"></polygon></svg>`),
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
});

interface MarkerData {
  id: number;
  type: "business" | "energy_source";
  name: string;
  latitude: number;
  longitude: number;
  sector?: string;
  energy_need?: number;
  priority_score?: number;
  priority_category?: string;
  energy_type?: string;
  total_capacity?: number;
  available_capacity?: number;
}

export default function PriorityMap() {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [center] = useState<[number, number]>([-2.5489, 118.0149]); // Default Indonesia

  // Filter States
  const [selectedEnergies, setSelectedEnergies] = useState<string[]>([]);
  const [selectedSectors, setSelectedSectors] = useState<string[]>([]);

  useEffect(() => {
    setLoading(true);
    api.get("/map/markers")
      .then((r) => {
        const d = r.data.data;
        setMarkers([...d.businesses, ...d.energy_sources]);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Extract unique filter options dynamically from backend data
  const availableEnergyTypes = Array.from(new Set(markers.filter(m => m.type === "energy_source" && m.energy_type).map(m => m.energy_type as string)));
  const availableSectors = Array.from(new Set(markers.filter(m => m.type === "business" && m.sector).map(m => m.sector as string)));

  const toggleEnergy = (type: string) => {
    setSelectedEnergies(prev => prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]);
  };

  const toggleSector = (sector: string) => {
    setSelectedSectors(prev => prev.includes(sector) ? prev.filter(s => s !== sector) : [...prev, sector]);
  };

  const filteredMarkers = markers.filter(m => {
    if (m.type === "energy_source") {
      if (selectedEnergies.length > 0 && m.energy_type) {
        return selectedEnergies.includes(m.energy_type);
      }
      return true;
    }
    if (m.type === "business") {
      if (selectedSectors.length > 0 && m.sector) {
        return selectedSectors.includes(m.sector);
      }
      return true;
    }
    return false;
  });

  // Icon mapping helper
  const getEnergyIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes("surya")) return <Sun size={16} />;
    if (t.includes("angin")) return <Wind size={16} />;
    if (t.includes("hidro") || t.includes("air")) return <Droplet size={16} />;
    if (t.includes("biomassa") || t.includes("bio")) return <Flame size={16} />;
    return <Zap size={16} />;
  };

  return (
    <div className="h-[calc(100vh-100px)] flex flex-col lg:flex-row gap-6 relative">
      
      {/* FILTER POTENSI PANEL */}
      <div className="w-full lg:w-80 shrink-0 bg-glass border border-gray-200 dark:border-gray-800 rounded-xl p-6 flex flex-col gap-6 overflow-y-auto custom-scrollbar glow-border z-10">
        
        {/* Header */}
        <div className="flex items-center gap-3 text-brand-500 dark:text-brand-400 border-b border-gray-200 dark:border-gray-800 pb-5">
          <Filter size={20} /> 
          <h2 className="font-bold tracking-widest uppercase text-sm">Filter Potensi</h2>
        </div>
        
        {/* WILAYAH GEOGRAFIS */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-brand-500 dark:text-brand-400 tracking-widest uppercase">Wilayah Geografis</label>
          <div className="relative">
            <select className="w-full bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg p-3 text-sm text-gray-900 dark:text-gray-300 focus:outline-none focus:border-brand-500 appearance-none">
              <option>Seluruh Indonesia</option>
              <option>Jawa - Bali</option>
              <option>Sumatera</option>
            </select>
            <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M1 1.5L6 6.5L11 1.5" stroke="#98A2B3" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
          </div>
        </div>

        {/* JENIS ENERGI TERBARUKAN */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-brand-500 dark:text-brand-400 tracking-widest uppercase">Jenis Energi Terbarukan</label>
          {loading ? (
             <div className="h-24 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-500" /></div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              {availableEnergyTypes.length === 0 && <span className="text-xs text-gray-500 col-span-2">Tidak ada data</span>}
              {availableEnergyTypes.map(type => {
                const isActive = selectedEnergies.includes(type);
                return (
                  <button 
                    key={type}
                    onClick={() => toggleEnergy(type)}
                    className={`flex items-center gap-2 p-2.5 rounded-lg border text-sm font-semibold transition-all ${isActive ? "bg-brand-500/10 border-brand-500 text-brand-500 dark:text-brand-400 glow-border" : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-800 text-gray-600 dark:text-gray-500 hover:text-gray-900 dark:hover:text-gray-300"}`}
                  >
                    {getEnergyIcon(type)} {type}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* PENERIMA MANFAAT */}
        <div className="space-y-3">
          <label className="text-[10px] font-bold text-brand-500 dark:text-brand-400 tracking-widest uppercase">Penerima Manfaat (UMKM)</label>
          {loading ? (
             <div className="h-24 flex items-center justify-center border border-gray-200 dark:border-gray-800 rounded-lg"><div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-brand-500" /></div>
          ) : (
            <div className="space-y-3">
              {availableSectors.length === 0 && <span className="text-xs text-gray-500">Tidak ada data</span>}
              {availableSectors.map((sector) => {
                const isActive = selectedSectors.includes(sector);
                return (
                  <label key={sector} className="flex items-center gap-3 cursor-pointer group">
                    <input type="checkbox" className="hidden" checked={isActive} onChange={() => toggleSector(sector)} />
                    <div className={`w-5 h-5 rounded flex items-center justify-center border transition-all shrink-0 ${isActive ? "bg-brand-500 border-brand-500 glow-border" : "bg-gray-50 dark:bg-gray-900 border-gray-200 dark:border-gray-700 group-hover:border-gray-400 dark:group-hover:border-gray-500"}`}>
                      {isActive && <Check size={14} className="text-white dark:text-gray-950 font-bold" />}
                    </div>
                    <span className={`text-sm font-medium capitalize ${isActive ? "text-gray-900 dark:text-gray-200" : "text-gray-600 dark:text-gray-500"}`}>{sector}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* PROYEKSI DATA */}
        <div className="space-y-3 mt-4">
          <label className="text-[10px] font-bold text-brand-500 dark:text-brand-400 tracking-widest uppercase">Proyeksi Data</label>
          <div className="relative pt-4 pb-2">
            <div className="h-1 bg-gray-200 dark:bg-gray-800 rounded-full w-full"></div>
            <div className="absolute h-1 bg-brand-500 rounded-full w-full top-4 left-0 glow-border"></div>
            <div className="absolute w-3 h-3 bg-white rounded-full top-3 left-0 shadow-[0_0_10px_#10B981]"></div>
            <div className="absolute w-3 h-3 bg-white rounded-full top-3 right-0 shadow-[0_0_10px_#10B981]"></div>
            <div className="flex justify-between items-center mt-3 text-xs font-bold text-gray-500">
              <span>2024</span>
              <span>2035</span>
            </div>
          </div>
        </div>

      </div>

      {/* MAP CONTAINER */}
      <div className="flex-1 flex flex-col">
        {/* Simple Header */}
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white glow-text">Peta Potensi Energi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1 text-sm">Visualisasi geografis potensi energi terbarukan dan kluster UMKM</p>
        </div>

        <div className="flex-1 bg-gray-100 dark:bg-gray-950 rounded-xl overflow-hidden relative border border-gray-200 dark:border-gray-800 shadow-[0_0_20px_rgba(16,185,129,0.1)]">

        {loading && (
          <div className="absolute inset-0 z-50 bg-white/50 dark:bg-gray-950/50 backdrop-blur-sm flex items-center justify-center">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-brand-500" />
          </div>
        )}
        
        <MapContainer center={center} zoom={5} className="w-full h-full z-0" zoomControl={false}>
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
          
          {filteredMarkers.map((marker) => (
            <Marker 
              key={`${marker.type}-${marker.id}`}
              position={[Number(marker.latitude), Number(marker.longitude)]}
              icon={marker.type === "business" ? umkmIcon : energyIcon}
            >
              <Popup className="rounded-xl overflow-hidden sci-fi-popup">
                <div className="p-2 min-w-[200px] bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200">
                  {marker.type === "business" ? (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-brand-500/10 border border-brand-500/30 flex items-center justify-center text-brand-500 dark:text-brand-400 glow-border"><Building2 size={18} /></div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight m-0 glow-text">{marker.name}</h3>
                          <span className="text-xs text-brand-500 dark:text-brand-400 capitalize">{marker.sector}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                          <span className="text-gray-500">Kebutuhan Energi</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-300">{Number(marker.energy_need).toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                          <span className="text-gray-500">Priority Score</span>
                          <span className="font-semibold text-brand-500 dark:text-brand-400 glow-text">{marker.priority_score || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className={`capitalize font-bold tracking-wider text-xs ${marker.priority_category === "Sangat Prioritas" ? "text-red-500 dark:text-red-400" : marker.priority_category === "Prioritas" ? "text-orange-500 dark:text-orange-400" : "text-gray-500 dark:text-gray-400"}`}>
                            {marker.priority_category || "-"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-full bg-orange-500/10 border border-orange-500/30 flex items-center justify-center text-orange-500 dark:text-orange-400"><Zap size={18} /></div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white text-base leading-tight m-0">{marker.name}</h3>
                          <span className="text-xs text-orange-500 dark:text-orange-400 capitalize">{marker.energy_type}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                          <span className="text-gray-500">Kapasitas Total</span>
                          <span className="font-semibold text-gray-800 dark:text-gray-300">{Number(marker.total_capacity).toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between border-b border-gray-100 dark:border-gray-800 pb-1">
                          <span className="text-gray-500">Kapasitas Tersedia</span>
                          <span className="font-bold text-brand-500 dark:text-brand-400 glow-text">{Number(marker.available_capacity).toLocaleString()} kWh</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-800">
                    <a href={`https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 w-full py-2 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-300 text-xs font-bold rounded-lg transition-colors tracking-wider border border-gray-200 dark:border-gray-700">
                      <Navigation size={14} className="text-brand-500 dark:text-brand-400" /> OPEN IN MAPS
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-10 bg-glass p-4 rounded-xl shadow-2xl glow-border">
          <h4 className="font-bold text-gray-800 dark:text-gray-300 text-xs tracking-wider uppercase mb-3">Legenda Sistem</h4>
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-brand-500 dark:bg-brand-400 shadow-[0_0_8px_#10B981]"></div>
              <span className="text-gray-600 dark:text-gray-400 font-bold text-xs tracking-wider uppercase">Lokasi UMKM Target</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-orange-400 shadow-[0_0_8px_#FB923C]"></div>
              <span className="text-gray-400 font-bold text-xs tracking-wider uppercase">Sumber Energi Aktif</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}
