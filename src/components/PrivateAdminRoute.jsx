import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateAdminRoute = ({ children }) => {
  const { usuario, loading } = useAuth();

  if (loading) return <div>Cargando acceso...</div>;

  if (!usuario || !usuario.aprobado) return <Navigate to="/" replace />;

  if (usuario.rol !== "admin") return <Navigate to="/home" replace />;

  return children;
};

export default PrivateAdminRoute;
