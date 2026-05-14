import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import { Map as MapIcon, Building2, Zap, AlertTriangle } from 'lucide-react';
import api from '../services/api';

// Fix for default marker icons in React Leaflet
import L from 'leaflet';
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons for UMKM and Energy Sources
const umkmIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-blue-500 rounded-full w-8 h-8 flex items-center justify-center text-white border-2 border-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="2" width="16" height="20" rx="2" ry="2"></rect><path d="M9 22v-4h6v4"></path><path d="M8 6h.01"></path><path d="M16 6h.01"></path><path d="M12 6h.01"></path><path d="M12 10h.01"></path><path d="M12 14h.01"></path><path d="M16 10h.01"></path><path d="M16 14h.01"></path><path d="M8 10h.01"></path><path d="M8 14h.01"></path></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const energyIcon = L.divIcon({
  className: 'custom-icon',
  html: `<div class="bg-emerald-500 rounded-full w-8 h-8 flex items-center justify-center text-white border-2 border-white shadow-md"><svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg></div>`,
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function PriorityMap() {
  const [mapData, setMapData] = useState({ businesses: [], energy_sources: [], connections: [] });
  const [loading, setLoading] = useState(true);
  const [showUmkm, setShowUmkm] = useState(true);
  const [showEnergy, setShowEnergy] = useState(true);
  const [energyTypeFilter, setEnergyTypeFilter] = useState('all');

  // Default center (Indonesia)
  const defaultCenter = [-2.5489, 118.0149];
  const defaultZoom = 5;

  useEffect(() => {
    const fetchMapData = async () => {
      try {
        const response = await api.get('/dashboard/priority-map');
        setMapData(response.data.data);
      } catch (error) {
        console.error('Failed to fetch map data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMapData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  // Determine if we should center on specific coordinates based on data
  let center = defaultCenter;
  let zoom = defaultZoom;
  
  if (mapData.businesses.length > 0) {
    center = [mapData.businesses[0].latitude, mapData.businesses[0].longitude];
    zoom = 10;
  } else if (mapData.energy_sources.length > 0) {
    center = [mapData.energy_sources[0].latitude, mapData.energy_sources[0].longitude];
    zoom = 10;
  }

  // Generate lines for connections
  const polylines = mapData.connections.map(conn => {
    if (!conn.business || !conn.energy_source) return null;
    
    // Set color based on status
    let color = '#3b82f6'; // blue for recommended
    if (conn.status === 'approved') color = '#10b981'; // green
    if (conn.status === 'implemented') color = '#6366f1'; // indigo

    return {
      id: conn.id,
      positions: [
        [conn.business.latitude, conn.business.longitude],
        [conn.energy_source.latitude, conn.energy_source.longitude]
      ],
      color,
      status: conn.status,
      distance: conn.distance_km
    };
  }).filter(Boolean);

  const filteredSources = mapData.energy_sources.filter(s => energyTypeFilter === 'all' || s.type === energyTypeFilter);
  const energyTypes = [...new Set(mapData.energy_sources.map(s => s.type))];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <MapIcon className="h-7 w-7 text-emerald-500" />
          Peta Prioritas Distribusi Energi
        </h1>
        <p className="text-slate-500 mt-1">
          Visualisasi lokasi UMKM, sumber energi bersih, dan rekomendasi distribusi AI.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden h-[600px] z-0 relative">
          <MapContainer center={center} zoom={zoom} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Render Energy Sources */}
            {showEnergy && filteredSources.map(source => (
              <Marker 
                key={`source-${source.id}`} 
                position={[source.latitude, source.longitude]}
                icon={energyIcon}
              >
                <Popup>
                  <div className="p-1">
                    <h3 className="font-bold text-emerald-700 flex items-center gap-1">
                      <Zap size={16} /> {source.name}
                    </h3>
                    <p className="text-sm text-slate-600 mt-1 capitalize">Tipe: {source.type}</p>
                    <p className="text-sm text-slate-600">Lokasi: {source.city}</p>
                    <div className="mt-2 text-xs bg-slate-100 p-2 rounded">
                      <p>Kapasitas Total: <span className="font-semibold">{source.capacity_kwh} kWh</span></p>
                      <p>Tersedia: <span className="font-semibold text-emerald-600">{source.available_kwh} kWh</span></p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            {/* Render Businesses */}
            {showUmkm && mapData.businesses.map(business => {
              const score = business.latest_priority_score;
              const hasHighPriority = score && ['urgent', 'high'].includes(score.priority_level);
              
              return (
                <Marker 
                  key={`business-${business.id}`} 
                  position={[business.latitude, business.longitude]}
                  icon={umkmIcon}
                >
                  <Popup>
                    <div className="p-1">
                      <h3 className="font-bold text-blue-700 flex items-center gap-1">
                        <Building2 size={16} /> {business.name}
                      </h3>
                      <p className="text-sm text-slate-600 mt-1 capitalize">Sektor: {business.sector.replace('_', ' ')}</p>
                      <p className="text-sm text-slate-600">Kebutuhan: {business.monthly_energy_need} kWh</p>
                      
                      {score ? (
                        <div className={`mt-2 text-xs p-2 rounded border ${
                          score.priority_level === 'urgent' ? 'bg-red-50 border-red-200 text-red-700' :
                          score.priority_level === 'high' ? 'bg-orange-50 border-orange-200 text-orange-700' :
                          'bg-blue-50 border-blue-200 text-blue-700'
                        }`}>
                          <div className="flex justify-between items-center font-semibold mb-1">
                            <span>Prioritas AI:</span>
                            <span className="uppercase">{score.priority_level}</span>
                          </div>
                          <p>Skor: {score.total_score}/100</p>
                        </div>
                      ) : (
                        <div className="mt-2 text-xs bg-slate-50 p-2 rounded border border-slate-200 text-slate-500 italic">
                          Belum ada skor AI
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })}

            {/* Render Connection Lines */}
            {polylines.map(line => (
              <Polyline 
                key={`line-${line.id}`}
                positions={line.positions}
                pathOptions={{ 
                  color: line.color, 
                  weight: 3, 
                  opacity: 0.7,
                  dashArray: line.status === 'recommended' ? '5, 10' : null
                }}
              >
                <Popup>
                  <div className="text-sm">
                    <p className="font-semibold capitalize">Status: {line.status}</p>
                    <p>Jarak: {line.distance} km</p>
                  </div>
                </Popup>
              </Polyline>
            ))}
          </MapContainer>
        </div>

        <div className="space-y-4">
          {/* Filter Panel */}
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Filter</h3>
            <div className="space-y-3">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showUmkm} onChange={e => setShowUmkm(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-slate-600">Tampilkan UMKM</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={showEnergy} onChange={e => setShowEnergy(e.target.checked)} className="rounded border-slate-300 text-emerald-600 focus:ring-emerald-500" />
                <span className="text-sm text-slate-600">Tampilkan Sumber Energi</span>
              </label>
              <div>
                <label className="block text-xs font-medium text-slate-500 mb-1">Jenis Energi</label>
                <select value={energyTypeFilter} onChange={e => setEnergyTypeFilter(e.target.value)} className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                  <option value="all">Semua Jenis</option>
                  {energyTypes.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <h3 className="font-semibold text-slate-800 mb-3 border-b border-slate-100 pb-2">Legenda</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-3">
                <div className="bg-blue-500 rounded-full w-6 h-6 flex items-center justify-center text-white"><Building2 size={12} /></div>
                <span className="text-slate-600">UMKM ({mapData.businesses.length})</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="bg-emerald-500 rounded-full w-6 h-6 flex items-center justify-center text-white"><Zap size={12} /></div>
                <span className="text-slate-600">Sumber Energi ({filteredSources.length})</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 border-b-2 border-dashed border-blue-500"></div>
                <span className="text-slate-600">Rekomendasi AI</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 border-b-2 border-emerald-500"></div>
                <span className="text-slate-600">Disetujui</span>
              </li>
              <li className="flex items-center gap-3">
                <div className="w-6 border-b-2 border-indigo-500"></div>
                <span className="text-slate-600">Terimplementasi</span>
              </li>
            </ul>
          </div>

          <div className="bg-amber-50 rounded-xl border border-amber-200 p-5">
            <div className="flex items-start gap-3 text-amber-700">
              <AlertTriangle className="h-5 w-5 flex-shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold mb-1">Catatan Penting</p>
                <p className="text-amber-600/90">Peta ini menampilkan lokasi nyata UMKM dan provider energi bersih berdasarkan titik koordinat sistem EnergEco GlobalChain.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
