import React, { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { FaShoppingCart, FaTimes } from "react-icons/fa";
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
} from "firebase/firestore";
import { obtenerCuponesUsuario } from "../hooks/useCupones";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { enviarMailPedido } from "./EmailJS";



import "./FloatingCart.css";

const FloatingCart = () => {
  const {
    cart,
    eliminarDelCarrito,
    disminuirCantidad,
    totalItems,
    totalPrecio,
    aplicarCupon,
    discount,
    agregarAlCarrito,
    vaciarCarrito,
    actualizarProducto,
  } = useContext(CartContext);

  const [isOpen, setIsOpen] = useState(false);
  const [usuario, setUsuario] = useState(null);
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [metodoPago, setMetodoPago] = useState("");
  const [cupones, setCupones] = useState([]);
  const [cuponSeleccionado, setCuponSeleccionado] = useState(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (!user) return;

      try {
        const userDocRef = doc(db, `usuarios/${user.uid}`);
        const userSnap = await getDoc(userDocRef);

        if (userSnap.exists()) {
          const userData = userSnap.data();
          setUsuario({
            nombre: userData.nombre || user.displayName || "",
            email: userData.email || user.email || "",
            uid: user.uid,
            telefono: userData.telefono || "",
            dni: userData.dni,
            gremio: userData.gremio,       // obligatorio
            organismo: userData.organismo, // obligatorio
            puntos: userData.puntos || 0,
          });
          if (userData.telefono) setTelefonoUsuario(userData.telefono);

        } else {
          console.log("Documento de usuario no existe");
        }
      } catch (err) {
        console.error("Error al traer usuario desde Firebase:", err);
      }

    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    if (usuario?.uid) {
      obtenerCuponesUsuario(usuario.uid)
        .then(setCupones)
        .catch(err => console.error("Error al obtener cupones:", err));
    }
  }, [usuario?.uid]);

  const renderProductos = () => {
    return cart.map(producto => {
      const metodo = producto.metodo || "contado";
      const cantidad = producto.cantidad || 1;
      const precioBase = producto.precio * cantidad;

      let infoCuota;
      let precioTotalConInteres = precioBase;

      if (metodo === "contado") {
        infoCuota = (
          <div>
            {`Total: $${precioBase.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            <br />
            <span style={{ fontSize: "1em", color: "green" }}>(en un pago)</span>
          </div>
        );
      } else if (metodo === "3cuotas") {
        precioTotalConInteres = precioBase * 1.15; // +15%
        const cuota = precioTotalConInteres / 3;
        infoCuota = (
          <div>
            {`Total: $${precioTotalConInteres.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            <br />
            <span style={{ fontSize: "1em", color: "green" }}>(3 cuotas de ${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
          </div>
        );
      } else if (metodo === "6cuotas") {
        precioTotalConInteres = precioBase * 1.30; // +30%
        const cuota = precioTotalConInteres / 6;
        infoCuota = (
          <div>
            {`Total: $${precioTotalConInteres.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`}
            <br />
            <span style={{ fontSize: "1em", color: "green" }}>(6 cuotas de ${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })})</span>
          </div>
        );
      }


      return (
        <div key={producto.id} className="cart-item border rounded d-flex align-items-center p-2">
          <img src={producto.imagenes?.[0] || producto.imagen} alt={producto.nombre} />
          <div className=" cart-item-details ">
            <h6 className="fw-bold">{producto.nombre}</h6>
            <small className="text-dark" style={{ fontSize: "1rem" }}>{infoCuota}</small>
          </div>
        </div>
      );
    });
  };






  const handleSeleccionCupon = (e) => {
    const idCupon = e.target.value;
    const cupon = cupones.find(c => c.id === idCupon) || null;
    setCuponSeleccionado(cupon);
    aplicarCupon(cupon);
  };

  const marcarCuponComoUsado = async (codigoCupon) => {
    if (!usuario?.uid || !codigoCupon) return;

    try {
      const cuponDocRef = doc(db, `usuarios/${usuario.uid}/cuponesid/${codigoCupon}`);
      await updateDoc(cuponDocRef, { usado: true });

      setCupones(prev =>
        prev.map(c => c.id === codigoCupon ? { ...c, usado: true } : c)
      );

      if (cuponSeleccionado?.id === codigoCupon) {
        setCuponSeleccionado(null);
        aplicarCupon(null);
      }
    } catch (err) {
      console.error("Error al marcar cupón como usado:", err);
    }
  };

  const totalConDescuento = discount > 0 ? totalPrecio * (1 - discount / 100) : totalPrecio;
  const descuentoMonetario = discount > 0 ? totalPrecio - totalConDescuento : 0;

  const handleMetodoPagoChange = (e) => setMetodoPago(e.target.value);

const registrarPedido = async () => {
  if (totalPrecio <= 0) {
    alert("Paso 0: Total del pedido <= 0");
    return;
  }

  const uid = auth.currentUser.uid;


  // ✅ Validamos que el usuario esté logueado y tenga UID
  if (!usuario || !usuario.uid) {
    toast.info("Por favor, inicia sesión para realizar un pedido.", {
      onClose: () => (window.location.href = "/login"),
    });
    return;
  }

  try {
    setIsLoading(true);

    const productosAFinalizar = [];

    for (const producto of cart) {
      const { id: productoId, categoriaId, cantidad, nombre } = producto;

      if (!categoriaId) {
        setIsLoading(false);
        return;
      }

      const docRef = doc(db, `categorias/${categoriaId}/Productosid/${productoId}`);
      const docSnap = await getDoc(docRef);

      if (!docSnap.exists()) {
        setIsLoading(false);
        return;
      }

      const stockActual = docSnap.data().stock ?? 0;
      if (stockActual < cantidad) {
        alert(`Paso 6: No hay suficiente stock para: ${nombre}`);
        setIsLoading(false);
        return;
      }

      productosAFinalizar.push({ ref: docRef, stockActual, cantidad });
    }

    // Calculamos el total incluyendo cuotas
    let totalConInteres = cart.reduce((acc, p) => {
      const cantidad = p.cantidad || 1;
      let total = p.precio * cantidad;
      if (p.metodo === "3cuotas") total *= 1.15;
      if (p.metodo === "6cuotas") total *= 1.30;
      return acc + total;
    }, 0);

    // Aplicamos descuento si hay cupón
    const totalFinalConDescuento =
      discount > 0
        ? +(totalConInteres * (1 - discount / 100)).toFixed(2)
        : +totalConInteres.toFixed(2);

    const pedidoData = {
      userId: auth.currentUser.uid, // ✅ importante: debe coincidir con el UID autenticado
      Cliente: {  
        nombre: usuario.nombre,
        email: usuario.email,
        telefono: usuario.telefono,
        dni: usuario.dni,
        gremio: usuario.gremio,
        organismo: usuario.organismo,
        direccion: "Calle Ficticia 123",
        cupon: cuponSeleccionado ? cuponSeleccionado.nombre : null,
        descuento: discount,
      },
      estado: "pendiente",
      fecha: Timestamp.now(),
      metodopago: metodoPago,
      estadoPago: "pendiente",
      cuotasTotales: (() => {
        if (cart.some(p => p.metodo === "6cuotas")) return 6;
        if (cart.some(p => p.metodo === "3cuotas")) return 3;
        return 1;
      })(),
      cuotasPagadas: [],
      montoTotal: totalFinalConDescuento,
      montoRestante: cart
        .filter(p => p.metodo && p.metodo !== "contado")
        .reduce((acc, p) => {
          const cantidad = p.cantidad || 1;
          let totalProducto = p.precio * cantidad;

          if (p.metodo === "3cuotas") totalProducto *= 1.15;
          if (p.metodo === "6cuotas") totalProducto *= 1.30;

          return acc + totalProducto;
        }, 0),
      productos: cart.map(p => {
        const cantidad = p.cantidad || 1;
        const precioBase = p.precio * cantidad;
        let totalConInteres = precioBase;
        let descripcionPago = "contado";

        if (p.metodo === "3cuotas") {
          totalConInteres = +(precioBase * 1.15).toFixed(2);
          const cuota = +(totalConInteres / 3).toFixed(2);
          descripcionPago = `3 cuotas de $${cuota.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}`;
        } else if (p.metodo === "6cuotas") {
          totalConInteres = +(precioBase * 1.30).toFixed(2);
          const cuota = +(totalConInteres / 6).toFixed(2);
          descripcionPago = `6 cuotas de $${cuota.toLocaleString("es-AR", {
            minimumFractionDigits: 2,
          })}`;
        }

        return {
          nombre: p.nombre,
          cantidad,
          preciounitario: +p.precio.toFixed(2),
          total: totalConInteres,
          metodo: p.metodo || "contado",
          descripcionPago,
          imagenUrl: p.imagenes?.[0] || p.imagen,
        };
      }),
      totalpedido: totalFinalConDescuento,
    };

    // ✅ Crear el pedido con el UID correcto
    const docRef = await addDoc(collection(db, "pedidos"), pedidoData);
    pedidoData.id = docRef.id;

    const batch = writeBatch(db);
    productosAFinalizar.forEach(({ ref, stockActual, cantidad }) => {
      batch.update(ref, { stock: Math.max(0, stockActual - cantidad) });
    });
    await batch.commit();

    if (cuponSeleccionado && !cuponSeleccionado.usado) {
      await marcarCuponComoUsado(cuponSeleccionado.id);
    }

    vaciarCarrito();
    setIsOpen(false);
    setStep(1);
    setMetodoPago("");
    setCuponSeleccionado(null);
    aplicarCupon(null);
    setIsLoading(false);

    try {
      await enviarMailPedido(pedidoData);
      console.log("Correo enviado al administrador correctamente.");
    } catch (err) {
      console.error("Error al enviar el correo:", err);
    }

    toast.success("✅ ¡Pedido confirmado con éxito! Gracias por tu compra.");
  } catch (err) {
    console.error(err);
    toast.error("Hubo un error al procesar el pedido.");
    setIsLoading(false);
    alert(`Error detectado: ${err.message}`);
  }
};



  return (
    <>
      <div className="floating-cart-icon" onClick={() => setIsOpen(true)}>
        <FaShoppingCart size={24} />
        <span className="cart-count mt-2 mx-2">{totalItems}</span>
      </div>

      {isOpen && (
        <div className="cart-modal">
          <div className="cart-modal-header">
            <h5>Tu Carrito</h5>
            <button className="close-btn p-1" onClick={() => setIsOpen(false)}>
              <FaTimes size={23} />
            </button>
          </div>

          <div className="cart-modal-body">
            {cart.length === 0 ? (
              <div className="empty-cart-container">
                <img
                  src="https://res.cloudinary.com/dcggcw8df/image/upload/v1747783241/fzkloulqcyljutykpzmv.png"
                  alt="Carrito vacío"
                  className="empty-cart-image"
                  style={{ width: "100px", height: "100px" }}
                />
                <h2 className="empty-cart-title">Tu carrito está vacío</h2>
                <p className="empty-cart-text">Agregá productos para comenzar a generar tu presupuesto.</p>
                <a href="/categorias/Ofertasid" className="empty-cart-button">Ver productos</a>
              </div>
            ) : (
              <>


                {/* Paso 1: Lista de productos */}
                {step === 1 && cart.map(producto => {
                  const metodo = producto.metodo || "contado";
                  const cantidad = producto.cantidad || 1;
                  const precioTotal = producto.precio * cantidad;

                  let infoCuota = metodo === "contado"
                    ? `en un pago: ${precioTotal.toLocaleString("es-AR", { style: "currency", currency: "ARS", minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
                    : metodo === "3cuotas"
                      ? (() => {
                        const precioConInteres = precioTotal * 1.15; // ✅ 15% de interés
                        return `en 3 cuotas de ${(precioConInteres / 3).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`;
                      })()
                      : (() => {
                        const precioConInteres = precioTotal * 1.30; // ✅ 30% de interés
                        return `en 6 cuotas de ${(precioConInteres / 6).toLocaleString("es-AR", {
                          style: "currency",
                          currency: "ARS",
                          minimumFractionDigits: 2,
                          maximumFractionDigits: 2
                        })}`;
                      })();




                  return (
                    <div key={producto.id} className="cart-item">
                      <img
                        src={producto.imagenes?.[0] || producto.imagen}
                        alt={producto.nombre}
                      />
                      <div className=" cart-item-details">
                        {/* Nombre del producto */}
                        <h6 className="mb-2"><strong>{producto.nombre}</strong></h6>


                        {/* Selección de método de pago */}
                        <small className="mb-0">Selecciona método de pago</small>
                        <small className="text-success">{infoCuota}</small>
                        <select
                          className="form-select form-select-sm mt-1"
                          value={metodo}
                          onChange={(e) => actualizarProducto(producto.id, { metodo: e.target.value })}
                        >
                          <option value="contado">Contado</option>
                          <option value="3cuotas">3 Cuotas</option>
                          <option value="6cuotas">6 Cuotas</option>
                        </select>

                        {/* Cantidad del producto */}
                        <div className="cart-item-quantity mt-2 d-flex align-items-center gap-2">
                          <button
                            onClick={() => disminuirCantidad(producto.id)}
                            disabled={producto.cantidad <= 1}
                            className="quantity-btn"
                          >
                            -
                          </button>
                          <span>{producto.cantidad}</span>
                          <button
                            onClick={() => agregarAlCarrito(producto)}
                            className="quantity-btn"
                          >
                            +
                          </button>
                        </div>

                        {/* Stock disponible */}
                        {producto.stock !== undefined && (
                          <small
                            className={`d-block mt-1 ${producto.stock <= 5 ? "text-danger fw-bold" : "text-muted"}`}
                            style={{ fontSize: "0.85rem" }}
                          >
                            Stock disponible: {producto.stock}
                          </small>
                        )}

                        {/* Botón eliminar */}
                        <button
                          className="remove-item mt-2"
                          onClick={() => eliminarDelCarrito(producto.id)}
                        >
                          Eliminar
                        </button>
                      </div>

                    </div>
                  );
                })}
                <div className="steps-indicator d-flex align-items-center mb-3">
                  <div className={`step-circle ${step === 1 ? "active" : ""}`}>1</div>
                  <div className={`step-line ${step >= 2 ? "active" : ""}`}></div>
                  <div className={`step-circle ${step === 2 ? "active" : ""}`}>2</div>
                  <div className={`step-line ${step >= 3 ? "active" : ""}`}></div>
                  <div className={`step-circle ${step === 3 ? "active" : ""}`}>3</div>
                </div>

                {step === 1 && cart.length > 0 && (
                  <>
                    <h6 className="mb-2 text-center">Selecciona la cantidad y el método de compra para cada producto</h6>
                    <button
                      className="btn btn-primary mt-3 w-100"
                      onClick={() => setStep(2)}
                    >
                      Continuar Compra
                    </button>
                  </>
                )}


                {step === 2 && (
                  <div className="metodo-pago-container mt-4">
                    {renderProductos()} {/* Aquí se muestran los productos */}

                    <div className="mb-3">
                      <label htmlFor="metodoPago" className="form-label">Selecciona un Método de Pago</label>
                      <select id="metodoPago" value={metodoPago} onChange={handleMetodoPagoChange} className="form-select form-select-lg">
                        <option value="">Elige un método</option>
                        <option value="Descuento Por Planilla">Descuento por Planilla</option>
                        <option value="Otros">Otros</option>
                      </select>
                    </div>
                    <div className="d-flex gap-2">
                      <button className="btn btn-secondary flex-fill" onClick={() => setStep(1)}>Volver Atras</button>
                      <button className="btn btn-success flex-fill" onClick={() => setStep(3)} disabled={!metodoPago}>Ir a ver el Resumen</button>
                    </div>
                  </div>
                )}




                {step === 3 && cart.length > 0 && (
                  <>
                    <div className="order-summary p-3 border rounded bg-light">
                      <h3 className="mb-3 fw-bold">Resumen</h3>
                      <hr className="bg-dark" />

                      {/* Datos del comprador */}
                      <div className="user-info-summary mb-3 p-2 bg-light">
                        <h6 className="fw-bold mb-2">Datos del Comprador</h6>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Nombre:</span>
                          <span className="fw-semibold">{usuario?.nombre || auth.currentUser?.displayName || "No disponible"}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Email:</span>
                          <span className="fw-semibold">{usuario?.email || auth.currentUser?.email || "No disponible"}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Teléfono:</span>
                          <span className="fw-semibold">{telefonoUsuario || usuario?.telefono || "No disponible"}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">DNI:</span>
                          <span className="fw-semibold">{usuario?.dni || "No disponible"}</span>
                        </div>

                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Gremio:</span>
                          <span className="fw-semibold">{usuario?.gremio}</span>
                        </div>
                        <div className="d-flex justify-content-between mb-1">
                          <span className="text-muted">Organismo:</span>
                          <span className=" mx-2 fw-semibold">{usuario?.organismo}</span>
                        </div>
                        <hr className="bg-dark" />
                        <div className="d-flex justify-content-between mb-0 pt-2 align-items-center">
                          <span className="fw-semibold text-dark" style={{ fontSize: "0.95rem" }}>
                            Método de pago:
                          </span>
                          <span className="text-primary fw-bold text-capitalize" style={{ fontSize: "0.95rem" }}>
                            {metodoPago || "No seleccionado"}
                          </span>
                        </div>

                      </div>

                      <hr className="bg-dark" />


                      <h5 className="mb-1 mt-3 fw-bold">Productos</h5>
                      {cart.map(producto => {
                        const cantidad = producto.cantidad || 1;
                        const precioBase = producto.precio * cantidad;
                        let totalProducto = precioBase;
                        let infoCuota = "contado";

                        if (producto.metodo === "3cuotas") {
                          totalProducto = precioBase * 1.15;
                          const cuota = (totalProducto / 3).toFixed(2);
                          infoCuota = `en 3 cuotas de $${cuota}`;
                        } else if (producto.metodo === "6cuotas") {
                          totalProducto = precioBase * 1.30;
                          const cuota = (totalProducto / 6).toFixed(2);
                          infoCuota = `en 6 cuotas de $${cuota}`;
                        }

                        return (
                          <div key={producto.id} className="order-item d-flex justify-content-between align-items-center border-bottom py-2">
                            <div>
                              <span className="fw-small">{producto.nombre}</span> x <span>{producto.cantidad}U</span>
                              <small className="d-block text-muted">{infoCuota}</small>
                            </div>
                            <div>
                              <span
                                className="fw-semibold text-start m-auto mx-3"
                                style={{ display: "inline-block", width: "80px" }}
                              >
                                {totalProducto.toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>

                            </div>
                          </div>
                        );
                      })}

                      <hr className="my-3" />

                      <div className="coupon-section mb-3 mt-3">
                        <label htmlFor="couponSelect" className="form-label">Cupón aplicado</label>
                        <select
                          id="couponSelect"
                          value={cuponSeleccionado?.id || ""}
                          onChange={handleSeleccionCupon}
                          className="form-select"
                        >
                          <option value="">Elige un Cupón</option>
                          {cupones.filter(c => !c.usado).map(c => (
                            <option key={c.id} value={c.id}>
                              {c.nombre} ({c.descuento}%)
                            </option>
                          ))}
                        </select>

                        {cupones.filter(c => !c.usado).length === 0 && (
                          <small className="text-muted mt-1 d-block">
                            Actualmente no cuentas con cupones disponibles.
                          </small>
                        )}
                      </div>

                      {/* Totales */}
                      {(() => {
                        const totalConInteres = cart.reduce((acc, p) => {
                          const cantidad = p.cantidad || 1;
                          let total = p.precio * cantidad;
                          if (p.metodo === "3cuotas") total *= 1.15;
                          if (p.metodo === "6cuotas") total *= 1.30;
                          return acc + total;
                        }, 0);
                        const totalConDescuentoFinal = discount > 0 ? totalConInteres * (1 - discount / 100) : totalConInteres;
                        const descuentoMonetarioFinal = totalConInteres - totalConDescuentoFinal;

                        return (
                          <>
                            {discount > 0 && (
                              <div className="total-summary d-flex justify-content-between align-items-center fs-6 fw-bold text-secondary mb-2">
                                <span>Subtotal</span>
                                <span style={{ textDecoration: "line-through", color: "gray" }}>
                                  {totalConInteres.toLocaleString("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </span>
                              </div>
                            )}
                            {discount > 0 && (
                              <div className="discount-summary d-flex justify-content-between align-items-center text-success pb-2 border-bottom">
                                <span>Descuento aplicado</span>
                                <span>
                                  -
                                  {descuentoMonetarioFinal.toLocaleString("es-AR", {
                                    style: "currency",
                                    currency: "ARS",
                                    minimumFractionDigits: 2,
                                    maximumFractionDigits: 2
                                  })}
                                </span>
                              </div>
                            )}
                            <div className="total-summary d-flex justify-content-between align-items-center fs-5 fw-bold text-black mt-2">
                              <span>Total a Pagar</span>
                              <span>
                                {totalConDescuentoFinal.toLocaleString("es-AR", {
                                  style: "currency",
                                  currency: "ARS",
                                  minimumFractionDigits: 2,
                                  maximumFractionDigits: 2
                                })}
                              </span>
                            </div>
                          </>

                        );
                      })()}

                    </div>

                    <div className="d-flex gap-2 mt-3">
                      <button className="btn btn-secondary flex-fill" onClick={() => setStep(2)}>Volver Atras</button>
                      <button className="btn btn-primary flex-fill" onClick={registrarPedido} disabled={isLoading || totalPrecio <= 0}>
                        {isLoading ? "Procesando..." : "Realizar Pedido"}
                      </button>
                    </div>

                    <button className="btn btn-danger mt-2 w-100" onClick={() => { vaciarCarrito(); setStep(1); setIsOpen(false); }}>
                      Vaciar Carrito
                    </button>
                  </>
                )}

              </>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default FloatingCart;
