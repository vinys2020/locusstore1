import emailjs from "@emailjs/browser";
import { toast } from "react-toastify";

/**
 * Envía un correo con todos los datos del pedido usando EmailJS
 * @param {Object} pedidoData - Datos completos del pedido
 */
export const enviarMailPedido = async (pedidoData) => {
  const cliente = pedidoData.Cliente || {};
  const cupon = cliente.cupon || null;       // <- Agregá esto
  const descuento = cliente.descuento || 0;  // <- Agregá esto



  const productos = pedidoData.productos.map((p) => {
    const cantidad = p.cantidad || 1;
    const precioUnitario = p.precio || p.preciounitario || 0; // fallback

    let totalProducto = precioUnitario * cantidad;
    let infoCuota = "contado";

    if (p.metodo === "3cuotas") {
      totalProducto *= 1.15;
      const cuota = (totalProducto / 3).toFixed(2);
      infoCuota = `en 3 cuotas de $${parseFloat(cuota).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    } else if (p.metodo === "6cuotas") {
      totalProducto *= 1.30;
      const cuota = (totalProducto / 6).toFixed(2);
      infoCuota = `en 6 cuotas de $${parseFloat(cuota).toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}`;
    }

    return {
      nombre: p.nombre || "Producto sin nombre",
      cantidad,
      preciounitario: precioUnitario.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
      metodo: p.metodo || "contado",
      infoCuota: infoCuota !== "contado" ? infoCuota : "",
      total: totalProducto.toLocaleString("es-AR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }),
    };
  });

  const totalConDescuento = pedidoData.totalpedido;

  const templateParams = {
    order_id: pedidoData.id, 
    fechapedido: pedidoData.fecha
      ? new Date(pedidoData.fecha.seconds * 1000).toLocaleString("es-AR")
      : new Date().toLocaleString("es-AR"),

    usuario_nombre: cliente.nombre || "Cliente desconocido",
    usuario_email: cliente.email || "No informado",
    usuario_telefono: cliente.telefono || "Sin teléfono",
    usuario_dni: cliente.dni || "No informado",
    usuario_gremio: cliente.gremio || "No especificado",
    usuario_organismo: cliente.organismo || "No especificado",
    usuario_direccion: cliente.direccion || "No informada",
    descuento: cupon ? `${descuento.toLocaleString("es-AR", { minimumFractionDigits: 2 })} %` : "0 %",
    cupon: cupon || "Ninguno",

    productos,
    totalpedido: totalConDescuento.toLocaleString("es-AR", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }),

  };

  try {
    await emailjs.send(
      "service_dq4teu7",
      "template_eg8sxv8",
      templateParams,
      "x4QSvt5uOxAoeNE6W"
    );
  } catch (error) {
    console.error("❌ Error al enviar el correo del pedido:", error);
  }
};
