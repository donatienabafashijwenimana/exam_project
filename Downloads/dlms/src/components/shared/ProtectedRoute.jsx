import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children, allowedRoles, requiredPermission }) {
  const { user, can } = useAuth();
  
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/login" replace />;
  if (requiredPermission && !can(requiredPermission)) return <Navigate to="/login" replace />;
  return children;
}
