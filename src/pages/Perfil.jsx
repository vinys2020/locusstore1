import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../context/AuthContext";
import { collection, doc, addDoc, updateDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import "./perfil.css";

const Perfil = () => {
  const { usuario } = useContext(AuthContext);
  const [datosUsuario, setDatosUsuario] = useState(null);
  const [pedidos, setPedidos] = useState([]);
  const [paginaActual, setPaginaActual] = useState(1);
  const pedidosPorPagina = 4; // cuantos pedidos mostrar por página
  const totalPaginas = Math.ceil(pedidos.length / pedidosPorPagina);
  const [cupones, setCupones] = useState([]);

  const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  const verDetalles = (pedido) => {
    setPedidoSeleccionado(pedido);
    setMostrarModal(true);
  };

  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ");
  };

  useEffect(() => {
    if (!usuario) return;

    const cuponesRef = collection(db, "usuarios", usuario.uid, "cuponesid");

    const unsubscribe = onSnapshot(cuponesRef, (snapshot) => {
      const cuponesData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setCupones(cuponesData);
    });

    return () => unsubscribe();
  }, [usuario]);

  useEffect(() => {
    if (!usuario) return;

    const pedidosRef = collection(db, "pedidos");

    const unsubscribe = onSnapshot(pedidosRef, (snapshot) => {
      const pedidosUsuario = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() }))
        .filter(pedido => pedido.userId === usuario.uid); // solo los del usuario
      setPedidos(pedidosUsuario);
    });

    return () => unsubscribe();
  }, [usuario]);

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
          {/* Foto */}
          <div className="d-flex justify-content-md-end justify-content-center mb-lg-3 ">
            <img
              src={user.foto}
              alt={user.nombre}
              className="perfil-foto rounded-circle  border-success shadow-sm"
              style={{ width: "120px", height: "120px", objectFit: "cover" }}
            />
          </div>

          {/* Texto de bienvenida */}
          <div className="text-center text-md-start">

            <h2 className="fw-bold mb-1 mt-4 text-dark">
              {capitalizeWords(user.nombre)}
            </h2>
            <p className="text-dark mb-2 fs-5 text-lg-start">
              Nos alegra verte de nuevo<br className="d-none d-md-inline" />
            </p>
            <span className="badge bg-success fs-6">⭐ {user.puntos} puntos acumulados</span>
          </div>
        </div>


        <div className="perfil-section">

          <section className="mis-pedidos border-top pt-4 mt-5">
            <h4 className="mb-3">Historial de Compras</h4>

            {pedidos.length === 0 ? (
              <p className="text-muted">Aún no realizaste ningún pedido.</p>
            ) : (
              <>
                <ul className="list-group compras-recientes ">
                  {pedidos
                    .sort((a, b) => b.fecha?.seconds - a.fecha?.seconds)
                    .slice((paginaActual - 1) * pedidosPorPagina, paginaActual * pedidosPorPagina)
                    .map((pedido) => (
                      <li className="list-group-item mb-3 border p-2" key={pedido.id}>
                        <div className="d-flex justify-content-between align-items-center mx-lg-1 ">
                          <div>
                            <strong className="text-black">Pedido ID: {pedido.id}</strong>
                            <div
                              className={`small ${pedido.estado === "pendiente"
                                ? "text-danger"
                                : pedido.estado === "completado"
                                  ? "text-primary"
                                  : ""
                                }`}
                            >
                              {pedido.estado === "pendiente"
                                ? "⏳ Estamos preparando tu pedido.."
                                : pedido.estado === "completado"
                                  ? "✅ Completado"
                                  : ""}
                            </div>

                            <div className="text-muted small">
                              Método de pago:{" "}
                              {pedido.metodoPago === "efectivo"
                                ? "💵 Efectivo"
                                : pedido.metodoPago === "tarjeta"
                                  ? "💳 Tarjeta"
                                  : "📲 Transferencia"}
                            </div>
                          </div>
                          <span className="text-success fw-bold">
                            Total: {pedido.totalpedido?.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}

                          </span>
                        </div>

                        {/* 🔽 Botón para ver detalles */}
                        <button
                          className="btn btn-primary btn-lg-xs mt-2 mx-lg-1 "
                          onClick={() =>
                            setPedidos((prev) =>
                              prev.map((p) =>
                                p.id === pedido.id ? { ...p, mostrarDetalles: !p.mostrarDetalles } : p
                              )
                            )
                          }
                        >
                          {pedido.mostrarDetalles ? "Ocultar detalles" : "Ver detalles"}
                        </button>

                        {/* 🔽 Detalles visibles solo si mostrarDetalles es true */}
                        {pedido.mostrarDetalles && (
                          <div className="mt-3 p-3 border rounded bg-light text-dark">
                            <h5 className="fw-bold mb-2">Detalles del pedido</h5>

                            <div className="mb-2">
                              <p><strong>Nombre:</strong> {pedido.Cliente?.nombre || "-"}</p>
                              <p><strong>Email:</strong> {pedido.Cliente?.email || "-"}</p>
                              <p><strong>Teléfono:</strong> {pedido.Cliente?.telefono || "-"}</p>
                              <p><strong>DNI:</strong> {pedido.Cliente?.dni || "-"}</p>
                              <p><strong>Gremio:</strong> {pedido.Cliente?.gremio || "-"}</p>
                              <p><strong>Organismo:</strong> {pedido.Cliente?.organismo || "-"}</p>
                              <p><strong>Cupón aplicado:</strong> {pedido.Cliente?.cupon || "-"}</p>
                              <p>
                                <strong>Fecha:</strong>{" "}
                                {pedido.fecha?.seconds
                                  ? new Date(pedido.fecha.seconds * 1000).toLocaleString("es-AR")
                                  : "Sin fecha"}
                              </p>
                              <p><strong>Método de pago:</strong> {pedido.metodopago || "-"}</p>
                            </div>

                            <h6 className="fw-bold mt-3">Productos</h6>
                            <ul className="list-unstyled">
                              {pedido.productos?.map((prod, i) => {
                                const cantidad = prod.cantidad || 1;
                                const precioBase = prod.preciounitario * cantidad;

                                let descripcionPago = "contado"; // valor por defecto
                                let totalProducto = precioBase;

                                if (prod.metodo === "3cuotas") {
                                  totalProducto = +(precioBase * 1.15).toFixed(2); // 15% de interés
                                  const cuota = +(totalProducto / 3).toFixed(2);
                                  descripcionPago = `3 cuotas de $${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                } else if (prod.metodo === "6cuotas") {
                                  totalProducto = +(precioBase * 1.30).toFixed(2); // 30% de interés
                                  const cuota = +(totalProducto / 6).toFixed(2);
                                  descripcionPago = `6 cuotas de $${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                } else {
                                  totalProducto = precioBase;
                                  descripcionPago = `Contado`;
                                }

                                return (
                                  <li key={i} className="mb-2 p-2 border rounded bg-white">
                                    <strong>{prod.nombre}</strong>
                                    <div><strong>Cantidad:</strong> {cantidad}</div>
                                    <div>
                                      <strong>Precio unitario:</strong>{" "}
                                      {prod.preciounitario?.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}
                                    </div>
                                    <div>
                                      <strong>Total:</strong>{" "}
                                      {totalProducto.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}
                                    </div>
                                    <div>
                                      <strong>Forma de pago:</strong> {descripcionPago}
                                    </div>
                                  </li>
                                );
                              })}
                            </ul>


                            <p className="fw-bold mt-2">
                              Total del pedido:{" "}
                              {pedido.totalpedido?.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}
                            </p>
                          </div>
                        )}


                      </li>
                    ))}
                </ul>

                {/* 🔽 Paginación */}
                {totalPaginas > 1 && (
                  <div className="d-flex justify-content-center mt-3">
                    <nav>
                      <ul className="pagination">
                        {Array.from({ length: totalPaginas }, (_, index) => (
                          <li
                            key={index}
                            className={`page-item ${paginaActual === index + 1 ? "active" : ""
                              }`}
                          >
                            <button
                              className="page-link"
                              onClick={() => setPaginaActual(index + 1)}
                            >
                              {index + 1}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </nav>
                  </div>
                )}
              </>
            )}
          </section>

          <section className="puntos-beneficios border-top pt-4 mt-5">
            <h4 className="mb-3">Canjea tus puntos</h4>
            <p className="text-muted">
              Acumulá puntos cada vez que realices una compra en nuestra tienda.
              ¡Entre más compres, más beneficios obtenés! Canjeá tus puntos fácilmente desde esta sección,
              elegí el cupón que más te convenga y disfrutá de tus recompensas al instante.
              Luego, podrás utilizar el cupón al momento de realizar tu próxima compra.
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

          <section className="mis-cupones border-top pt-4 mt-5">
            <h4 className="mb-4 text-dark">Mis Cupones</h4>
            {!usuario ? (
              <p className="text-muted">Debes iniciar sesión para ver tus cupones.</p>
            ) : (
              <>
                {cupones.length === 0 && <p className="text-muted">Aún no tenés cupones.</p>}

                {/* 🔹 Cupones Disponibles */}
                <div className="mb-5">
                  <h5 className="mb-3 text-success text-center">Cupones Disponibles</h5>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {cupones.filter(c => !c.usado).map((cupon) => (
                      <div className="col" key={cupon.id}>
                        <div className="card bg-light h-100 border-success shadow-xl">
                          <div className="card-body text-center">
                            <h6 className=" text-dark fw-bold">
                              {cupon.nombre} {cupon.descuento ? `- ${cupon.descuento}%` : ""}
                            </h6>
                            <hr className="bg-success" />
                            <p className="text-success fw-semibold mb-2">Disponible ✅</p>
                            {cupon.fechaCompra && (
                              <p className="small text-muted mb-0">
                                Comprado el: {cupon.fechaCompra.toDate
                                  ? cupon.fechaCompra.toDate().toLocaleDateString("es-AR")
                                  : new Date(cupon.fechaCompra.seconds * 1000).toLocaleDateString("es-AR")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {cupones.filter(c => !c.usado).length === 0 && <p className="text-muted ms-3">No hay cupones disponibles en este momento.</p>}
                  </div>
                </div>

                {/* 🔹 Cupones Usados */}
                <div>
                  <h5 className="mb-3 text-danger text-center">Cupones Utilizados</h5>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                    {cupones.filter(c => c.usado).map((cupon) => (
                      <div className="col" key={cupon.id}>
                        <div className="card h-100 border-secondary shadow-xl bg-light">
                          <div className="card-body text-center">
                            <h6 className="text-dark fw-bold">
                              {cupon.nombre} {cupon.descuento ? `- ${cupon.descuento}%` : ""}
                            </h6>
                            <hr className="bg-secondary" />
                            <p className="text-danger fw-semibold mb-2">Ya utilizado ❌</p>
                            {cupon.fechaCompra && (
                              <p className="small text-muted mb-0">
                                Comprado el: {cupon.fechaCompra.toDate
                                  ? cupon.fechaCompra.toDate().toLocaleDateString("es-AR")
                                  : new Date(cupon.fechaCompra.seconds * 1000).toLocaleDateString("es-AR")}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                    {cupones.filter(c => c.usado).length === 0 && <p className="text-muted ms-3">No hay cupones usados.</p>}
                  </div>
                </div>
              </>
            )}
          </section>


        </div>
      </div>
    </section>
  );
};

export default Perfil;
