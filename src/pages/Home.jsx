// src/pages/Home.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 text-center">
        <h2>Bienvenido, {usuario?.nombre || usuario?.displayName || usuario?.email}!</h2>
        <p>¡Has ingresado correctamente a la aplicación!</p>
        <button className="btn btn-danger mt-3" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>
    </div>
  );
};

export default Home;
