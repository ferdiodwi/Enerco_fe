import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { Handshake, Send, ChevronDown, ChevronUp, Building2, Zap, Clock, CheckCircle, XCircle, Loader2 } from 'lucide-react';

const typeLabels = { funding: 'Pendanaan', energy_support: 'Dukungan Energi', distribution: 'Distribusi', product_collaboration: 'Kolaborasi Produk', government_program: 'Program Pemerintah' };
const statusIcons = { pending: Clock, accepted: CheckCircle, rejected: XCircle, completed: CheckCircle };
const statusColors = { pending: 'bg-amber-50 text-amber-700 border-amber-200', accepted: 'bg-emerald-50 text-emerald-700 border-emerald-200', rejected: 'bg-red-50 text-red-700 border-red-200', completed: 'bg-violet-50 text-violet-700 border-violet-200' };

export default function Partnership() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [businesses, setBusinesses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ receiver_id: '', business_id: '', type: 'funding', message: '' });

  useEffect(() => {
    Promise.allSettled([
      api.get('/partnership-requests'),
      api.get('/businesses'),
    ]).then(([prRes, bizRes]) => {
      if (prRes.status === 'fulfilled') setRequests(prRes.value.data.data || []);
      if (bizRes.status === 'fulfilled') setBusinesses(bizRes.value.data.data || []);
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await api.post('/partnership-requests', form);
      setRequests([res.data.data, ...requests]);
      setShowForm(false);
      setForm({ receiver_id: '', business_id: '', type: 'funding', message: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Gagal mengirim pengajuan.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleStatus = async (id, status) => {
    try {
      await api.put(`/partnership-requests/${id}/status`, { status });
      setRequests(requests.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      alert('Gagal mengubah status.');
    }
  };

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
            <Handshake className="h-7 w-7 text-emerald-500" /> Kemitraan
          </h1>
          <p className="text-slate-500 mt-1">Kelola pengajuan kerja sama antar stakeholder.</p>
        </div>
        <button onClick={() => setShowForm(!showForm)}
          className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-5 py-2.5 rounded-xl transition-colors text-sm">
          <Send className="h-4 w-4" /> Ajukan Kemitraan
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-slate-100 shadow-sm p-6 space-y-4">
          <h3 className="font-semibold text-slate-800">Form Pengajuan Kemitraan</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">UMKM Tujuan</label>
              <select value={form.business_id} onChange={e => setForm({...form, business_id: e.target.value})} required
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                <option value="">Pilih UMKM...</option>
                {businesses.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kemitraan</label>
              <select value={form.type} onChange={e => setForm({...form, type: e.target.value})}
                className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500">
                {Object.entries(typeLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Pesan</label>
            <textarea value={form.message} onChange={e => setForm({...form, message: e.target.value})} rows={3} required
              className="w-full border border-slate-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Jelaskan tujuan kemitraan Anda..." />
          </div>
          <div className="flex gap-3">
            <button type="submit" disabled={submitting}
              className="flex items-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-6 py-2 rounded-lg transition-colors disabled:opacity-70 text-sm">
              {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />} Kirim
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="px-6 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors">Batal</button>
          </div>
        </form>
      )}

      {requests.length > 0 ? (
        <div className="space-y-3">
          {requests.map(req => {
            const StatusIcon = statusIcons[req.status] || Clock;
            return (
              <div key={req.id} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-lg flex items-center justify-center flex-shrink-0">
                      <Handshake className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-slate-800">{typeLabels[req.type] || req.type}</p>
                      <p className="text-sm text-slate-500 mt-1">{req.message}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400">
                        {req.business && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {req.business.name}</span>}
                        <span>{new Date(req.created_at).toLocaleDateString('id-ID')}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${statusColors[req.status] || statusColors.pending}`}>
                      {req.status?.toUpperCase()}
                    </span>
                    {req.status === 'pending' && (req.receiver_id === user.id) && (
                      <div className="flex gap-1 ml-2">
                        <button onClick={() => handleStatus(req.id, 'accepted')} className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100"><CheckCircle className="h-4 w-4" /></button>
                        <button onClick={() => handleStatus(req.id, 'rejected')} className="p-1.5 bg-red-50 text-red-600 rounded-lg hover:bg-red-100"><XCircle className="h-4 w-4" /></button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-slate-100 p-12 text-center">
          <Handshake className="h-12 w-12 text-slate-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-800">Belum ada pengajuan kemitraan</h3>
          <p className="text-slate-500 mt-2">Ajukan kemitraan dengan UMKM, penyedia energi, atau investor.</p>
        </div>
      )}
    </div>
  );
}
