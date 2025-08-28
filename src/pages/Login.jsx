import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, provider, db } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, onSnapshot, collection } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/sinfondologo.png";
import googleLogo from "../assets/google-logo-NePEveMl.webp";

import "./Login.css"; // Estilos personalizados

const Login = () => {
  const { usuario, loading } = useAuth();
  const [error, setError] = useState("");
  const [pendingApproval, setPendingApproval] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [userData, setUserData] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    telefono: "",
    domposgeo: "",
    posgeo: "",
    organismo: "",
    puntos: 0,
  });

  const navigate = useNavigate();

  // Observa el usuario en Firestore
  useEffect(() => {
    if (!usuario?.uid) return;
  
    const ref = doc(db, "usuarios", usuario.uid);
  
    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (!docSnap.exists()) {
        // Usuario nuevo → mostrar formulario
        setShowForm(true);
        setPendingApproval(false);
        return;
      }
  
      const data = docSnap.data();
      setUserData(data);
  
      if (data.aprobado) {
        // Usuario aprobado → ir a home
        setShowForm(false);
        setPendingApproval(false);
        navigate("/home");
      } else {
        // Usuario existente pero no aprobado
        // Solo mostrar pantalla de espera si ya completó el formulario
        if (!showForm) setPendingApproval(true);
      }
    });
  
    return () => unsubscribe();
  }, [usuario, navigate, showForm]);
  

  // Manejo de cambios en inputs
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    setError("");
    setIsLoggingIn(true);
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const ref = doc(db, "usuarios", user.uid);
      const snapshot = await getDoc(ref);

      if (!snapshot.exists()) {
        setShowForm(true); // usuario nuevo → mostrar formulario
      } else {
        const data = snapshot.data();
        setUserData(data);

        if (data.aprobado) {
          navigate("/Home"); // usuario aprobado → home
        } else {
          setPendingApproval(true); // usuario no aprobado → espera
        }
      }
    } catch (err) {
      console.error(err);
      setError("Error al iniciar sesión con Google");
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Guardar datos de usuario nuevo
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no encontrado");
  
      // 1️⃣ Crear documento principal del usuario
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid,
        email: user.email,
        nombre: userData.nombre,
        apellido: userData.apellido,
        dni: userData.dni,
        telefono: userData.telefono,
        domposgeo: userData.domposgeo,
        posgeo: userData.posgeo,
        organismo: userData.organismo,
        aprobado: false,
        fechaAfiliacion: new Date(),
        puntos: 0,
      });
  
      // 2️⃣ Crear subcolección "cuponesid" vacía
      const cuponesRef = collection(db, "usuarios", user.uid, "cuponesid");
      
      // Crear un cupón inicial vacío o de ejemplo
      await setDoc(doc(cuponesRef, "bienvenida"), {
        nombre: "Cupón Bienvenida",
        descuento: 10, // porcentaje
        usado: false,
        fechaCreacion: new Date(),
      });
  
      setShowForm(false);
      setPendingApproval(true); // pantalla de espera
    } catch (err) {
      console.error(err);
      setError("Error al guardar los datos");
    }
  };

  // Spinner de carga global
  if (loading)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100">
<img
  src={logo} // tu logo en lugar del de Google
  alt="Logo"
  style={{ width: "200px", marginBottom: "20px" }}
/>
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "4rem", height: "4rem" }}
        >
          <span className="visually-hidden">Cargando...</span>
        </div>
        <p className="mt-3 text-muted">Cargando, por favor espere...</p>
      </div>
    );

  // Pantalla de espera para usuarios no aprobados
  if (!loading && pendingApproval)
    return (
      <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light p-3">
        <img
          src={logo}
          alt="Logo"
          className="img-fluid mb-4"
          style={{ maxWidth: "180px" }}
        />

        <div
          className="card shadow-sm p-4 text-center w-100"
          style={{ maxWidth: "400px", borderRadius: "20px" }}
        >
          {usuario?.photoURL && (
            <div className="d-flex justify-content-center mb-3">
              <img
                src={usuario.photoURL}
                alt={usuario.displayName || "Usuario"}
                className="rounded-circle border border-warning"
                style={{ width: "100px", height: "100px", objectFit: "cover" }}
              />
            </div>
          )}

          <h4 className="mb-2">
            ¡Hola {usuario?.displayName || userData.nombre || "usuario"}!
          </h4>
          <p className="text-muted mb-3">
            Por favor espera, el administrador debe autorizar tu ingreso.
          </p>

          <div className="d-flex justify-content-center mb-3">
            <div
              className="spinner-border text-primary"
              role="status"
              style={{ width: "3rem", height: "3rem" }}
            >
              <span className="visually-hidden">Cargando...</span>
            </div>
          </div>

          <button
            className="btn btn-outline-danger btn-lg w-100"
            onClick={async () => {
              await signOut(auth);
              setPendingApproval(false);
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </div>
    );

  // Login normal o formulario para usuario nuevo
  return (
    <div className="login-background">
      <div className="login-card text-center">
        <img src={logo} alt="Logo" className="logo mb-1" />

        {!showForm ? (
          <>
            <h2 className="mb-2">Inicia Sesión</h2>
            <p className="mb-3" style={{ fontSize: "1rem", color: "#555", lineHeight: 1.4 }}>
  Registrate con Google es rápido, seguro y tus datos siempre estarán protegidos.
</p>
            {error && <div className="alert alert-danger">{error}</div>}
            <button
              onClick={handleGoogleLogin}
              className="google-btn d-flex align-items-center px-2 py-2 w-100 mb-0"
              disabled={isLoggingIn}
            >
              <div className="google-btn-logo d-flex align-items-center justify-content-center mb-1">
                <img alt="Logo de Google" src={googleLogo} className="mb-0" />
              </div>
              <span className="google-btn-text">
                {isLoggingIn ? "Ingresando..." : "Continuar con Google"}
              </span>
            </button>
            <small className="text-muted">
              No compartiremos tu información con terceros.
            </small>
          </>
        ) : (
          <>
            <h4 className="mb-3">Completa tus datos</h4>
            {error && <div className="alert alert-danger">{error}</div>}
            <form onSubmit={handleSubmit}>
              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="nombre"
                    placeholder="Nombre"
                    value={userData.nombre}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="apellido"
                    placeholder="Apellido"
                    value={userData.apellido}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="row">
                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="dni"
                    placeholder="DNI"
                    value={userData.dni}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="col-md-6 mb-2">
                  <input
                    type="text"
                    className="form-control"
                    name="telefono"
                    placeholder="Teléfono"
                    value={userData.telefono}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <input
                type="text"
                className="form-control mb-2"
                name="domposgeo"
                placeholder="Ciudad/Localidad"
                value={userData.domposgeo}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                name="posgeo"
                placeholder="Dirección"
                value={userData.posgeo}
                onChange={handleInputChange}
                required
              />
              <input
                type="text"
                className="form-control mb-2"
                name="organismo"
                placeholder="Organismo"
                value={userData.organismo}
                onChange={handleInputChange}
                required
              />

              <button type="submit" className="btn btn-primary w-100 mt-2">
                Guardar datos
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default Login;
