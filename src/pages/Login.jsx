import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth, provider, db } from "../config/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc, setDoc, collection, onSnapshot } from "firebase/firestore";
import "bootstrap/dist/css/bootstrap.min.css";
import logo from "../assets/navbarlogo.png";
import googleLogo from "../assets/google-logo-NePEveMl.webp";
import logis from "../assets/logolocus.png";


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
                puntos: data.puntos || 10,
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
                puntos: userData.puntos || 10,
                rol: userData.rol || "usuario",
            });

            const cuponesRef = collection(db, "usuarios", user.uid, "cuponesid");

            // Creamos un documento vacío solo para inicializar la subcolección
            await setDoc(doc(cuponesRef, "init"), {});

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
            <div
                className="d-flex flex-column justify-content-center align-items-center vh-100"
                style={{
                    background: "linear-gradient(135deg, #3d835e 30%, #4B2E65 70%)",
                    minHeight: "100vh"
                }}
            >
                <img
                    src={logis}
                    alt="Logo"
                    style={{ width: "100px", marginBottom: "20px" }}
                />
                <div
                    className="spinner-border text-primary"
                    role="status"
                    style={{ width: "4rem", height: "4rem" }}
                >
                    <span className="visually-hidden text-white">Cargando...</span>
                </div>
                <p className="mt-3 text-white">Cargando, por favor espere...</p>
            </div>

        );

    if (!loading && pendingApproval)
        return (
            <div className="d-flex flex-column justify-content-center align-items-center vh-100 text-center bg-light" style={{
                background: "linear-gradient(135deg, #3d835e 30%, #4B2E65 70%)",
                minHeight: "100vh"
            }}>
                <div className="shadow-sm p-4 text-center w-100 bg-white" style={{ maxWidth: "500px", borderRadius: "20px" }}>
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
                    <h3 className="mb-2">¡Hola {usuario?.displayName || userData.nombreCompleto || "usuario"}!</h3>
                    <p className="text-black mb-3 fw-bold" style={{ color: "#0c5460" }}>
                        Por favor espera, el administrador debe autorizar tu ingreso.
                        Este proceso puede demorar <strong>hasta 72 hs hábiles</strong> como máximo.
                    </p>
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
                        <h2 className="mb-2 mt-1 text-white">Inicia Sesión</h2>
                        <p className="mb-3 text-white" style={{ fontSize: "1rem", color: "#555", lineHeight: 1.4 }}>
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
                        <small className="text-white">No compartiremos tu información con terceros.</small>
                    </>
                ) : (
                    <>
                        <h4 className="mb-3 mt-2 text-warning">Completa tus datos</h4>
                        {error && <div className="alert alert-danger">{error}</div>}
                        <form onSubmit={handleSubmit} className="p-2 bg-transparent">
                            <div className="row">
                                <div className="col-12 mb-1">
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
                                <div className="col-md-6 mb-1">
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
                                <div className="col-md-6 mb-1">
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
                                className="form-control mb-3"
                                name="domposgeo"
                                placeholder="Ciudad/Localidad"
                                value={userData.domposgeo}
                                onChange={handleInputChange}
                                required
                            />
                            <input
                                type="text"
                                className="form-control mb-3"
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
                                className="form-control mb-3"
                                name="organismo"
                                value={userData.organismo}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar Organismo</option>
                                <option value="AGAP-M H Y F-">AGAP-M H Y F-</option>
                                <option value="APANE">APANE</option>
                                <option value="CAJA DE PRESTACIONES SOCIALES DE CATAMARCA">CAJA DE PRESTACIONES SOCIALES DE CATAMARCA</option>
                                <option value="CAMARA DE DIPUTADOS">CAMARA DE DIPUTADOS</option>
                                <option value="CAMARA DE SENADORES">CAMARA DE SENADORES</option>
                                <option value="COLEGIO FASTA">COLEGIO FASTA</option>
                                <option value="COLEGIO JUAN PABLO 2">COLEGIO JUAN PABLO 2</option>
                                <option value="COLEGIO PRIVADO NUESTRA SEÑORA DEL VALLE">COLEGIO PRIVADO NUESTRA SEÑORA DEL VALLE</option>
                                <option value="COLEGIO S. ROSA DE LIMA Y CRISTO REY">COLEGIO S. ROSA DE LIMA Y CRISTO REY</option>
                                <option value="COLEGIO VIRGEN NIÑA">COLEGIO VIRGEN NIÑA</option>
                                <option value="CONCEJO DELIBERANTE - MUNIC. RECREO.">CONCEJO DELIBERANTE - MUNIC. RECREO</option>
                                <option value="CONCEJO DELIBERANTE CHUMBICHA">CONCEJO DELIBERANTE CHUMBICHA</option>
                                <option value="CONSEJO DELIBERANTE DE VALLE VIEJO">CONSEJO DELIBERANTE DE VALLE VIEJO</option>
                                <option value="DEL. MINISTERIO DE INTEGRACION REGIONAL, LOG. Y TRA.">DEL. MINISTERIO DE INTEGRACION REGIONAL, LOG. Y TRA.</option>
                                <option value="D.P.A. DEL ENTE DE RECAUDACIÓN">D.P.A. DEL ENTE DE RECAUDACIÓN</option>
                                <option value="DIRECCION DE ADM. DE LA POLICIA DE CATAMARCA">DIRECCION DE ADM. DE LA POLICIA DE CATAMARCA</option>
                                <option value="DP DE MATERNIDAD 25 DE MAYO">DP DE MATERNIDAD 25 DE MAYO</option>
                                <option value="ESC.DE GEST PRIV. SEÑORA DE GUADALUPE">ESC.DE GEST PRIV. SEÑORA DE GUADALUPE</option>
                                <option value="HOSPITAL INTERZONAL DE NIÑOS">HOSPITAL INTERZONAL DE NIÑOS</option>
                                <option value="INST. SUPERIOR FRAY MAMERTO ESQUIU">INST. SUPERIOR FRAY MAMERTO ESQUIU</option>
                                <option value="MINISTERIO DE AGUA, ENERGÍA Y MEDIO AMBIENTE">MINISTERIO DE AGUA, ENERGÍA Y MEDIO AMBIENTE</option>
                                <option value="MINISTERIO DE CIENCIA E INNOVACION TECNOLOGICA">MINISTERIO DE CIENCIA E INNOVACION TECNOLOGICA</option>
                                <option value="MINISTERIO DE COMUNICACIÓN">MINISTERIO DE COMUNICACIÓN</option>
                                <option value="MINISTERIO DE DESARROLLO SOCIAL">MINISTERIO DE DESARROLLO SOCIAL</option>
                                <option value="MINISTERIO DE EDUCACION CS Y TEC">MINISTERIO DE EDUCACION CS Y TEC</option>
                                <option value="MINISTERIO DE GOBIERNO, JUSTICIA Y DERECHOS HUMANO">MINISTERIO DE GOBIERNO, JUSTICIA Y DERECHOS HUMANO</option>
                                <option value="MINISTERIO DE HACIENDA Y FINAN.">MINISTERIO DE HACIENDA Y FINAN.</option>
                                <option value="MINISTERIO DE INDUSTRIA, COMERCIO Y EMPLEO">MINISTERIO DE INDUSTRIA, COMERCIO Y EMPLEO</option>
                                <option value="MINISTERIO DE INCLUSIÓN DIG. Y SERV.PROD.">MINISTERIO DE INCLUSIÓN DIG. Y SERV.PROD.</option>
                                <option value="MINISTERIO DE INFRAESTRUCTURA Y OBRAS CIVILES">MINISTERIO DE INFRAESTRUCTURA Y OBRAS CIVILES</option>
                                <option value="MINISTERIO DE SALUD">MINISTERIO DE SALUD</option>
                                <option value="MINISTERIO DE TRABAJO, PLANIF. Y RRHH">MINISTERIO DE TRABAJO, PLANIF. Y RRHH</option>
                                <option value="MUNICIPALID DE HUALFIN">MUNICIPALID DE HUALFIN</option>
                                <option value="MUNICIPALIDAD DE ANDALGALA">MUNICIPALIDAD DE ANDALGALA</option>
                                <option value="MUNICIPALIDAD DE BELEN">MUNICIPALIDAD DE BELEN</option>
                                <option value="MUNICIPALIDAD DE CHUMBICHA CAPAYAN">MUNICIPALIDAD DE CHUMBICHA CAPAYAN</option>
                                <option value="MUNICIPALIDAD DE CORRAL QUEMADO BELEN">MUNICIPALIDAD DE CORRAL QUEMADO BELEN</option>
                                <option value="MUNICIPALIDAD DE FIAMBALA">MUNICIPALIDAD DE FIAMBALA</option>
                                <option value="MUNICIPALIDAD DE HUILLAPIMA CAPAYAN">MUNICIPALIDAD DE HUILLAPIMA CAPAYAN</option>
                                <option value="MUNICIPALIDAD DE ICAÑO">MUNICIPALIDAD DE ICAÑO</option>
                                <option value="MUNICIPALIDAD DE LA PUERTA">MUNICIPALIDAD DE LA PUERTA</option>
                                <option value="MUNICIPALIDAD DE LA PUERTA DE SAN JOSE BELEN">MUNICIPALIDAD DE LA PUERTA DE SAN JOSE BELEN</option>
                                <option value="MUNICIPALIDAD DE LONDRES">MUNICIPALIDAD DE LONDRES</option>
                                <option value="MUNICIPALIDAD DE LOS ALTOS">MUNICIPALIDAD DE LOS ALTOS</option>
                                <option value="MUNICIPALIDAD DE LOS VARELAS">MUNICIPALIDAD DE LOS VARELAS</option>
                                <option value="MUNICIPALIDAD DE MUTQUIN">MUNICIPALIDAD DE MUTQUIN</option>
                                <option value="MUNICIPALIDAD DE POMAN">MUNICIPALIDAD DE POMAN</option>
                                <option value="MUNICIPALIDAD DE POZO DE PIEDRA BELEN">MUNICIPALIDAD DE POZO DE PIEDRA BELEN</option>
                                <option value="MUNICIPALIDAD DE PUERTA DE CORRAL QUEMADO BELEN">MUNICIPALIDAD DE PUERTA DE CORRAL QUEMADO BELEN</option>
                                <option value="MUNICIPALIDAD DE RECREO">MUNICIPALIDAD DE RECREO</option>
                                <option value="MUNICIPALIDAD DE SAN FERNANDO BELEN">MUNICIPALIDAD DE SAN FERNANDO BELEN</option>
                                <option value="MUNICIPALIDAD DE SAN JOSE SM">MUNICIPALIDAD DE SAN JOSE SM</option>
                                <option value="MUNICIPALIDAD DE SANTA MARIA">MUNICIPALIDAD DE SANTA MARIA</option>
                                <option value="MUNICIPALIDAD DE TAPSO EL ALTO">MUNICIPALIDAD DE TAPSO EL ALTO</option>
                                <option value="MUNICIPALIDAD DE TINOGASTA">MUNICIPALIDAD DE TINOGASTA</option>
                                <option value="MUNICIPALIDAD DE VALLE VIEJO">MUNICIPALIDAD DE VALLE VIEJO</option>
                                <option value="NUEVO HOSPITAL SAN JUAN BAUTISTA">NUEVO HOSPITAL SAN JUAN BAUTISTA</option>
                                <option value="OBRA SOCIAL DE LOS EMPLEADOS PUBLICOS">OBRA SOCIAL DE LOS EMPLEADOS PUBLICOS</option>
                                <option value="SECRETARIA DE CULTURA Y TURISMO">SECRETARIA DE CULTURA Y TURISMO</option>
                                <option value="SECRETARIA DE ESTADO DE CULTURA NO USAR">SECRETARIA DE ESTADO DE CULTURA NO USAR</option>
                                <option value="SECRETARIA DE ESTADO DE SEGURIDAD">SECRETARIA DE ESTADO DE SEGURIDAD</option>
                                <option value="SECRETARIA DE MINERIA">SECRETARIA DE MINERIA</option>
                                <option value="SECRETARIA DE VIVIENDA Y DES URBANO">SECRETARIA DE VIVIENDA Y DES URBANO</option>
                                <option value="SERVICIO PENITENCIARIO PROVINCIAL">SERVICIO PENITENCIARIO PROVINCIAL</option>
                                <option value="VIALIDAD PROVINCIAL">VIALIDAD PROVINCIAL</option>


                            </select>

                            <select
                                className="form-control mb-3"
                                name="gremio"
                                value={userData.gremio}
                                onChange={handleInputChange}
                                required
                            >
                                <option value="">Seleccionar Gremio</option>
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
