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
} from "firebase/firestore";
import { obtenerCuponesUsuario } from "../hooks/useCupones";
import HorizontalCarrito from "../components/HorizontalCarrito";
import { toast } from "react-toastify";

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

  useEffect(() => {
    if (usuario?.uid) {
      obtenerCuponesUsuario(usuario.uid).then(setCupones);
    }
  }, [usuario]);

  const handleSeleccionCupon = (e) => {
    const idCupon = e.target.value;
    const cupon = cupones.find(c => c.id === idCupon) || null;
    setCuponSeleccionado(cupon);
    aplicarCupon(cupon);
  };

  const marcarCuponComoUsado = async (codigoCupon) => {
    if (!usuario?.uid || !codigoCupon) return;

    try {
      const cuponDocRef = doc(db, `Usuariosid/${usuario.uid}/Cuponesid/${codigoCupon}`);
      await updateDoc(cuponDocRef, { usado: true });

      setCupones(prev =>
        prev.map(c => (c.id === codigoCupon ? { ...c, usado: true } : c))
      );

      if (cuponSeleccionado?.id === codigoCupon) {
        setCuponSeleccionado(c => ({ ...c, usado: true }));
        aplicarCupon(null);
      }
    } catch (err) {
      console.error("Error al marcar cupón como usado:", err);
    }
  };

  const handleTelefonoChange = (e) => setTelefonoUsuario(e.target.value);

  const handleConfirmarTelefono = () => {
    if (!telefonoUsuario || telefonoUsuario.length < 6) {
      toast.error("Ingresá un número de teléfono válido.", { autoClose: 3000 });
    } else {
      setStep(2);
    }
  };

  const registrarPedido = async () => {
    if (totalPrecio <= 0 || !usuario || !telefonoUsuario || !metodoPago) {
      toast.error("Completa todos los datos para continuar.", { autoClose: 3000 });
      return;
    }

    setIsLoading(true);

    try {
      const totalConDescuentoLocal = discount > 0 ? totalPrecio * (1 - discount / 100) : totalPrecio;
      const productosAFinalizar = [];

      for (const producto of cart) {
        const { id: productoId, categoriaId, cantidad, nombre } = producto;
        if (!categoriaId) throw new Error(`Falta categoriaId para ${nombre}`);

        const docRef = doc(db, `Categoriasid/${categoriaId}/Productosid/${productoId}`);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) throw new Error(`Producto no encontrado: ${nombre}`);

        const stockActual = docSnap.data().stock ?? 0;
        if (stockActual < cantidad) throw new Error(`No hay suficiente stock: ${nombre}`);

        productosAFinalizar.push({ ref: docRef, stockActual, cantidad });
      }

      const pedidoData = {
        cliente: {
          nombre: usuario.nombre,
          email: usuario.email,
          telefono: telefonoUsuario,
          direccion: "Retiro en local",
          cupon: cuponSeleccionado ? cuponSeleccionado.nombre : null,
          descuento: discount,
        },
        estado: "pendiente",
        fecha: Timestamp.now(),
        metodopago: metodoPago,
        productos: cart.map(p => ({
          nombre: p.nombre,
          cantidad: p.cantidad,
          preciounitario: p.precio,
          total: p.precio * p.cantidad,
        })),
        totalpedido: totalConDescuentoLocal,
      };

      await addDoc(collection(db, "Pedidosid"), pedidoData);

      const batch = writeBatch(db);
      productosAFinalizar.forEach(({ ref, stockActual, cantidad }) => {
        batch.update(ref, { stock: Math.max(0, stockActual - cantidad) });
      });
      await batch.commit();

      if (cuponSeleccionado && !cuponSeleccionado.usado) await marcarCuponComoUsado(cuponSeleccionado.id);

      const puntosGanados = totalConDescuentoLocal >= 20000 ? 50 : totalConDescuentoLocal >= 10000 ? 25 : 0;

      const usuariosCollection = collection(db, "Usuariosid");
      const q = query(usuariosCollection, where("email", "==", usuario.email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const usuarioDoc = querySnapshot.docs[0];
        const nuevosPuntos = (usuarioDoc.data().puntos ?? 0) + puntosGanados;
        await setDoc(usuarioDoc.ref, { puntos: nuevosPuntos }, { merge: true });
      }

      vaciarCarrito();
      setStep(1);
      setMetodoPago("");
      setCuponSeleccionado(null);
      aplicarCupon("");
      setIsLoading(false);

      toast.success(
        puntosGanados > 0
          ? `⭐ ¡Gracias por tu compra! Ganaste ${puntosGanados} puntos.`
          : `⭐ ¡Gracias por tu compra! Retiro en local confirmado.`
      );
    } catch (error) {
      console.error(error);
      toast.error("Error procesando el pedido. Intenta nuevamente.");
      setIsLoading(false);
    }
  };

  const descuentoMonetario = discount > 0 ? (totalPrecio * discount) / 100 : 0;
  const totalConDescuento = discount > 0 ? totalPrecio - descuentoMonetario : totalPrecio;

  return (
    <section className="carrito-pagina py-4">
      <div className="container">
        <h1 className="text-center mb-4 fs-bold">Tu Carrito de Compras</h1>

        {cart.length === 0 ? (
          <div className="text-center py-5">
            <img
              src="https://res.cloudinary.com/dcggcw8df/image/upload/v1747783241/fzkloulqcyljutykpzmv.png"
              alt="Carrito vacío"
              style={{ width: "200px" }}
              className="mb-3"
            />
            <h4>Tu carrito está vacío</h4>
            <p>Agrega productos para comenzar a generar tu presupuesto.</p>
            <a href="/categorias/Ofertasid" className="btn btn-primary">Ver productos</a>
          </div>
        ) : (
          <>
            {/* Lista de productos */}
            <div className="row">
              {cart.map((producto, i) => (
                <div key={i} className="col-12 mb-3 d-flex align-items-center border rounded p-2">
                  <img src={producto.imagen} alt={producto.nombre} className="img-fluid me-3" style={{ width: "80px", height: "80px" }} />
                  <div className="flex-grow-1">
                    <h6>{producto.nombre}</h6>
                    <p>${producto.precio} x {producto.cantidad} = ${(producto.precio * producto.cantidad).toFixed(2)}</p>
                    <div className="d-flex align-items-center mb-2">
                      <button className="btn btn-sm btn-outline-secondary me-2" onClick={() => disminuirCantidad(producto.id)} disabled={producto.cantidad <= 1}>−</button>
                      <span>{producto.cantidad}</span>
                      <button className="btn btn-sm btn-outline-secondary ms-2" onClick={() => agregarAlCarrito(producto)}>+</button>
                    </div>
                    <button className="btn btn-sm btn-danger" onClick={() => eliminarDelCarrito(producto.id)}>Eliminar</button>
                  </div>
                </div>
              ))}
            </div>

            {/* Paso 1: Teléfono */}
            {step === 1 && (
              <div className="my-4">
                <label>Teléfono</label>
                <input
                  type="tel"
                  className="form-control mb-2"
                  placeholder="Tu número"
                  value={telefonoUsuario}
                  onChange={handleTelefonoChange}
                />
                <button className="btn btn-primary w-100" onClick={handleConfirmarTelefono}>Confirmar Teléfono</button>
              </div>
            )}

            {/* Paso 2: Método de pago */}
            {step === 2 && (
              <div className="my-4">
                <label>Método de Pago</label>
                <select className="form-select mb-2" value={metodoPago} onChange={(e) => setMetodoPago(e.target.value)}>
                  <option value="">Selecciona</option>
                  <option value="tarjeta">Tarjeta</option>
                  <option value="transferencia">Transferencia</option>
                  <option value="efectivo">Efectivo</option>
                </select>
                <button className="btn btn-success w-100" onClick={() => setStep(3)}>Confirmar Método de Pago</button>
              </div>
            )}

            {/* Paso 3: Resumen */}
            {step === 3 && (
              <div className="my-4">
                <h5>Resumen del Pedido</h5>
                <p>Teléfono: {usuario.telefono}</p>
                <p>Método de pago: {metodoPago}</p>

                <div className="mb-3">
                  {cart.map((p, i) => (
                    <div key={i} className="d-flex justify-content-between">
                      <span>{p.nombre} x {p.cantidad}</span>
                      <span>${(p.precio * p.cantidad).toFixed(2)}</span>
                    </div>
                  ))}
                </div>

                {/* Cupones */}
                <div className="mb-3">
                  <label>Cupones</label>
                  <select className="form-select" value={cuponSeleccionado?.id || ""} onChange={handleSeleccionCupon}>
                    <option value="">Elige un cupón</option>
                    {cupones.filter(c => !c.usado).map(c => (
                      <option key={c.id} value={c.id}>{c.nombre} ({c.descuento}%)</option>
                    ))}
                  </select>
                </div>

                {discount > 0 && (
                  <div className="mb-2 d-flex justify-content-between text-success">
                    <span>Descuento</span>
                    <span>-${descuentoMonetario.toFixed(2)}</span>
                  </div>
                )}

                <div className="mb-3 d-flex justify-content-between fw-bold">
                  <span>Total a pagar</span>
                  <span>${totalConDescuento.toFixed(2)}</span>
                </div>

                <button className="btn btn-primary w-100 mb-2" onClick={registrarPedido} disabled={isLoading}>
                  {isLoading ? "Procesando..." : "Realizar Pedido"}
                </button>

                <button className="btn btn-danger w-100" onClick={() => {
                  if (window.confirm("¿Vaciar carrito?")) vaciarCarrito();
                }}>Vaciar Carrito</button>
              </div>
            )}
          </>
        )}

        <HorizontalCarrito />
      </div>
    </section>
  );
};

export default Carrito;
