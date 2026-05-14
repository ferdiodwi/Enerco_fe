import { useAuth } from '../context/AuthContext';
import UmkmDashboard from './dashboards/UmkmDashboard';
import GovernmentDashboard from './dashboards/GovernmentDashboard';
import ProviderDashboard from './dashboards/ProviderDashboard';
import InvestorDashboard from './dashboards/InvestorDashboard';
import GeneralDashboard from './dashboards/GeneralDashboard';

export default function DashboardHome() {
  const { user } = useAuth();

  switch (user?.role) {
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
