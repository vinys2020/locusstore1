import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Perfil from "./pages/Perfil"; // ✅ Importamos Perfil
import Navbar from "./components/Navbar";
import AdminDashboard from "./pages/AdminDashboard";
import Carrito from "./pages/Carrito";
import Contacto from "./pages/Contacto";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import ScrollToTop from "./components/ScrollToTop"; // ✅ Importamos ScrollToTop
import Footer from "./components/Footer"; // ✅ Importa tu Footer existente
import ProyectosFuturos from "./pages/ProyectosFuturos";
import SobreNosotros from "./pages/SobreNosotros";
import CategoriasPage from "./pages/CategoriasPage";
import LotesPage from "./pages/Lotes";
import EsparcimientoPage from "./pages/Esparcimiento";

import ProductoDetalle from "./components/ProductoDetalle";
import PreFooter from "./components/PreFooter"; // ✅ Importa tu PreFooter
import "react-toastify/dist/ReactToastify.css";
import ToastWithSound from "./components/ToastWithSound";








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
      <CartProvider >
        <ScrollToTop /> {/* ✅ Agregado aquí */}

        <App />
        <ToastWithSound />

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

    <div className="app-wrapper d-flex flex-column min-vh-100">
      {location.pathname !== "/" && (
        <Navbar busqueda={busqueda} setBusqueda={setBusqueda} />
      )}

      <main className="flex-grow-1 min-vh-100 bg-white">
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/home"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/perfil"
            element={
              <ProtectedRoute>
                <Perfil />
              </ProtectedRoute>
            }
          />
          <Route
            path="/Carrito"
            element={
              <ProtectedRoute>
                <Carrito />
              </ProtectedRoute>
            }
          />
          <Route
            path="/categorias/:categoriaId"
            element={
              <ProtectedRoute>
                <CategoriasPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Lotes"
            element={
              <ProtectedRoute>
                <LotesPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/Esparcimiento"
            element={
              <ProtectedRoute>
                <EsparcimientoPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/categorias/:categoriaId/producto/:productoId"
            element={
              <ProtectedRoute>
                <ProductoDetalle />
              </ProtectedRoute>
            }
          />

          <Route
            path="/ProyectosFuturos"
            element={
              <ProtectedRoute>
                <ProyectosFuturos />
              </ProtectedRoute>
            }
          />
          <Route
            path="/SobreNosotros"
            element={
              <ProtectedRoute>
                <SobreNosotros />
              </ProtectedRoute>
            }
          />
          <Route
            path="/contacto"
            element={
              <ProtectedRoute>
                <Contacto />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin"
            element={
              <ProtectedRoute rolPermitido="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {location.pathname !== "/" && (
        <>
          <PreFooter />  {/* ✅ Agregado aquí antes del Footer */}
          <Footer />
        </>
      )}    </div>
  );

}

export default AppWrapper;
