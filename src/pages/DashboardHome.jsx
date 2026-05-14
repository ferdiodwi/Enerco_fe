import { useAuth } from '../context/AuthContext';
import AdminDashboard from './dashboards/AdminDashboard';
import UmkmDashboard from './dashboards/UmkmDashboard';
import GovernmentDashboard from './dashboards/GovernmentDashboard';
import ProviderDashboard from './dashboards/ProviderDashboard';
import InvestorDashboard from './dashboards/InvestorDashboard';
import GeneralDashboard from './dashboards/GeneralDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  switch (user?.role) {
    case 'admin':
      return <AdminDashboard />;
    case 'business_owner':
      return <UmkmDashboard />;
    case 'government':
      return <GovernmentDashboard />;
    case 'energy_provider':
      return <ProviderDashboard />;
    case 'investor':
      return <InvestorDashboard />;
    default:
      return <GeneralDashboard />;
  }
}
