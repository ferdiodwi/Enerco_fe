import { Routes, Route, Navigate } from 'react-router-dom';
import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import DashboardHome from './pages/DashboardHome';
import PriorityMap from './pages/PriorityMap';
import Marketplace from './pages/Marketplace';
import AIRecommendation from './pages/AIRecommendation';
import ImpactReport from './pages/ImpactReport';
import Partnership from './pages/Partnership';
import ProfileSettings from './pages/ProfileSettings';
import UserManagement from './pages/UserManagement';
import { useAuth } from './context/AuthContext';

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={user ? <Navigate to="/dashboard" replace /> : <LandingPage />} />
      <Route path="/login" element={user ? <Navigate to="/dashboard" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/dashboard" replace /> : <Register />} />

      {/* Protected Dashboard Routes */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<DashboardHome />} />
        <Route path="map" element={<PriorityMap />} />
        <Route path="marketplace" element={<Marketplace />} />
        <Route path="recommendations" element={<AIRecommendation />} />
        <Route path="impact" element={<ImpactReport />} />
        <Route path="partnerships" element={<Partnership />} />
        <Route path="profile" element={<ProfileSettings />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      {/* Catch all */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
