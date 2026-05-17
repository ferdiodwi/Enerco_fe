import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Building2, Zap, AlertTriangle, CheckCircle2, Navigation } from "lucide-react";
import L from "leaflet";
import api from "@/services/api";

// Fix Leaflet default icon paths
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom Icons
const umkmIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#10B981" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`),
  iconSize: [32, 32],
  iconAnchor: [16, 32],
  popupAnchor: [0, -32],
});

const energyIcon = new L.Icon({
  iconUrl: "data:image/svg+xml;base64," + btoa(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#F59E0B" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`),
  iconSize: [36, 36],
  iconAnchor: [18, 36],
  popupAnchor: [0, -36],
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
  const [markers, setMarkers] = useState<MarkerData[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, business, energy
  const [center] = useState<[number, number]>([-2.5489, 118.0149]); // Default Indonesia

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

  const filteredMarkers = markers.filter(m => filter === "all" || m.type === filter);

  return (
    <div className="space-y-4 h-[calc(100vh-100px)] flex flex-col">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Priority Map</h1>
          <p className="text-gray-500 mt-1 dark:text-gray-400">Peta interaktif persebaran UMKM dan sumber energi bersih.</p>
        </div>

        <div className="bg-white p-1 rounded-lg border border-gray-200 shadow-sm flex text-sm dark:bg-gray-800 dark:border-gray-700">
          <button onClick={() => setFilter("all")} className={`px-4 py-2 rounded-md font-medium transition-colors ${filter === "all" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"}`}>Semua</button>
          <button onClick={() => setFilter("business")} className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 ${filter === "business" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"}`}><Building2 size={16} /> UMKM</button>
          <button onClick={() => setFilter("energy_source")} className={`px-4 py-2 rounded-md font-medium transition-colors flex items-center gap-1.5 ${filter === "energy_source" ? "bg-emerald-500 text-white" : "text-gray-600 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-700"}`}><Zap size={16} /> Sumber Energi</button>
        </div>
      </div>

      <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden relative dark:border-gray-800">
        {loading && (
          <div className="absolute inset-0 z-50 bg-white/50 backdrop-blur-sm flex items-center justify-center dark:bg-gray-900/50">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-emerald-500" />
          </div>
        )}
        
        <MapContainer center={center} zoom={5} className="w-full h-full z-0" zoomControl={false}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          
          {filteredMarkers.map((marker) => (
            <Marker 
              key={`${marker.type}-${marker.id}`}
              position={[marker.latitude, marker.longitude]}
              icon={marker.type === "business" ? umkmIcon : energyIcon}
            >
              <Popup className="rounded-xl overflow-hidden">
                <div className="p-1 min-w-[200px]">
                  {marker.type === "business" ? (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600"><Building2 size={16} /></div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight m-0">{marker.name}</h3>
                          <span className="text-xs text-gray-500 capitalize">{marker.sector}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-500">Kebutuhan Energi</span>
                          <span className="font-semibold">{Number(marker.energy_need).toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-500">Priority Score</span>
                          <span className="font-semibold text-emerald-600">{marker.priority_score || "N/A"}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Status</span>
                          <span className={`capitalize font-semibold ${marker.priority_category === "Sangat Prioritas" ? "text-red-600" : marker.priority_category === "Prioritas" ? "text-orange-500" : "text-gray-700"}`}>
                            {marker.priority_category || "-"}
                          </span>
                        </div>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-600"><Zap size={16} /></div>
                        <div>
                          <h3 className="font-bold text-gray-900 leading-tight m-0">{marker.name}</h3>
                          <span className="text-xs text-gray-500 capitalize">{marker.energy_type}</span>
                        </div>
                      </div>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-500">Kapasitas Total</span>
                          <span className="font-semibold">{Number(marker.total_capacity).toLocaleString()} kWh</span>
                        </div>
                        <div className="flex justify-between border-b pb-1">
                          <span className="text-gray-500">Kapasitas Tersedia</span>
                          <span className="font-semibold text-emerald-600">{Number(marker.available_capacity).toLocaleString()} kWh</span>
                        </div>
                      </div>
                    </>
                  )}
                  
                  <div className="mt-3 pt-3 border-t">
                    <a href={`https://www.google.com/maps?q=${marker.latitude},${marker.longitude}`} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 text-xs font-semibold rounded-lg transition-colors">
                      <Navigation size={14} /> Buka di Google Maps
                    </a>
                  </div>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
        
        {/* Legend */}
        <div className="absolute bottom-6 right-6 z-10 bg-white/90 backdrop-blur p-4 rounded-xl shadow-lg border border-gray-200 text-sm dark:bg-gray-900/90 dark:border-gray-700">
          <h4 className="font-bold text-gray-800 mb-3 dark:text-white">Legenda</h4>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-emerald-500 shadow-sm border border-white"></div>
              <span className="text-gray-600 font-medium dark:text-gray-300">Lokasi UMKM</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-4 h-4 rounded-full bg-amber-500 shadow-sm border border-white"></div>
              <span className="text-gray-600 font-medium dark:text-gray-300">Sumber Energi</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
