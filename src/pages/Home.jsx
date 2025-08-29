// src/pages/Home.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import logo from "../assets/sinfondologo.png"; // opcional: tu logo
import "bootstrap/dist/css/bootstrap.min.css";
import "./Home.css"; // estilos adicionales opcionales

const Home = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="home-background d-flex justify-content-center align-items-center vh-100">
      <div className="home-card text-center p-4 shadow rounded-4 bg-white">
        {/* Foto de usuario */}
        <div className="user-photo mb-3">
          <img
            src={usuario?.photoURL || logo}
            alt={usuario?.displayName || "Usuario"}
            className="rounded-circle border border-warning"
            style={{ width: "120px", height: "120px", objectFit: "cover" }}
          />
        </div>

        {/* Saludo personalizado */}
        <h2 className="fw-bold mb-2" style={{ color: "#FFC107" }}>
          ¡Bienvenido, {usuario?.nombre || usuario?.displayName || "Usuario"}!
        </h2>
        <p className="text-muted mb-4">
          Nos alegra verte de nuevo. Explora todas las funcionalidades de la aplicación.
        </p>


      </div>
    </div>
  );
};

export default Home;
