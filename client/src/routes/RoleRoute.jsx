import { Navigate, Outlet } from 'react-router-dom';
import { dashboards } from '../utils/constants';
import { useAuth } from '../context/AuthContext';

export const RoleRoute = ({ allowed }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return allowed.includes(user.role) ? <Outlet /> : <Navigate to={dashboards[user.role] || '/login'} replace />;
};
