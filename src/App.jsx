import { Routes, Route, Navigate } from 'react-router-dom';
import AuthLayout from './layouts/AuthLayout';
import DashboardLayout from './layouts/DashboardLayout';
import Login from './pages/Login';
import { useAuth } from './context/AuthContext';

// Placeholder components for pages we'll build next
const DashboardHome = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Dashboard</h1><p className="mt-2 text-slate-600">Selamat datang di EnergEco GlobalChain Dashboard.</p></div>;
const PriorityMap = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Peta Prioritas</h1><p className="mt-2 text-slate-600">Visualisasi Peta UMKM dan Sumber Energi.</p></div>;
const EnergySources = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Sumber Energi</h1></div>;
const Businesses = () => <div className="p-4 bg-white rounded-xl shadow-sm border border-slate-100"><h1 className="text-2xl font-bold text-slate-800">Data UMKM</h1></div>;

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public / Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        {/* Redirect root to login or dashboard based on auth */}
        <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} replace />} />
      </Route>

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="map" element={<PriorityMap />} />
        <Route path="energy" element={<EnergySources />} />
        <Route path="businesses" element={<Businesses />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
