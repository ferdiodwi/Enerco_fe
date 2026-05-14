import { Outlet, NavLink, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  LayoutDashboard, Map, ShoppingBag, BrainCircuit, BarChart3,
  Building2, Zap, Handshake, LogOut, User, Users, Settings
} from 'lucide-react';

const navByRole = {
  admin: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/users', icon: Users, label: 'Kelola Pengguna' },
    { to: '/dashboard/map', icon: Map, label: 'Peta Energi' },
    { to: '/dashboard/recommendations', icon: BrainCircuit, label: 'Rekomendasi AI' },
    { to: '/dashboard/impact', icon: BarChart3, label: 'Laporan Dampak' },
    { to: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { to: '/dashboard/partnerships', icon: Handshake, label: 'Kemitraan' },
  ],
  government: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/map', icon: Map, label: 'Peta Prioritas' },
    { to: '/dashboard/recommendations', icon: BrainCircuit, label: 'Rekomendasi AI' },
    { to: '/dashboard/impact', icon: BarChart3, label: 'Laporan Dampak' },
    { to: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace' },
  ],
  business_owner: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/map', icon: Map, label: 'Peta Energi' },
    { to: '/dashboard/recommendations', icon: BrainCircuit, label: 'Rekomendasi AI' },
    { to: '/dashboard/marketplace', icon: ShoppingBag, label: 'Produk Saya' },
    { to: '/dashboard/partnerships', icon: Handshake, label: 'Kemitraan' },
  ],
  energy_provider: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/map', icon: Map, label: 'Peta Energi' },
    { to: '/dashboard/recommendations', icon: BrainCircuit, label: 'Rekomendasi' },
    { to: '/dashboard/partnerships', icon: Handshake, label: 'Permintaan' },
  ],
  investor: [
    { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/dashboard/map', icon: Map, label: 'Peta UMKM' },
    { to: '/dashboard/marketplace', icon: ShoppingBag, label: 'Marketplace' },
    { to: '/dashboard/partnerships', icon: Handshake, label: 'Kemitraan' },
  ],
};

const roleLabels = {
  admin: 'Administrator',
  government: 'Pemerintah Daerah',
  business_owner: 'UMKM',
  energy_provider: 'Penyedia Energi',
  investor: 'Investor / Mitra',
};

export default function DashboardLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) return <Navigate to="/login" replace />;

  const navItems = navByRole[user.role] || navByRole.business_owner;

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-slate-100 flex flex-col fixed h-full z-40">
        <div className="p-5 border-b border-slate-100">
          <NavLink to="/" className="flex items-center gap-2 text-lg font-bold text-emerald-600" style={{fontFamily:'var(--font-heading)'}}>
            <Zap className="h-6 w-6" /> EnergEco
          </NavLink>
        </div>

        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          {navItems.map(item => (
            <NavLink key={item.to} to={item.to} end={item.end}
              className={({isActive}) => `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${isActive ? 'bg-emerald-50 text-emerald-700' : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'}`}>
              <item.icon className="h-5 w-5" />
              {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-100">
          <NavLink to="/dashboard/profile" className="flex items-center gap-3 mb-3 hover:bg-slate-50 rounded-lg p-1.5 -m-1.5 transition-colors">
            <div className="w-9 h-9 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center font-bold text-sm">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-900 truncate">{user.name}</p>
              <p className="text-xs text-slate-400">{roleLabels[user.role]}</p>
            </div>
          </NavLink>
          <button onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors">
            <LogOut className="h-4 w-4" /> Keluar
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
