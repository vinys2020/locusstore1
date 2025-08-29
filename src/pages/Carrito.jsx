import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { db, auth } from "../config/firebase";
import {
  getDoc,
  doc,
  collection,
  addDoc,
  Timestamp,
  query,
  where,
  getDocs,
  setDoc,
  updateDoc,
  writeBatch
} from "firebase/firestore"; import { obtenerCuponesUsuario } from "../hooks/useCupones";
import HorizontalCarrito from "../components/HorizontalCarrito";
import { toast } from 'react-toastify';


import "./Carrito.css";

const Carrito = () => {
  const {
    cart,
    eliminarDelCarrito,
    disminuirCantidad,
    totalItems,
    totalPrecio,
    aplicarCupon,
    discount,
    telefonoUsuario,
    setTelefonoUsuario,
    agregarAlCarrito,
    vaciarCarrito,
  } = useContext(CartContext);

  const [usuario, setUsuario] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [metodoPago, setMetodoPago] = useState("");
  const [cupones, setCupones] = useState([]);
  const [cuponSeleccionado, setCuponSeleccionado] = useState(null);


  useEffect(() => {
    if (usuario?.uid) {
      obtenerCuponesUsuario(usuario.uid).then(setCupones);
    }
  }, [usuario]);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsuario({
        nombre: user.displayName,
        email: user.email,
        telefono: telefonoUsuario,
        uid: user.uid,

      });
    }
  }, [telefonoUsuario]);


  const handleSeleccionCupon = (e) => {
    const idCupon = e.target.value;
    const cupon = cupones.find(c => c.id === idCupon) || null;
    setCuponSeleccionado(cupon);
    aplicarCupon(cupon);
  };

  const marcarCuponComoUsado = async (codigoCupon) => {
    if (!usuario?.uid || !codigoCupon) return;

    try {
      const cuponDocRef = doc(
        db,
        `Usuariosid/${usuario.uid}/Cuponesid/${codigoCupon}`
      );
      await updateDoc(cuponDocRef, { usado: true });

      setCupones((prev) =>
        prev.map((c) =>
          c.id === codigoCupon
            ? { ...c, usado: true }
            : c
        )
      );

      if (cuponSeleccionado?.id === codigoCupon) {
        setCuponSeleccionado((c) => ({ ...c, usado: true }));
        aplicarCupon(null);
      }
    } catch (err) {
      console.error("Error al marcar cupón como usado:", err);
    }
  };

  const valorSelect = cuponSeleccionado ? cuponSeleccionado.id : "";

  const handleTelefonoChange = (e) => {
    setTelefonoUsuario(e.target.value);
  };


  const handleConfirmarTelefono = () => {
    if (!telefonoUsuario) {
      toast.error("Por favor ingresá tu número de teléfono para poder continuar con el pedido.", {
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } else if (telefonoUsuario.length < 6) {
      toast.error("El número de teléfono debe tener al menos 6 caracteres.", {
        autoClose: 3000,
        pauseOnHover: true,
        draggable: true,
      });
    } else {
      setStep(2);
    }
  };

  const registrarPedido = async () => {
    if (totalPrecio <= 0) {
      alert("El total del pedido debe ser mayor a $0 para confirmar.");
      return;
    }
    if (!usuario) {
      toast.info("Por favor, inicia sesión para realizar un pedido.", {
        onClose: () => {
          window.location.href = "/login";
        },
      });
      return;
    }
    if (!telefonoUsuario) {
      alert("Por favor, ingresa un número de teléfono válido.");
      setStep(1);
      return;
    }
    if (!metodoPago) {
      alert("Por favor, selecciona un método de pago.");
      setStep(2);
      return;
    }

    setIsLoading(true);

    try {

      const totalConDescuentoLocal = discount > 0 ? totalPrecio * (1 - discount / 100) : totalPrecio;
      const productosAFinalizar = [];

      for (const producto of cart) {
        const { id: productoId, categoriaId, cantidad, nombre } = producto;

        if (!categoriaId) {
          alert(`Falta categoriaId para el producto: ${nombre}`);
          setIsLoading(false);
          return;
        }

        if (productoId && cantidad > 0) {
          const docRef = doc(db, `Categoriasid/${categoriaId}/Productosid/${productoId}`);
          const docSnap = await getDoc(docRef);

          if (!docSnap.exists()) {
            alert(`Producto no encontrado: ${nombre}`);
            setIsLoading(false);
            return;
          }

          const data = docSnap.data();
          const stockActual = data.stock ?? 0;

          if (stockActual < cantidad) {
            alert(`No hay suficiente stock para el producto: ${nombre}`);
            setIsLoading(false);
            return;
          }

          productosAFinalizar.push({
            ref: docRef,
            stockActual,
            cantidad,
          });
        } else {
          console.warn("Faltan datos para verificar stock:", producto);
        }
      }

      const pedidoData = {
        cliente: {
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: telefonoUsuario,
          direccion: "Calle Ficticia 123",
          entrega: "takeaway",
          cupon: cuponSeleccionado ? cuponSeleccionado.nombre : null,
          descuento: discount,
        },
        estado: "pendiente",
        fecha: Timestamp.now(),
        metodopago: metodoPago,
        productos: cart.map((producto) => ({
          nombre: producto.nombre,
          cantidad: producto.cantidad,
          preciounitario: producto.precio,
          total: producto.precio * producto.cantidad,
        })),
        totalpedido: totalConDescuentoLocal,
      };

      await addDoc(collection(db, "Pedidosid"), pedidoData);

      const batch = writeBatch(db);

      productosAFinalizar.forEach(({ ref, stockActual, cantidad }) => {
        const nuevoStock = Math.max(0, stockActual - cantidad);
        batch.update(ref, { stock: nuevoStock });
      });

      await batch.commit();

      if (cuponSeleccionado && !cuponSeleccionado.usado) {
        await marcarCuponComoUsado(cuponSeleccionado.id);
      }

      const puntosGanados =
        totalConDescuento > 20000 ? 50 :
          totalConDescuento >= 10000 ? 25 : 0;

      
          const mensajePuntos =
          puntosGanados > 0
            ? `⭐ ¡Gracias por tu compra! Ganaste ${puntosGanados} puntos!! En breve te avisaremos cuando tu pedido esté listo. ¡Sumá más puntos y canjealos por descuentos de hasta el 30%! 🎁🔥`
            : `⭐ ¡Gracias por tu compra! Te avisaremos cuando tu pedido esté listo. Recorda que en compras mayores a $10.000 sumás puntos para canjear por descuentos de hasta el 30%. 🎁 ¡Aprovechá y empezá a ahorrar! 🎉`
  

      const usuariosCollection = collection(db, "Usuariosid");
      const q = query(usuariosCollection, where("email", "==", usuario.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usuarioDoc = querySnapshot.docs[0];
        const puntosPrevios = typeof usuarioDoc.data().puntos === "number"
          ? usuarioDoc.data().puntos
          : 0;
        const nuevosPuntos = puntosPrevios + puntosGanados;

        await setDoc(usuarioDoc.ref, { puntos: nuevosPuntos }, { merge: true });
      } else {
        console.warn(`No se encontró ningún documento en "Usuariosid" con email = ${usuario.email}.`);
      }

      vaciarCarrito();
      setStep(1);
      setMetodoPago("");
      setCuponSeleccionado(null);
      aplicarCupon("");
      setIsLoading(false);
      toast.success("Pedido confirmado" + mensajePuntos);


    } catch (error) {
      console.error("Error al registrar el pedido y sumar puntos:", error);
      alert("Hubo un problema al procesar tu pedido. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  const totalConDescuento = totalPrecio; 
  const descuentoMonetario = discount > 0 ? (totalPrecio * discount) / (100 - discount) : 0; 



  return (
    <section className="carrito-pagina">
      <div className="container p-2">
        <h2 className="carrito-titulo">Tu Carrito de Compras</h2>
        <p className="text-center mb-lg-5 mb-4">
          Revisa tus productos, ajusta cantidades, elige método de pago y confirma tu pedido.
        </p>

        {cart.length === 0 ? (
          <div className="carrito-vacio">
            <img
              src="https://res.cloudinary.com/dcggcw8df/image/upload/v1747783241/fzkloulqcyljutykpzmv.png"
              alt="Carrito vacío"
              style={{ width: "250px", height: "250px" }}
              className="mx-auto d-flex"
            />
            <h2 className="text-center">Tu carrito está vacío</h2>
            <p className="text-center">Agregá productos para comenzar tu compra.</p>
            <div className="d-flex justify-content-center">
              <a href="/categorias/Ofertasid" className="btn btn-primary">
                Ver productos
              </a>
            </div>
          </div>
        ) : (
          <>
            <div className="carrito-contenido">
              {cart.map((producto, i) => (
                <article key={i} className="carrito-item">
                  <img
                    src={producto.imagen}
                    alt={producto.nombre}
                    className="item-img"
                  />
                  <div className="item-detalles">
                    <h5 className="fs-6 line-clamp-2">{producto.nombre}</h5>
                    <p>
                      ${producto.precio} x {producto.cantidad} = $
                      {(producto.precio * producto.cantidad).toFixed(2)}
                    </p>

                    <div className="cantidad-controles">
                      <button
                        onClick={() => disminuirCantidad(producto.id)}
                        disabled={producto.cantidad <= 1}
                      >
                        −
                      </button>
                      <span>{producto.cantidad}</span>
                      <button onClick={() => agregarAlCarrito(producto)}>+</button>
                    </div>

                    <button
                      className="eliminar-btn"
                      onClick={() => eliminarDelCarrito(producto.id)}
                    >
                      Eliminar
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="steps-indicator mt-4">
              {[1, 2, 3].map((n) => (
                <React.Fragment key={n}>
                  <div className={`step-circle ${step === n ? "active" : ""}`}>{n}</div>
                  {n < 3 && <div className={`step-line ${step >= n + 1 ? "active" : ""}`}></div>}
                </React.Fragment>
              ))}
            </div>

            {step === 1 && (
              <div className="telefono-container mt-4 d-flex justify-content-center">
  <div className="telefono-inner" style={{ width: "100%", maxWidth: "500px" }}>
    <label htmlFor="telefono" className="form-label text-center d-block">
      Número de Teléfono
    </label>
    <input
      type="tel"
      id="telefono"
      placeholder="Tu número de teléfono"
      value={telefonoUsuario}
      onChange={handleTelefonoChange}
      className="form-control form-control-md"
    />
    <button
      onClick={handleConfirmarTelefono}
      className="btn btn-primary mt-3 w-100"
    >
      Confirmar Teléfono
    </button>
  </div>
</div>

            )}
            

            {step === 2 && (
              <div className="metodo-pago-container mt-4 d-flex justify-content-center">
                <div className="metodo-pago-inner">
                  <label htmlFor="metodoPago" className="form-label text-center d-block">
                    Selecciona un Método de Pago
                  </label>
                  <select
                    id="metodoPago"
                    value={metodoPago}
                    onChange={(e) => setMetodoPago(e.target.value)}
                    className="form-select form-select-md"
                  >
                    <option value="">Elige un método</option>
                    <option value="tarjeta">Tarjeta</option>
                    <option value="transferencia">Transferencia</option>
                    <option value="efectivo">Efectivo</option>
                  </select>
                  <button
                    onClick={() => {
                      if (!metodoPago) {
                        alert("Debes seleccionar un método de pago.");
                        return;
                      }
                      setStep(3);
                    }}
                    className="btn btn-success mt-3 w-100"
                  >
                    Confirmar Método de Pago
                  </button>
                </div>
              </div>
            )}


            {step === 3 && (
              <>
                <div className="order-summary p-3 border rounded bg-light">
                <h3 className="mb-3 fw-bold text-black">Resumen</h3>

<div className="user-info-summary mb-0">
  <div className="d-flex justify-content-between align-items-center mb-1">
    <span className="text-dark">Método de pago</span>
    <span className="text-primary text-capitalize">{metodoPago || "No seleccionado"}</span>
  </div>
  {usuario?.telefono && (
<div className="d-flex justify-content-between align-items-center mb-1">
<span className="fw-small">Teléfono</span>
<span className="text-primary">{usuario.telefono}</span>
</div>
)}

  <div className="d-flex justify-content-between align-items-center">
    <span className="fw-small text-dark">Entrega</span>
    <span className="text-primary fw-small">
      Retiro en local <i className="bi bi-bag-check"></i>
    </span>
  </div>
</div>

<hr className="bg-secondary" />

<h5 className="mb-1 mt-3 fw-bold text-black">Productos</h5>

                  {cart.map((producto, i) => (
                    <div
                      key={i}
                      className="order-item d-flex justify-content-between align-items-center py-2 border-bottom text-black"
                    >
                      <div>
                        <span className="fw-semibold">{producto.nombre}</span> x <span>{producto.cantidad}</span>
                      </div>
                      <div>
                        <span className="fw-semibold">
                          ${(producto.precio * producto.cantidad).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}

                  <hr className="my-3" />

                  <div className="coupon-section mb-3">
                    <label htmlFor="couponSelect" className="form-label text-black">
                    Cupón aplicado
                    </label>
                    <select
                      id="couponSelect"
                      value={cuponSeleccionado?.id || ""}
                      onChange={handleSeleccionCupon}
                      className="form-select"
                    >

                      <option value="">Elige un Cupón</option>
                      {cupones
                        .filter(c => !c.usado)
                        .map(c => (
                          <option key={c.id} value={c.id}>
                            {c.nombre} ({c.descuento}%)
                          </option>
                        ))
                      }
                    </select>
                    {cupones.filter(c => !c.usado).length === 0 && (
    <small className="text-muted mt-1 d-block">
      Actualmente no cuentas con cupones disponibles.
    </small>
  )}
                  </div>


                  {discount > 0 && (
                    <div className="total-summary d-flex justify-content-between align-items-center fs-6 fw-bold text-secondary  mb-2">
                      <span>Subtotal</span>
                      <span style={{ textDecoration: "line-through", color: "gray" }}>
                        ${(totalConDescuento + descuentoMonetario).toFixed(2)}
                      </span>
                    </div>
                  )}

                  {discount > 0 && (
                    <div className="discount-summary d-flex justify-content-between align-items-center text-success pb-2 border-bottom">
                      <span>Descuento aplicado</span>
                      <span>-${descuentoMonetario.toFixed(2)}</span>
                    </div>
                  )}



                  <hr className="my-2" />

                  <div className="total-summary d-flex justify-content-between align-items-center fs-5 fw-bold text-black mt-2">
                    <span>Total a Pagar</span>
                    <span>${totalConDescuento.toFixed(2)}</span>
                  </div>
                </div>
                <small>Revisa que tus datos sean correctos antes de confirmar</small>

                <button
                  className="btn btn-primary mt-3 w-100"
                  onClick={registrarPedido}
                  disabled={isLoading || totalPrecio <= 0}
                >
                  {isLoading ? "Procesando..." : "Realizar Pedido"}
                </button>

                <button
                  className="btn btn-danger mt-3 w-100"
                  onClick={() => {
                    if (window.confirm("¿Estás seguro que querés vaciar el carrito?")) {
                      vaciarCarrito();
                      setStep(1);
                      setIsOpen(false);
                    }
                  }}
                >
                  Vaciar carrito
                </button>
              </>
            )}
          </>
        )}

        <section id="servicios" className="mt-5">
          <div className="container-fluid px-0">
            <HorizontalCarrito />
          </div>
        </section>
      </div>
    </section>
  );
};

export default Carrito;
