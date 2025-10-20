import React, { useEffect, useState } from "react";
import { db } from "../config/firebase";
import { collection, onSnapshot, updateDoc, doc, getDoc, deleteDoc } from "firebase/firestore";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { FaRegCalendarAlt } from "react-icons/fa";
import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import logoLocus from "../assets/logolocus.png"; // ajusta la ruta


import "./adminpedidos.css";

const AdminPresupuesto = () => {
    const [pedidos, setPedidos] = useState([]);
    const [pedidoSeleccionado, setPedidoSeleccionado] = useState(null);
    const [filtro, setFiltro] = useState("Todos");
    const [paginaActual, setPaginaActual] = useState(1);
    const pedidosPorPagina = 5;
    const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
    const [mostrarCalendario, setMostrarCalendario] = useState(false);

    useEffect(() => {
        const unsubscribe = onSnapshot(collection(db, "pedidos"), (snapshot) => {
            const pedidosData = snapshot.docs
                .map((doc) => ({ id: doc.id, ...doc.data() }))
                .sort((a, b) => new Date(b.fecha?.seconds * 1000) - new Date(a.fecha?.seconds * 1000));

            setPedidos(pedidosData);
        });

        return () => unsubscribe();
    }, []);

    const handleVerDetalle = (pedidoId) => {
        setPedidoSeleccionado((prevId) => (prevId === pedidoId ? null : pedidoId));
    };

    const marcarCompletado = async (pedidoId) => {
        try {
            const pedidoRef = doc(db, "pedidos", pedidoId);
            const pedidoSnap = await getDoc(pedidoRef);

            if (!pedidoSnap.exists()) return;

            const pedidoData = pedidoSnap.data();

            // 1️⃣ Actualizar estado del pedido
            await updateDoc(pedidoRef, { estado: "completado" });

            // 2️⃣ Actualizar puntos del usuario
            if (pedidoData.userId) {
                const usuarioRef = doc(db, "usuarios", pedidoData.userId);
                const usuarioSnap = await getDoc(usuarioRef);

                if (usuarioSnap.exists()) {
                    const usuarioData = usuarioSnap.data();
                    const puntosActuales = usuarioData.puntos || 0;
                    const puntosASumar = 50; // ✅ puntos fijos por pedido completado

                    await updateDoc(usuarioRef, { puntos: puntosActuales + puntosASumar });
                }
            }

            console.log("Pedido completado y 50 puntos sumados al usuario");
        } catch (error) {
            console.error("Error al completar el pedido y sumar puntos:", error);
        }
    };

    // --- Función para eliminar pedido ---
    const eliminarPedido = async (pedidoId) => {
        if (!window.confirm("¿Estás seguro de eliminar este pedido? Esta acción no se puede deshacer.")) return;
        try {
            await deleteDoc(doc(db, "pedidos", pedidoId));
            alert("Pedido eliminado correctamente.");
        } catch (error) {
            console.error("Error al eliminar pedido:", error);
            alert("No se pudo eliminar el pedido.");
        }
    };

    // --- Función para cambiar estado a Pendiente ---
    const cambiarAPendiente = async (pedidoId) => {
        try {
            const pedidoRef = doc(db, "pedidos", pedidoId);
            await updateDoc(pedidoRef, { estado: "pendiente" });
            alert("Estado del pedido actualizado a Pendiente.");
        } catch (error) {
            console.error("Error al cambiar estado del pedido:", error);
            alert("No se pudo actualizar el estado.");
        }
    };


    // --- Función para redimensionar imágenes (menos pérdida de calidad) ---
    const resizeImage = async (url, maxWidth, maxHeight) => {
        return new Promise((resolve) => {
            const img = new Image();
            img.crossOrigin = "Anonymous";
            img.onload = () => {
                const canvas = document.createElement("canvas");
                let width = img.width;
                let height = img.height;

                if (width > height) {
                    if (width > maxWidth) {
                        height = (height * maxWidth) / width;
                        width = maxWidth;
                    }
                } else {
                    if (height > maxHeight) {
                        width = (width * maxHeight) / height;
                        height = maxHeight;
                    }
                }

                canvas.width = width;
                canvas.height = height;
                const ctx = canvas.getContext("2d");

                // 🔹 Pintar fondo blanco antes de dibujar imagen
                ctx.fillStyle = "#ffffff";
                ctx.fillRect(0, 0, width, height);

                ctx.drawImage(img, 0, 0, width, height);
                resolve(canvas.toDataURL("image/jpeg", 1)); // calidad máxima
            };
            img.onerror = () => resolve(null);
            img.src = url;
        });
    };




    const generarPDF = async (pedido) => {
        const doc = new jsPDF();
        let logoBase64 = null;
        try {
            const res = await fetch(logoLocus); // usamos la importación
            const blob = await res.blob();
            const reader = new FileReader();
            logoBase64 = await new Promise((resolve) => {
                reader.onloadend = () => resolve(reader.result);
                reader.readAsDataURL(blob);
            });
        } catch (err) {
            console.log("No se pudo cargar el logo", err);
        }

        // --- Título del documento ---
        doc.setFontSize(18);
        doc.text("Presupuesto - Locus Store", doc.internal.pageSize.getWidth() / 2, 15, {
            align: "center",
        });

        // --- Información del cliente como body ---
        const cliente = pedido.Cliente || {};
        autoTable(doc, {
            startY: 25,
            theme: "grid",
            head: [["PedidoID", `${pedido.id}`]], // ✅ Header agregado
            body: [
                [
                    `Nombre: ${cliente.nombre || "-"}`,
                    `Gremio: ${cliente.gremio || "-"}`
                ],
                [
                    `Email: ${cliente.email || "-"}`,
                    `Organismo: ${cliente.organismo || "-"}`
                ],
                [
                    `Teléfono: ${cliente.telefono || "-"}`,
                    `Cupón aplicado: ${cliente.cupon || "-"}`
                ],
                [
                    `DNI: ${cliente.dni || "-"}`,
                    `Método de pago: ${pedido.metodopago || "-"}`
                ],
                [
                    `Dirección: ${cliente.direccion || "-"}`,

                    `Fecha del pedido: ${new Date(pedido.fecha?.seconds * 1000).toLocaleString("es-AR")}`


                ]
            ],
            headStyles: {
                fillColor: [38, 23, 49],
                textColor: 255,
                fontStyle: "bold",
                halign: "start",
            },
            styles: {
                fontSize: 11,
                cellPadding: 2,
                valign: "top"
            },
            columnStyles: {
                0: { cellWidth: 98 },
                1: { cellWidth: 98 },
            },
            pageBreak: 'auto', // ✅ permite dividir en varias páginas automáticamente
            tableWidth: "wrap", // ✅ Ajusta ancho al contenido
            margin: { left: (doc.internal.pageSize.width - 195) / 2 }, // ✅ centra la tabla

            // ✅ Quitamos didDrawCell del header, no dibuja logo al inicio
        });

        // --- Preparamos filas con placeholders para imágenes ---
        const imagenes = [];
        const rows = [];

        for (let p of pedido.productos) {
            let imgBase64 = null;

            if (p.imagenUrl) {
                try {
                    // 🔹 Ajustamos tamaño mayor para mantener claridad
                    const tamanoImg = pedido.productos.length > 20 ? 70 : 120; // dinámico según cantidad de productos
                    imgBase64 = await resizeImage(p.imagenUrl, tamanoImg, tamanoImg);
                } catch (err) {
                    console.log("Error cargando imagen", err);
                }
            }


            imagenes.push(imgBase64);

            rows.push([
                p.nombre,
                p.cantidad,
                `$${p.preciounitario.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
                `$${p.total.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
                p.metodopago,
                " ", // Placeholder para la imagen
            ]);
        }


        // --- Tabla de productos ---
        autoTable(doc, {
            startY: 90,
            head: [["Productos", "Cant.", "$ xUnd.", "Total", "Pago", "Imagen"]],
            body: rows,
            theme: "grid",
            headStyles: { fillColor: [255, 204, 0], textColor: 0, fontStyle: "bold", halign: "center" },
            styles: { cellPadding: 3, fontSize: 10 },
            columnStyles: {
                0: { cellWidth: 50 },
                1: { halign: "center", cellWidth: 20 },
                2: { halign: "center", cellWidth: 30 },
                3: { halign: "center", cellWidth: 30 },
                4: { halign: "center", cellWidth: 40 },
                5: { cellWidth: 25, minCellHeight: 20 },
            },
            tableWidth: "wrap", // ✅ Ajusta ancho al contenido
            margin: { left: (doc.internal.pageSize.width - 195) / 2 }, // ✅ centra la tabla
            didDrawCell: (data) => {
                if (data.section === "body") {
                    if (data.column.index === 4) {
                        const row = pedido.productos[data.row.index];
                        doc.text(row.descripcionPago || row.metodo || "-", data.cell.x + 2, data.cell.y + data.cell.height / 2 - 4);
                    }
                    if (data.column.index === 5) {
                        const img = imagenes[data.row.index];
                        if (img) {
                            const cellWidth = data.cell.width;
                            const cellHeight = data.cell.height;
                            const imgSize = 15;
                            const x = data.cell.x + (cellWidth - imgSize) / 2;
                            const y = data.cell.y + (cellHeight - imgSize) / 2;
                            doc.addImage(img, "JPEG", x, y, imgSize, imgSize);
                        }
                    }
                }
            },
        });



        // --- Total del pedido ---
        let finalY = doc.lastAutoTable.finalY || 105; // posición final de la tabla de productos
        if (finalY + 70 > doc.internal.pageSize.getHeight()) {
            doc.addPage();  // agrega nueva página si no hay espacio
            finalY = 25;    // reinicia la posición vertical en la nueva página
        }

        doc.setFontSize(14);
        doc.setTextColor(0, 0, 0);
        doc.text(
            `TOTAL DEL PEDIDO: $${pedido.totalpedido.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`,
            20,
            finalY + 10
        );


        // --- Cláusulas / Garantías / Condiciones ---
        let clausulasY = finalY + 30; // espacio debajo del total
        const pageHeight = doc.internal.pageSize.getHeight();
        const margen = 10;
        const anchoTexto = doc.internal.pageSize.getWidth() - 2 * margen;

        // Tamaño de fuente más pequeño
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.setFont("helvetica", "normal");

        // Función para dibujar texto con salto de página automático
        const escribirLinea = (texto, yPos, negrita = false, sangria = 0) => {
            if (negrita) doc.setFont("helvetica", "bold");
            else doc.setFont("helvetica", "normal");

            const lineas = doc.splitTextToSize(texto, anchoTexto - sangria);
            lineas.forEach((linea) => {
                if (yPos > pageHeight - 10) { // margen inferior
                    doc.addPage();
                    yPos = 20; // margen superior
                }
                doc.text(linea, margen + sangria, yPos);
                yPos += 5; // altura de línea más ajustada
            });
            return yPos;
        };

        // Array con todas las líneas de texto y estilo
        const clausulasTexto = [
            { texto: "EL PRESUPUESTO ESTA EN BASE AL TIPO DE CAMBIO VENDEDOR DEL BNA, QUE SE AJUSTA A LA REALIDAD DEL PAIS", negrita: true },
            { texto: "", negrita: false },
            { texto: "DEFINICIONES CLAVES:", negrita: true },
            { texto: "Cuando compras aberturas de aluminio en Alucat Catamarca, es fundamental conocer ciertos conceptos relacionados con la calidad del material y su origen:", negrita: false },
            { texto: "1. Reciclado de aluminio", negrita: true },
            { texto: "• El aluminio es un material 100% reciclable sin perder calidad, SIEMPRE UTILIZANDO MATERIA PRIMA DE ALUAR Y DEL MISMO TEMPLE.", sangria: 5 },
            { texto: "• En Alucat, la utilización de aluminio reciclado contribuye a la sostenibilidad, manteniendo la misma resistencia, durabilidad y estética que el aluminio primario.", sangria: 5 },
            { texto: "2. Materia prima Aluar", negrita: true },
            { texto: "• Aluar es el principal productor de aluminio en Argentina y un proveedor confiable para la industria del aluminio.", sangria: 5 },
            { texto: "• Los perfiles de aluminio fabricados con materia prima de Aluar garantizan:", sangria: 5 },
            { texto: "  • Alta calidad y resistencia mecánica.", sangria: 10 },
            { texto: "  • Excelente acabado superficial.", sangria: 10 },
            { texto: "  • Sostenibilidad.", sangria: 10 },
            { texto: "3. Ventajas del aluminio en las aberturas", negrita: true },
            { texto: "• Durabilidad: Resistente a la corrosión y al desgaste.", sangria: 5 },
            { texto: "• Bajo mantenimiento: Fácil de limpiar y mantener.", sangria: 5 },
            { texto: "• Ligereza: Ofrece estructuras robustas sin añadir peso innecesario.", sangria: 5 },
            { texto: "• Versatilidad de diseño: Compatible con distintos estilos arquitectónicos.", sangria: 5 },
            { texto: "• Sostenibilidad: Su capacidad de reciclaje asegura un ciclo de vida prolongado y ecoamigable.", sangria: 5 },
            { texto: "MEDICION DE OBRA:", negrita: true },
            { texto: "• Para realizar el relevamiento de medidas, el responsable deberá dar aviso a ALUCAT ABERTURAS.", sangria: 5 },
            { texto: "• Deben estar todos los vanos terminados y los niveles de piso definidos.", sangria: 5 },
            { texto: "INSTALACION DE LAS ABERTURAS:", negrita: true },
            { texto: "• Las aberturas no instaladas por ALUCAT pierden garantía desde el retiro.", sangria: 5 },
            { texto: "• Instaladas por ALUCAT: garantía 1 año con algunas salvedades.", sangria: 5 },
            { texto: "• Incluye repuestos y mano de obra, no viáticos ni traslados.", sangria: 5 },
            { texto: "CONDICIONES GENERALES DE VENTA:", negrita: true },
            { texto: "• 75% al inicio y saldo al recibir la obra, ajustado al tipo de cambio vendedor BNA y precios de ALUAR.", sangria: 5 },
            { texto: "• 100% al inicio congelando el precio.", sangria: 5 },
            { texto: "• Pagos en dólares según dólar blue vendedor.", sangria: 5 },
            { texto: "• Validez de la oferta: 1 día.", sangria: 5 },
            { texto: "PLAZOS DE ENTREGA:", negrita: true },
            { texto: "• Aberturas pintadas blancas: 30 - 45 días", sangria: 5 },
            { texto: "• Otros colores: 45 - 90 días", sangria: 5 },
            { texto: "• Anodizadas: 90 - 120 días", sangria: 5 },
        ];

        // Dibujar todas las líneas
        clausulasTexto.forEach((linea) => {
            clausulasY = escribirLinea(linea.texto, clausulasY, linea.negrita, linea.sangria || 0);
        });



        // --- Dibujar logo al final ---
        if (logoBase64) {
            const pageWidth = doc.internal.pageSize.getWidth();
            const logoWidth = 50;   // ancho del logo
            const logoHeight = 50;  // alto del logo
            const x = pageWidth - logoWidth - 20; // 20 unidades del borde derecho
            const y = clausulasY - 20; // 10 unidades debajo de las cláusulas
            doc.addImage(logoBase64, "PNG", x, y, logoWidth, logoHeight);
        }

        // --- Guardar PDF ---
        doc.save(`Presupuesto_${pedido.id}.pdf`);
    };








    const filtrarPedidos = () => {
        return pedidos.filter((pedido) => {
            const coincideEstado =
                filtro === "Todos" || (pedido.estado || "").toLowerCase().trim() === filtro.toLowerCase().trim();

            if (!fechaSeleccionada) return coincideEstado;

            const fechaPedido = new Date(pedido.fecha?.seconds * 1000);
            const mismaFecha =
                fechaPedido &&
                fechaPedido.getDate() === fechaSeleccionada.getDate() &&
                fechaPedido.getMonth() === fechaSeleccionada.getMonth() &&
                fechaPedido.getFullYear() === fechaSeleccionada.getFullYear();

            return coincideEstado && mismaFecha;
        });
    };

    const pedidosFiltrados = filtrarPedidos();
    const totalPaginas = Math.ceil(pedidosFiltrados.length / pedidosPorPagina);
    const indiceInicio = (paginaActual - 1) * pedidosPorPagina;
    const pedidosPaginados = pedidosFiltrados.slice(indiceInicio, indiceInicio + pedidosPorPagina);

    const cambiarPagina = (nuevaPagina) => {
        if (nuevaPagina >= 1 && nuevaPagina <= totalPaginas) setPaginaActual(nuevaPagina);
    };

    const obtenerClaseEstado = (estado) => {
        const est = (estado || "").toLowerCase().trim();
        if (est === "pendiente") return "estado-pendiente";
        if (est === "completado") return "estado-listo";
        return "";
    };

    return (
        <section className="container-fluid">
            <div className="row justify-content-center">
                <article className="col-12 col-md-10 col-lg-8">
                    <div className="adminpedidos-card shadow-lg rounded-4 p-4">
                        <h3 className="adminpedidos-title mb-4 text-center text-dark">Gestiona Presupuestos</h3>

                        <div className="position-relative mb-3 d-flex align-items-center gap-3 flex-wrap justify-content-center">
                            <div className="position-relative d-inline-block">
                                <button
                                    className="btn btn-outline-primary d-flex align-items-center gap-2"
                                    onClick={() => setMostrarCalendario((prev) => !prev)}
                                >
                                    <FaRegCalendarAlt />
                                    {mostrarCalendario ? "Ocultar calendario" : "Mostrar calendario"}
                                </button>
                                {mostrarCalendario && (
                                    <div className="position-absolute shadow p-2 bg-white rounded z-3" style={{ top: "110%", left: 0 }}>
                                        <Calendar
                                            onChange={(date) => {
                                                setFechaSeleccionada(date);
                                                setPaginaActual(1);
                                                setMostrarCalendario(false);
                                            }}
                                            value={fechaSeleccionada}
                                            maxDetail="month"
                                        />
                                    </div>
                                )}
                            </div>

                            <select
                                className="form-select w-auto"
                                value={filtro}
                                onChange={(e) => {
                                    setFiltro(e.target.value);
                                    setPaginaActual(1);
                                }}
                            >
                                <option value="Todos">Todos</option>
                                <option value="Pendiente">Pendiente</option>
                                <option value="Completado">Completado</option>
                            </select>
                        </div>

                        {pedidosPaginados.length === 0 ? (
                            <p>No hay presupuestos para mostrar.</p>
                        ) : (
                            <ul className="adminpedidos-list-group">
                                {pedidosPaginados.map((pedido) => (
                                    <li key={pedido.id} className={`adminpedidos-item p-3 mb-3 rounded-3 ${obtenerClaseEstado(pedido.estado)}`}>
                                        <div className="d-flex justify-content-between align-items-center">
                                            <div>
                                                <strong className="adminpedidos-id text-dark">Pedido ID: {pedido.id}</strong>
                                                <div className="adminpedidos-status text-muted small">Estado: {pedido.estado}</div>
                                                <div className="adminpedidos-payment-method text-muted small">Método de pago: {pedido.metodopago}</div>
                                            </div>
                                            <span className="adminpedidos-total text-success fw-bold">
                                                Total: ${pedido.totalpedido.toLocaleString("es-AR", { minimumFractionDigits: 2 })}
                                            </span>
                                        </div>

                                        <div className="mt-2 d-flex gap-2 flex-column flex-md-row">
                                            <button
                                                className="adminpedidos-btn-detalles btn btn-info btn-sm w-100 w-md-auto text-white"
                                                onClick={() => handleVerDetalle(pedido.id)}
                                            >
                                                {pedidoSeleccionado === pedido.id ? "Cerrar detalles" : "Ver detalles"}
                                            </button>
                                            <button
                                                className="adminpedidos-btn-listo btn btn-success btn-sm w-100 w-md-auto text-white"
                                                onClick={() => marcarCompletado(pedido.id)}
                                            >
                                                Completado
                                            </button>
                                            <button
                                                className="btn btn-secondary btn-sm w-100 w-md-auto"
                                                onClick={() => cambiarAPendiente(pedido.id)}
                                            >
                                                Pendiente
                                            </button>
                                            <button
                                                className="adminpedidos-btn-pdf btn btn-warning btn-sm w-100 w-md-auto text-white"
                                                onClick={() => generarPDF(pedido)}
                                            >
                                                Generar PDF
                                            </button>
                                            {/* NUEVOS BOTONES */}
                                            <button
                                                className="btn btn-danger btn-sm w-100 w-md-auto"
                                                onClick={() => eliminarPedido(pedido.id)}
                                            >
                                                Eliminar Pedido
                                            </button>

                                        </div>

                                        {pedidoSeleccionado === pedido.id && (
                                            <div className="adminpedidos-details mt-3 p-3 border rounded bg-light text-dark">
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

                                                        let descripcionPago = "Contado";
                                                        let totalProducto = precioBase;

                                                        if (prod.metodo === "3cuotas") {
                                                            totalProducto = +(precioBase * 1.15).toFixed(2);
                                                            const cuota = +(totalProducto / 3).toFixed(2);
                                                            descripcionPago = `3 cuotas de $${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                                        } else if (prod.metodo === "6cuotas") {
                                                            totalProducto = +(precioBase * 1.30).toFixed(2);
                                                            const cuota = +(totalProducto / 6).toFixed(2);
                                                            descripcionPago = `6 cuotas de $${cuota.toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
                                                        }

                                                        return (
                                                            <li key={i} className="mb-2 p-2 border rounded bg-white">
                                                                <strong>{prod.nombre}</strong>
                                                                <div><strong>Cantidad:</strong> {cantidad}</div>
                                                                <div>
                                                                    <strong>Precio unitario:</strong> {prod.preciounitario?.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}
                                                                </div>
                                                                <div>
                                                                    <strong>Total:</strong> {totalProducto.toLocaleString("es-AR", { style: "currency", currency: "ARS" }) || "-"}
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
                        )}

                        {totalPaginas > 1 && (
                            <div className="d-flex justify-content-center text-dark mt-4 gap-2">
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => cambiarPagina(paginaActual - 1)}
                                    disabled={paginaActual === 1}
                                >
                                    Anterior
                                </button>
                                <span className="align-self-center">Página {paginaActual} de {totalPaginas}</span>
                                <button
                                    className="btn btn-outline-secondary btn-sm"
                                    onClick={() => cambiarPagina(paginaActual + 1)}
                                    disabled={paginaActual === totalPaginas}
                                >
                                    Siguiente
                                </button>
                            </div>
                        )}

                    </div>
                </article>
            </div>
        </section>
    );
};

export default AdminPresupuesto;
