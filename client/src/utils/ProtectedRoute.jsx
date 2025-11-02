import { Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthContext";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { user, token } = useContext(AuthContext);

  // if no user or no token, redirect to login
  if (!user || !token) {
    return <Navigate to="/login" replace />;
  }

  // if specific roles are required (like only "mamafua")
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // else allow access
  return children;
}
