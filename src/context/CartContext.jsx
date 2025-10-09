import React, { createContext, useState, useEffect } from "react";
import {
  getFirestore,
  collection,
  getDocs,
  doc,
  getDoc,
  runTransaction,
  updateDoc,
  addDoc,             // ✅ falta
  serverTimestamp     // ✅ falta
} from "firebase/firestore";
import { getApp } from "firebase/app";

export const CartContext = createContext();

export const CartProvider = ({ children, userId }) => {
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [telefonoUsuario, setTelefonoUsuario] = useState("");
  const [cuponesUsuario, setCuponesUsuario] = useState([]);
  const app = getApp();
  const db = getFirestore(app);

  const [loadingCupones, setLoadingCupones] = useState(true);

  const registrarPedido = async (clienteFormulario, metodoPago = "Contado") => {
    if (!cart.length) throw new Error("El carrito está vacío");

    const stockDisponible = await verificarStockDisponible();
    if (!stockDisponible) throw new Error("No hay suficiente stock para uno o más productos");

    const pedido = {
      userId: userId, // usar prop recibida
      Cliente: {
        nombre: clienteFormulario.nombre || "",
        email: clienteFormulario.email || "",
        telefono: clienteFormulario.telefono || "",
        dni: clienteFormulario.dni || "",
        gremio: clienteFormulario.gremio || "",
        organismo: clienteFormulario.organismo || "",
        cupon: coupon?.codigo || null,
      },
      productos: cart.map((p) => ({
        id: p.id,
        nombre: p.nombre || p.descripcion,
        cantidad: p.cantidad,
        preciounitario: Number(p.precio || 0),
        total: Number((p.cantidad * (p.precio || 0)).toFixed(2)),
        metodopago: p.metodo || metodoPago,
      })),
      subtotal: calcularSubtotal(),
      totalpedido: calcularTotal(),
      descuento: calcularDescuentoMonetario(),
      metodopago: metodoPago,
      estado: "pendiente",
      fecha: serverTimestamp(),
    };

    try {
      await descontarStock();
      const pedidosCol = collection(db, "pedidos");
      const docRef = await addDoc(pedidosCol, pedido);
      if (coupon) await marcarCuponComoUsado(coupon.codigo);
      setCart([]);
      return docRef.id;
    } catch (error) {
      console.error("Error al registrar pedido:", error);
      throw error;
    }
  };



  useEffect(() => {
    const storedCart = localStorage.getItem("cart");
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (!userId) return;

    const cargarCupones = async () => {
      setLoadingCupones(true);
      try {
        const cuponesCol = collection(db, `Usuariosid/${userId}/cuponesid`);
        const cuponesSnapshot = await getDocs(cuponesCol);
        const cupones = cuponesSnapshot.docs.map(doc => {
          const data = doc.data();
          return {
            codigo: doc.id.toUpperCase(),
            descuento: data.descuento || 0,
            usado: data.usado || false,
          };
        });
        setCuponesUsuario(cupones);
      } catch (error) {
        console.error("Error al cargar cupones:", error);
        setCuponesUsuario([]);
      } finally {
        setLoadingCupones(false);
      }
    };

    cargarCupones();
  }, [userId, db]);



  const marcarCuponComoUsado = async (codigoCupon) => {
    if (!userId || !codigoCupon) return;

    try {
      const cuponDocRef = doc(db, `Usuariosid/${userId}/cuponesid/${codigoCupon.toLowerCase()}`);
      await updateDoc(cuponDocRef, { usado: true });

      setCuponesUsuario((prevCupones) =>
        prevCupones.map((c) =>
          c.codigo === codigoCupon.toUpperCase() ? { ...c, usado: true } : c
        )
      );

      if (coupon && coupon.codigo === codigoCupon.toUpperCase()) {
        setCoupon({ ...coupon, usado: true });
        setDiscount(0);
      }
    } catch (error) {
      console.error("Error al marcar cupón como usado:", error);
    }
  };


  const obtenerCategoriaId = (producto) => {
    const categoria =
      producto.categoriaId ||
      producto.categoriasId ||
      producto.categoria ||
      producto.categorias ||
      producto.categoryId ||
      producto.CategoryId ||
      null;

    if (!categoria) {
      console.error(`⚠️ Producto sin categoría: ${producto.descripcion || producto.nombre || producto.id}`);
      return null;
    }

    return categoria;
  };


  const agregarAlCarrito = (producto, categoriaId) => {
    const productoConCategoria = { ...producto, categoriaId };

    setCart((prevCart) => {
      const productoExistente = prevCart.find((p) => p.id === producto.id);
      if (productoExistente) {
        return prevCart.map((p) =>
          p.id === producto.id ? { ...p, cantidad: p.cantidad + 1 } : p
        );
      } else {
        return [...prevCart, { ...productoConCategoria, cantidad: 1 }];
      }
    });
  };



  const eliminarDelCarrito = (productoId) => {
    setCart((prevCart) => prevCart.filter((p) => p.id !== productoId));
  };

  const disminuirCantidad = (productoId) => {
    setCart((prevCart) =>
      prevCart
        .map((p) =>
          p.id === productoId ? { ...p, cantidad: p.cantidad - 1 } : p
        )
        .filter((p) => p.cantidad > 0)
    );
  };

  const vaciarCarrito = () => {
    setCart([]);
  };

  const aplicarCupon = (cupon) => {
    if (!cupon || cupon.usado) {
      setDiscount(0);
      setCoupon(null);
      return;
    }
    setDiscount(cupon.descuento);
    setCoupon(cupon);
  };

  const calcularSubtotal = () => {
    const subtotal = cart.reduce((acc, p) => acc + p.cantidad * Number(p.precio || 0), 0);
    return parseFloat(subtotal.toFixed(2));
  };

  const calcularTotal = () => {
    const subtotal = calcularSubtotal();
    if (discount > 0) {
      const totalConDescuento = subtotal * (1 - discount / 100);
      return parseFloat(totalConDescuento.toFixed(2));
    }
    return subtotal;
  };


  const calcularDescuentoMonetario = () => {
    const subtotal = calcularSubtotal();
    const total = calcularTotal();
    const descuento = subtotal - total;
    return parseFloat(descuento.toFixed(2));
  };



  const totalItems = cart.reduce((acc, p) => acc + p.cantidad, 0);

  const verificarStockDisponible = async () => {
    try {
      const checks = await Promise.all(cart.map(async (item) => {
        if (!item.categoriaId) {
          console.warn(`Falta categoriaId para el producto: ${item.descripcion || item.id}`);
          return false;
        }
        const productoDocRef = doc(db, `categorias/${item.categoriaId}/Productosid/${item.id}`);
        const productoSnap = await getDoc(productoDocRef);
        if (!productoSnap.exists()) {
          console.warn(`Producto no encontrado en Firebase: ${item.id}`);
          return false;
        }
        const data = productoSnap.data();
        return data.stock >= item.cantidad;
      }));
      return checks.every(Boolean);
    } catch (error) {
      console.error("Error al verificar stock:", error);
      return false;
    }
  };

  // Dentro de CartProvider
  const actualizarProducto = (id, cambios) => {
    setCart((prevCart) =>
      prevCart.map((p) => (p.id === id ? { ...p, ...cambios } : p))
    );
  };


  const descontarStock = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        for (const item of cart) {
          if (!item.categoriaId) continue;

          const productoDocRef = doc(db, `categorias/${item.categoriaId}/Productosid/${item.id}`);
          const productoDoc = await transaction.get(productoDocRef);

          if (!productoDoc.exists()) {
            throw new Error(`Producto no existe: ${item.id}`);
          }

          const stockActual = productoDoc.data().stock || 0;

          if (stockActual < item.cantidad) {
            throw new Error(`No hay suficiente stock para ${item.descripcion || item.id}`);
          }

          transaction.update(productoDocRef, { stock: stockActual - item.cantidad });
        }
      });
      console.log("Stock actualizado correctamente");
    } catch (error) {
      console.error("Error al descontar stock en transacción:", error);
      throw error;
    }
  };


  return (
    <CartContext.Provider
      value={{
        cart,
        agregarAlCarrito,
        eliminarDelCarrito,
        disminuirCantidad,
        totalItems,
        totalPrecio: calcularTotal(),
        actualizarProducto, // <--- nueva función
        descuentoMonetario: calcularDescuentoMonetario(),
        aplicarCupon,
        coupon,
        setCoupon,
        discount,
        telefonoUsuario,
        setTelefonoUsuario,
        vaciarCarrito,
        cuponesUsuario,
        verificarStockDisponible,
        descontarStock,
        marcarCuponComoUsado,
        registrarPedido, // <--- la exportás aquí
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
