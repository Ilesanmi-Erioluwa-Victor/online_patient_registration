import { Navigate, Route, Routes } from 'react-router-dom';
import Login from './pages/auth/Login';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import Dashboard from './pages/shared/Dashboard';
import PatientList from './pages/shared/PatientList';
import PatientProfile from './pages/shared/PatientProfile';
import Appointments from './pages/shared/Appointments';
import Profile from './pages/shared/Profile';
import RegisterPatient from './pages/receptionist/RegisterPatient';
import ConsultationForm from './pages/doctor/ConsultationForm';
import UserManagement from './pages/admin/UserManagement';
import Reports from './pages/admin/Reports';
import AuditLogs from './pages/admin/AuditLogs';
import { ProtectedRoute } from './routes/ProtectedRoute';
import { RoleRoute } from './routes/RoleRoute';
import { useAuth } from './context/AuthContext';
import { dashboards } from './utils/constants';

const RootRedirect = () => {
  const { user } = useAuth();
  return <Navigate to={user ? dashboards[user.role] : '/login'} replace />;
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password/:token" element={<ResetPassword />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/receptionist/dashboard" element={<Dashboard />} />
        <Route path="/doctor/dashboard" element={<Dashboard />} />
        <Route path="/nurse/dashboard" element={<Dashboard />} />
        <Route path="/patients" element={<PatientList />} />
        <Route path="/patients/:id" element={<PatientProfile />} />
        <Route path="/appointments" element={<Appointments />} />
        <Route path="/profile" element={<Profile />} />
        <Route element={<RoleRoute allowed={['admin', 'receptionist']} />}>
          <Route path="/receptionist/register-patient" element={<RegisterPatient />} />
        </Route>
        <Route element={<RoleRoute allowed={['admin', 'doctor']} />}>
          <Route path="/consultations/new" element={<ConsultationForm />} />
        </Route>
        <Route element={<RoleRoute allowed={['admin']} />}>
          <Route path="/admin/users" element={<UserManagement />} />
          <Route path="/admin/reports" element={<Reports />} />
          <Route path="/admin/audit-logs" element={<AuditLogs />} />
        </Route>
      </Route>
    </Routes>
  );
}
