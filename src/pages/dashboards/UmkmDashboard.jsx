import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import {
  Building2, Zap, BrainCircuit, DollarSign, Leaf, TrendingUp,
  ShoppingBag, Handshake, ChevronRight, Package, AlertCircle
} from 'lucide-react';

export default function UmkmDashboard() {
  const { user } = useAuth();
  const [business, setBusiness] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bizRes, recRes, prodRes] = await Promise.allSettled([
          api.get('/businesses'),
          api.get('/recommendations'),
          api.get('/products'),
        ]);
        // Get business owned by this user
        if (bizRes.status === 'fulfilled') {
          const myBiz = bizRes.value.data.data?.find?.(b => b.user_id === user.id) || bizRes.value.data.data?.[0];
          setBusiness(myBiz);
        }
        if (recRes.status === 'fulfilled') setRecommendations(recRes.value.data.data?.slice?.(0, 3) || []);
        if (prodRes.status === 'fulfilled') setProducts(prodRes.value.data.data?.data?.slice?.(0, 4) || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user.id]);

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  const statusColor = {
    recommended: 'bg-blue-100 text-blue-700 border-blue-200',
    approved: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    implemented: 'bg-violet-100 text-violet-700 border-violet-200',
    draft: 'bg-slate-100 text-slate-600 border-slate-200',
  };

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div className="bg-gradient-to-r from-emerald-600 to-emerald-700 rounded-2xl p-6 text-white">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
            <Building2 className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-2xl font-bold" style={{fontFamily:'var(--font-heading)'}}>
              Halo, {user?.name} 👋
            </h1>
            <p className="text-emerald-100 mt-1">
              {business ? business.name : 'Selamat datang di dashboard UMKM Anda.'}
            </p>
          </div>
        </div>
      </div>

      {/* Status Rekomendasi Energi */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
            <BrainCircuit className="h-5 w-5 text-emerald-500" /> Status Rekomendasi Energi
          </h2>
          {recommendations.length > 0 ? (
            recommendations.map(rec => (
              <div key={rec.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColor[rec.status] || statusColor.draft}`}>
                        {rec.status?.toUpperCase()}
                      </span>
                      {rec.priority_score && (
                        <span className="text-xs text-slate-500">Skor: {rec.priority_score.total_score}/100</span>
                      )}
                    </div>
                    <p className="text-sm text-slate-700">{rec.recommendation_reason || 'Menunggu analisis AI...'}</p>
                    {rec.energy_source && (
                      <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                        <Zap className="h-3.5 w-3.5" /> Sumber: {rec.energy_source.name} ({rec.distance_km} km)
                      </p>
                    )}
                  </div>
                  <Zap className="h-8 w-8 text-amber-400 flex-shrink-0" />
                </div>
              </div>
            ))
          ) : (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 flex items-start gap-3">
              <AlertCircle className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-amber-800">Belum ada rekomendasi</p>
                <p className="text-sm text-amber-600 mt-1">Lengkapi data usaha dan kebutuhan energi agar AI dapat menganalisis prioritas distribusi untuk usaha Anda.</p>
              </div>
            </div>
          )}
          <Link to="/dashboard/recommendations" className="inline-flex items-center gap-1 text-sm text-emerald-600 font-medium hover:text-emerald-700">
            Lihat semua rekomendasi <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {/* Stat Cards */}
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <Zap className="h-5 w-5 text-amber-500 mb-2" />
            <p className="text-sm text-slate-500">Kebutuhan Energi</p>
            <p className="text-2xl font-bold text-slate-800">{business?.monthly_energy_need || 0} <span className="text-sm font-normal text-slate-400">kWh/bulan</span></p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <DollarSign className="h-5 w-5 text-emerald-500 mb-2" />
            <p className="text-sm text-slate-500">Biaya Energi Saat Ini</p>
            <p className="text-2xl font-bold text-slate-800">Rp {(business?.current_energy_cost || 0).toLocaleString('id-ID')}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
            <TrendingUp className="h-5 w-5 text-sky-500 mb-2" />
            <p className="text-sm text-slate-500">Kapasitas Produksi</p>
            <p className="text-2xl font-bold text-slate-800">{business?.production_capacity || '-'}</p>
          </div>
        </div>
      </div>

      {/* Produk Saya */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
            <ShoppingBag className="h-5 w-5 text-emerald-500" /> Produk Saya
          </h2>
          <Link to="/dashboard/marketplace" className="text-sm text-emerald-600 font-medium hover:text-emerald-700 flex items-center gap-1">
            Lihat semua <ChevronRight className="h-4 w-4" />
          </Link>
        </div>
        {products.length > 0 ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {products.map(p => (
              <div key={p.id} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                <div className="h-32 bg-slate-100 flex items-center justify-center">
                  {p.image ? (
                    <img src={`http://localhost:8000/storage/${p.image}`} alt={p.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="h-10 w-10 text-slate-300" />
                  )}
                </div>
                <div className="p-3">
                  <p className="font-medium text-sm text-slate-800 truncate">{p.name}</p>
                  <p className="text-emerald-600 font-semibold text-sm mt-1">Rp {Number(p.price).toLocaleString('id-ID')}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-100 p-8 text-center">
            <Package className="h-10 w-10 text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">Belum ada produk. Tambahkan produk ke marketplace untuk meningkatkan visibilitas usaha Anda.</p>
          </div>
        )}
      </div>
    </div>
  );
}
