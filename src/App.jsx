import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil"; // ✅ Importamos Perfil
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";

function ProtectedRoute({ children, rolPermitido }) {
  const { usuario, loading } = useAuth();

  if (loading) return <p className="text-center mt-10">Cargando...</p>;

  if (!usuario) return <Navigate to="/" replace />; // no logueado → login

  if (!usuario.aprobado)
    return <p className="text-center mt-10">Esperando aprobación del administrador...</p>;

  // si se define rolPermitido y el usuario no tiene ese rol → redirige
  if (rolPermitido && usuario.rol !== rolPermitido) {
    return <Navigate to="/home" replace />;
  }

  return children;
}

function AppWrapper() {
  return (
    <AuthProvider>
      <CartProvider>
        <App />
      </CartProvider>
    </AuthProvider>
  );
}

function App() {
  const [busqueda, setBusqueda] = useState("");
  const location = useLocation();
  const { usuario } = useAuth();

  // Redireccionar admin al dashboard si entra al login
  useEffect(() => {
    if (usuario?.rol === "admin" && location.pathname === "/") {
      window.location.href = "/admin"; // redirige al dashboard
    }
  }, [usuario, location.pathname]);

  return (
    <>
      {/* Mostrar Navbar solo si NO estamos en login */}
      {location.pathname !== "/" && (
        <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />
      )}
      <Routes>
        <Route path="/" element={<Login />} />
        
        {/* Home disponible para todos los usuarios aprobados */}
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Home />
            </ProtectedRoute>
          }
        />

        {/* Perfil del usuario */}
        <Route
          path="/perfil"
          element={
            <ProtectedRoute>
              <Perfil />
            </ProtectedRoute>
          }
        />

        {/* AdminDashboard solo para admins */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute rolPermitido="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* Ruta comodín */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default AppWrapper;
