import { useState, useEffect } from 'react';
import api from '../services/api';
import { Users, Search, Shield, Building2, Zap, TrendingUp, ChevronDown } from 'lucide-react';

const roleLabels = { admin: 'Admin', government: 'Pemerintah', business_owner: 'UMKM', energy_provider: 'Penyedia Energi', investor: 'Investor' };
const roleColors = { admin: 'bg-red-100 text-red-700', government: 'bg-sky-100 text-sky-700', business_owner: 'bg-emerald-100 text-emerald-700', energy_provider: 'bg-amber-100 text-amber-700', investor: 'bg-violet-100 text-violet-700' };
const statusColors = { active: 'bg-emerald-100 text-emerald-700', inactive: 'bg-slate-100 text-slate-600', suspended: 'bg-red-100 text-red-700' };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      // Try fetching users list — may need a dedicated endpoint
      const res = await api.get('/user');
      // If /user returns single user, fetch businesses & energy sources for user list
      if (res.data.data && !Array.isArray(res.data.data)) {
        // Fallback: gather users from businesses + known accounts
        const [bizRes, srcRes] = await Promise.allSettled([
          api.get('/businesses'),
          api.get('/energy-sources'),
        ]);
        const bizUsers = (bizRes.status === 'fulfilled' ? bizRes.value.data.data : []).map(b => ({
          id: b.user_id, name: b.user?.name || b.name, email: b.user?.email || '-',
          role: 'business_owner', status: b.status || 'active', business: b.name, city: b.city,
        }));
        const srcUsers = (srcRes.status === 'fulfilled' ? srcRes.value.data.data : []).map(s => ({
          id: `src-${s.id}`, name: s.provider?.name || s.name, email: s.provider?.email || '-',
          role: 'energy_provider', status: s.status || 'active', source: s.name, city: s.city,
        }));
        setUsers([
          { id: 0, name: res.data.data.name, email: res.data.data.email, role: res.data.data.role, status: 'active' },
          ...bizUsers,
          ...srcUsers,
        ]);
      } else {
        setUsers(Array.isArray(res.data.data) ? res.data.data : []);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter(u => {
    const matchSearch = !search || u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase());
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  if (loading) return <div className="flex items-center justify-center h-64"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div></div>;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2" style={{fontFamily:'var(--font-heading)'}}>
          <Users className="h-7 w-7 text-emerald-500" /> Kelola Pengguna
        </h1>
        <p className="text-slate-500 mt-1">Daftar semua pengguna yang terdaftar di sistem.</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-slate-400" />
            <input type="text" placeholder="Cari nama atau email..." value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500" />
          </div>
          <select value={roleFilter} onChange={e => setRoleFilter(e.target.value)}
            className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 min-w-[160px]">
            <option value="all">Semua Role</option>
            {Object.entries(roleLabels).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
          </select>
        </div>
        <p className="text-xs text-slate-400 mt-2">{filtered.length} pengguna ditampilkan</p>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Nama</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Email</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Role</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Status</th>
                <th className="text-left py-3 px-4 text-slate-500 font-medium">Detail</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(u => (
                <tr key={u.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-xs">
                        {u.name?.charAt(0).toUpperCase()}
                      </div>
                      <span className="font-medium text-slate-800">{u.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-slate-600">{u.email}</td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${roleColors[u.role] || roleColors.business_owner}`}>
                      {roleLabels[u.role] || u.role}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${statusColors[u.status] || statusColors.active}`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-xs text-slate-400">
                    {u.business && <span>Usaha: {u.business}</span>}
                    {u.source && <span>Sumber: {u.source}</span>}
                    {u.city && <span className="ml-1">• {u.city}</span>}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="py-8 text-center text-slate-400">Tidak ada pengguna ditemukan.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
