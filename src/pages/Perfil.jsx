import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { collection, doc, addDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import "./perfil.css";

const Perfil = () => {
  const { usuario } = useContext(AuthContext);
  const [datosUsuario, setDatosUsuario] = useState(null);

  useEffect(() => {
    if (!usuario) return;

    const userDocRef = doc(db, "usuarios", usuario.uid);

    // Escucha en tiempo real
    const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setDatosUsuario(docSnap.data());
      }
    });

    return () => unsubscribe();
  }, [usuario]);

  const comprarCupon = async (nombre, descuento, costoPuntos) => {
    if (!usuario || !datosUsuario) return;

    if (datosUsuario.puntos < costoPuntos) {
      alert("No tienes puntos suficientes para canjear este cupón.");
      return;
    }

    try {
      const userDocRef = doc(db, "usuarios", usuario.uid);

      // Actualiza puntos
      await updateDoc(userDocRef, {
        puntos: datosUsuario.puntos - costoPuntos,
      });

      // Crea el cupón
      const cuponData = {
        nombre,
        descuento,
        usado: false,
        fechaCompra: new Date(),
      };

      const cuponesCollectionRef = collection(db, "usuarios", usuario.uid, "cuponesid");
      await addDoc(cuponesCollectionRef, cuponData);

      alert(`¡Cupón "${nombre}" comprado con éxito!`);
    } catch (error) {
      console.error("Error comprando cupón:", error);
      alert("Hubo un error al comprar el cupón. Intenta nuevamente.");
    }
  };

  if (!usuario) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center text-center px-3" style={{ minHeight: "80vh", paddingTop: "1rem", paddingBottom: "1rem" }}>
        <h3 className="text-white d-flex align-items-center gap-2 mb-2 mt-lg-4">
          Debes iniciar sesión para ver tu perfil.
        </h3>
        <img
          src="https://res.cloudinary.com/dcggcw8df/image/upload/v1748991756/p416e5ggh9yvtovqgrpc.png"
          alt="Iniciar sesión requerido"
          className="perfil-img-login mb-3"
        />
        <p className="text-white mb-2 px-2 small">
          Tu información está segura con nosotros 🔒. Solo tú puedes ver tus beneficios.
        </p>
        <p className="text-white small px-2 mb-lg-5 mb-1">
          ¿No tenés cuenta?{" "}
          <a href="/login" className="link-hover-underline fw-bold text-warning">
            Registrate gratis y empezá a sumar puntos hoy.
          </a>
        </p>
      </div>
    );
  }

  const user = {
    nombre: datosUsuario?.nombre || usuario.displayName || "Nombre no disponible",
    email: usuario.email,
    foto: usuario.photoURL || "https://i.pravatar.cc/150?img=3",
    puntos: datosUsuario?.puntos ?? 0,
  };

  return (
    <section className="perfil-container">
      <div className="perfil-card shadow-lg rounded-4 p-4">
        <div className="perfil-header d-flex flex-column flex-md-row align-items-center gap-4 mb-4">
          <img src={user.foto} alt="Foto de perfil" className="perfil-foto rounded-circle shadow" />
          <div>
            <h2 className="fw-bold">{user.nombre}</h2>
            <p className="text-muted mb-1">{user.email}</p>
            <span className="badge bg-success fs-6">⭐ {user.puntos} puntos acumulados</span>
          </div>
        </div>

        <div className="perfil-section">
          <section className="puntos-beneficios border-top pt-4 mt-5">
            <h4 className="mb-3">🎁 Canjea tus puntos</h4>
            <p className="text-muted">
              🎯 Acumulá puntos en tus compras y canjealos por increíbles cupones de descuento.
            </p>
            <article className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
              <div className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-black"><i className="bi bi-tag me-1"></i>10% de descuento</h5>
                    <hr className="bg-dark" />
                    <p className="card-text text-center">Canjea 150 puntos para obtener un 10% de descuento en tu próxima compra.</p>
                  </div>
                  <div className="card-footer d-flex justify-content-center border-0 bg-white">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => comprarCupon("10% de Descuento", 10, 150)}
                      disabled={user.puntos < 150}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-black"><i className="bi bi-star-fill me-1"></i>20% de descuento</h5>
                    <hr className="bg-dark" />
                    <p className="card-text text-center">Canjea 250 puntos para obtener un 20% de descuento en tu próxima compra.</p>
                  </div>
                  <div className="card-footer d-flex justify-content-center border-0 bg-white">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => comprarCupon("20% de Descuento", 20, 250)}
                      disabled={user.puntos < 250}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>

              <div className="col">
                <div className="card h-100 shadow-sm">
                  <div className="card-body">
                    <h5 className="card-title text-black"><i className="bi bi-gift me-1"></i>30% de descuento</h5>
                    <hr className="bg-dark" />
                    <p className="card-text text-center">Canjea 350 puntos para obtener un 30% de descuento en tu próxima compra.</p>
                  </div>
                  <div className="card-footer d-flex justify-content-center border-0 bg-white">
                    <button
                      className="btn btn-success btn-sm"
                      onClick={() => comprarCupon("30% de Descuento", 30, 350)}
                      disabled={user.puntos < 350}
                    >
                      Canjear
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </section>
        </div>
      </div>
    </section>
  );
};

export default Perfil;
