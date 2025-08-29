import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const { usuario, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <div className="container mt-5 pt-5">
      <h1 className="text-center text-warning mt-4">Admin Dashboard</h1>
      <p className="text-center">Bienvenido, {usuario?.nombre || usuario?.displayName || "Administrador"}!</p>

      <div className="d-flex justify-content-center mt-4">
        <button className="btn btn-danger me-2" onClick={handleLogout}>
          Cerrar sesión
        </button>
        <button className="btn btn-primary" onClick={() => navigate("/home")}>
          Ir a Home
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;
