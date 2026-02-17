import { Navigate, Outlet } from 'react-router-dom';

const AdminProtectedRoute = () => {
  const isAdmin = localStorage.getItem('is_admin') === 'true';
  return isAdmin ? <Outlet /> : <Navigate to="/login" replace />;
};

export default AdminProtectedRoute;


