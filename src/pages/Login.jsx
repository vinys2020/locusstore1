import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, provider, db } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
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
        nombreCompleto: "",
        dni: "",
        telefono: "",
        domposgeo: "",
        posgeo: "",
        fechaNacimiento: "",
        organismo: "",
        gremio: "",
        puntos: 0,
        rol: "usuario",
    });

    const navigate = useNavigate();

    // Chequear si el usuario tiene todos los campos obligatorios
    const isUserDataComplete = (data) => {
        const requiredFields = ["nombreCompleto", "dni", "telefono", "domposgeo", "posgeo", "fechaNacimiento", "organismo", "gremio"];
        return requiredFields.every((field) => data[field] && data[field].toString().trim() !== "");
    };

    useEffect(() => {
        if (!usuario?.uid) return;

        const ref = doc(db, "usuarios", usuario.uid);

        const unsubscribe = onSnapshot(ref, (docSnap) => {
            if (!docSnap.exists()) {
                setShowForm(true);
                setPendingApproval(false);
                return;
            }

            const data = docSnap.data();
            setUserData({
              nombreCompleto: data.nombreCompleto || "",
              dni: data.dni || "",
              telefono: data.telefono || "",
              domposgeo: data.domposgeo || "",
              posgeo: data.posgeo || "",
              fechaNacimiento: data.fechaNacimiento || "",
              organismo: data.organismo || "",
              gremio: data.gremio || "",
              puntos: data.puntos || 0,
              rol: data.rol || "usuario",
            });

            if (!isUserDataComplete(data)) {
                setShowForm(true);
                setPendingApproval(false);
            } else {
                setShowForm(false);
                if (!data.aprobado) {
                    setPendingApproval(true);
                } else {
                    setPendingApproval(false);
                    // Redirigir según rol
                    if (data.rol === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/home");
                    }
                }
            }
        });

        return () => unsubscribe();
    }, [usuario, navigate]);

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
                setShowForm(true);
            } else {
                const data = snapshot.data();
                setUserData(data);

                if (!isUserDataComplete(data)) {
                    setShowForm(true);
                    setPendingApproval(false);
                } else if (!data.aprobado) {
                    setShowForm(false);
                    setPendingApproval(true);
                } else {
                    setShowForm(false);
                    setPendingApproval(false);
                    if (data.rol === "admin") {
                        navigate("/admin");
                    } else {
                        navigate("/home");
                    }
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
// Guardar datos de usuario nuevo
const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = auth.currentUser;
      if (!user) throw new Error("Usuario no encontrado");
  
      await setDoc(doc(db, "usuarios", user.uid), {
        uid: user.uid || "",
        email: user.email || "",
        nombreCompleto: userData.nombreCompleto || "",
        dni: userData.dni || "",
        telefono: userData.telefono || "",
        domposgeo: userData.domposgeo || "",
        posgeo: userData.posgeo || "",
        fechaNacimiento: userData.fechaNacimiento || "",
        organismo: userData.organismo || "",
        gremio: userData.gremio || "",
        aprobado: false, // 🔴 siempre arranca en false
        fechaAfiliacion: new Date(),
        puntos: userData.puntos || 0,
        rol: userData.rol || "usuario",
      });
  
      const cuponesRef = collection(db, "usuarios", user.uid, "cuponesid");
      await setDoc(doc(cuponesRef, "bienvenida"), {
        nombre: "Cupón Bienvenida",
        descuento: 10,
        usado: false,
        fechaCreacion: new Date(),
      });
  
      setShowForm(false);
  
      // 👇 IMPORTANTE: no lo mandamos al /home
      // El useEffect y el ProtectedRoute ya se encargan
      // de mostrar el "pendiente de aprobación"
      setPendingApproval(true);
    } catch (err) {
      console.error(err);
      setError("Error al guardar los datos");
    }
  };
      


    if (loading)
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100">
                <img src={logo} alt="Logo" style={{ width: "200px", marginBottom: "20px" }} />
                <div className="spinner-border text-primary" role="status" style={{ width: "4rem", height: "4rem" }}>
                    <span className="visually-hidden">Cargando...</span>
                </div>
                <p className="mt-3 text-muted">Cargando, por favor espere...</p>
            </div>
        );

    if (!loading && pendingApproval)
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light p-3">
                <img src={logo} alt="Logo" className="img-fluid mb-4" style={{ maxWidth: "180px" }} />
                <div className="card shadow-sm p-4 text-center w-100" style={{ maxWidth: "400px", borderRadius: "20px" }}>
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
                    <h4 className="mb-2">¡Hola {usuario?.displayName || userData.nombreCompleto || "usuario"}!</h4>
                    <p className="text-muted mb-3">Por favor espera, el administrador debe autorizar tu ingreso.</p>
                    <div className="d-flex justify-content-center mb-3">
                        <div className="spinner-border text-primary" role="status" style={{ width: "3rem", height: "3rem" }}>
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
                            <span className="google-btn-text">{isLoggingIn ? "Ingresando..." : "Continuar con Google"}</span>
                        </button>
                        <small className="text-muted">No compartiremos tu información con terceros.</small>
                    </>
                ) : (
                    <>
                        <h4 className="mb-3">Completa tus datos</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit}>
                            <div className="row">
                                <div className="col-12 mb-2">
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="nombreCompleto"
                                        placeholder="Nombre y Apellido"
                                        value={userData.nombreCompleto}
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

                            <div className="form-floating mb-3">
                                <input
                                    type="date"
                                    className="form-control"
                                    id="fechaNacimiento"
                                    name="fechaNacimiento"
                                    value={userData.fechaNacimiento}
                                    onChange={handleInputChange}
                                    required
                                />
                                <label htmlFor="fechaNacimiento">Fecha de nacimiento</label>
                            </div>

                            <select
                                className="form-control mb-2"
                                name="organismo"
                                value={userData.organismo}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar organismo</option>
                                <option value="Ministerio de Agua, Energía y Medio Ambiente">Ministerio de Agua, Energía y Medio Ambiente</option>
                                <option value="Ministerio de Desarrollo Social">Ministerio de Desarrollo Social</option>
                                <option value="Ministerio de Educación, Ciencias y Tecnología">Ministerio de Educación, Ciencias y Tecnología</option>
                                <option value="Ministerio de Infraestructura y Obras Civiles">Ministerio de Infraestructura y Obras Civiles</option>
                                <option value="Ministerio de Salud">Ministerio de Salud</option>
                            </select>

                            <select
                                className="form-control mb-2"
                                name="gremio"
                                value={userData.gremio}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar gremio</option>
                                <option value="UPCN">UPCN</option>
                            </select>

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
