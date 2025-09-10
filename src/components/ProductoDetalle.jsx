import React, { useEffect, useState, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { db } from "../config/firebase";
import { CartContext } from "../context/CartContext";
import ProductosRelacionados from "../components/ProductosRelacionados";

import "./ProductoDetalle.css";

export default function ProductoDetalle() {
    const { categoriaId, productoId } = useParams();
    const [producto, setProducto] = useState(null);
    const { agregarAlCarrito } = useContext(CartContext);


    // Estado para controlar el zoom y posición del lens
    const [zoomVisible, setZoomVisible] = useState(false);
    const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
    const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
    const imgRef = useRef(null);


    useEffect(() => {
        const ref = doc(db, "categorias", categoriaId, "Productosid", productoId);

        // Suscripción en tiempo real
        const unsubscribe = onSnapshot(ref, (docSnap) => {
            if (docSnap.exists()) {
                setProducto({ id: docSnap.id, ...docSnap.data() });
            } else {
                setProducto(null);
            }
        });

        // Limpieza al desmontar
        return () => unsubscribe();
    }, [categoriaId, productoId]);


    const lensSize = 120; // tamaño del recuadro lens

    const handleMouseMove = (e) => {
        const rect = imgRef.current.getBoundingClientRect();

        let x = e.clientX - rect.left - lensSize / 2;
        let y = e.clientY - rect.top - lensSize / 2;

        // Limitar que el lens no se salga de la imagen
        if (x < 0) x = 0;
        if (y < 0) y = 0;
        if (x > rect.width - lensSize) x = rect.width - lensSize;
        if (y > rect.height - lensSize) y = rect.height - lensSize;

        setLensPosition({ x, y });

        // Calcular posición de fondo para el zoom
        const bgX = (x / rect.width) * 100;
        const bgY = (y / rect.height) * 100;
        setBackgroundPosition(`${bgX}% ${bgY}%`);
    };

    if (!producto) {
        return (
            <div
                className="d-flex justify-content-center align-items-center"
                style={{ height: "300px" }}
            >
                <div className="producto-detalle-loader"></div>
            </div>
        );
    }


    return (
        <main className="producto-detalle-page container-fluid py-5 p-lg-5">
            <article className="row justify-content-center g-2 mt-lg-4 ">
                {/* Imagen del producto con zoom */}
                <section className="col-lg-6 col-md-8 col-sm-10 text-center producto-zoom-container">
                    <div
                        className="producto-imagen-container"
                        onMouseEnter={() => setZoomVisible(true)}
                        onMouseLeave={() => setZoomVisible(false)}
                        onMouseMove={handleMouseMove}
                    >
                        <img
                            src={producto.imagen}
                            alt={producto.nombre}
                            className="producto-imagen img-fluid rounded shadow-sm mt-lg-4 mt-2"
                            ref={imgRef}
                        />
                        {zoomVisible && (
                            <div
                                className="zoom-lens"
                                style={{
                                    left: lensPosition.x,
                                    top: lensPosition.y,
                                    width: lensSize,
                                    height: lensSize,
                                }}
                            />
                        )}
                    </div>

                    {zoomVisible && (
                        <div
                            className="zoom-result"
                            style={{
                                backgroundImage: `url(${producto.imagen})`,
                                backgroundPosition: backgroundPosition,
                                backgroundSize: `${imgRef.current?.width * 2}px ${imgRef.current?.height * 2
                                    }px`,
                            }}
                        />
                    )}
                </section>

                {/* Información del producto */}
                <section className="col-lg-5 col-md-8 col-sm-10 d-flex flex-column mt-3">
                    <header className="d-flex justify-content-between align-items-start mb-3 mb-lg-0 mt-lg-3">
                        <h1 className="producto-titulo fw-bold mb-lg-3 mt-lg-5 text-black">{producto.nombre}</h1>


                    </header>

                    <section>
                        {/* Precio anterior */}
                        <p className="text-muted mb-1 text-decoration-line-through fs-5">
                            ${Math.round(producto.precio * 1.2).toLocaleString()}
                        </p>

                        {/* Precio actual */}
                        <h2 className="producto-precio text-success fw-bold mb-3">
                            ${producto.precio.toLocaleString()}
                        </h2>


                        <p className="mb-2 text-black">
                            <strong>Marca:</strong> {producto.marca}
                        </p>
                        <p className="mb-3 text-black">
                            <strong>Stock disponible:</strong>{" "}
                            {producto.stock > 0 ? producto.stock : "Agotado"}
                        </p>

                        {/* Info adicional */}
                        <div className="mb-4 info-adicional">
                            <p className="text-success mb-1 fw-semibold d-flex align-items-center gap-0">
                                Locus Store<i className="bi bi-lightning-fill text-warning"></i>
                            </p>
                            <p className="text-primary mb-0 fw-semibold">
                                Precio de Financiacion <i className="bi bi-bag-check"></i>
                            </p>

                        </div>


                    </section>


                    <footer>
                        <button
                            className="btn btn-warning btn-lg w-100 mt-4 shadow-sm"
                            onClick={() => agregarAlCarrito(producto, categoriaId)}
                            disabled={producto.stock <= 0}
                        >
                            {producto.stock > 0 ? "Agregar al carrito" : "Agotado"}
                        </button>
                    </footer>
                </section>

                {/* 🏷️ CARACTERÍSTICAS DEL PRODUCTO - ESTILO MERCADO LIBRE */}
                <section
                    id="highlighted_specs_attrs"
                    className="ui-pdp-container__row ui-pdp-container__row--highlighted-specs-attrs my-5"
                >
                    <div className="ui-vpp-highlighted-specs p-4 rounded shadow-sm bg-white">
                        {/* Título */}
                        <div className="ui-pdp-container__row ui-pdp-container__row--highlighted-specs-title">
                            <h2 className="text-xl font-bold mb-4 text-gray-900">
                                Características del producto
                            </h2>
                        </div>

                        {/* ATRIBUTOS DESTACADOS */}
                        <div className="row bg-light rounded">
                            {[
                                { label: "Tipos de soldadora", value: producto.tipos || "MMA" },
                                { label: "Amperaje máximo", value: producto.amperajeMax || "105 A" },
                                { label: "Con display digital", value: producto.display ? "Sí" : "No" },
                                {
                                    label: "Con tecnología inverter",
                                    value: producto.inverter ? "Sí" : "No",
                                },
                                { label: "Ciclos de trabajo", value: producto.ciclo || "30%" },
                            ].map((attr, i) => (
                                <div
                                    key={i}
                                    className="flex items-center col-lg-5 gap-3 p-3 rounded-md hover:bg-gray-50 transition"
                                >
                                    {/* Ícono gris */}
                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                                        <img
                                            src="https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/default.svg"
                                            alt=""
                                            className="w-4 h-4 opacity-70"
                                        />
                                    </div>
                                    <p className="text-sm">
                                        <span className="text-gray-600">{attr.label}: </span>
                                        <span className="font-semibold text-gray-800">{attr.value}</span>
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* 🔽 CARACTERÍSTICAS GENERALES EN GRID 3x3 */}
                        <div className="mt-5 border-t pt-4">
                            <h3 className="text-lg font-semibold mb-3">Características generales</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {/* Marca */}
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition">
                                    <p className="text-gray-500 text-sm font-medium">Marca</p>
                                    <p className="text-gray-900 font-semibold">
                                        {producto.marca || "Lüsqtoff"}
                                    </p>
                                </div>

                                {/* Modelo */}
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition">
                                    <p className="text-gray-500 text-sm font-medium">Modelo</p>
                                    <p className="text-gray-900 font-semibold">
                                        {producto.modelo || "MEGAIRON100-8"}
                                    </p>
                                </div>

                                {/* Voltaje */}
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition">
                                    <p className="text-gray-500 text-sm font-medium">Voltaje</p>
                                    <p className="text-gray-900 font-semibold">
                                        {producto.voltaje || "220V"}
                                    </p>
                                </div>

                                {/* Accesorios incluidos */}
                                <div className="bg-gray-50 p-3 rounded-lg shadow-sm hover:shadow transition col-span-1 sm:col-span-2 lg:col-span-3">
                                    <p className="text-gray-500 text-sm font-medium">
                                        Accesorios incluidos
                                    </p>
                                    <p className="text-gray-900 font-semibold">
                                        {producto.accesorios ||
                                            "Cepillo, Correa de hombro, Manual, Pinza de masa, Pinza porta electrodo"}
                                    </p>
                                </div>
                            </div>
                        </div>

                    </div>

                    {/* 📝 DESCRIPCIÓN DETALLADA */}
                    <section className="ui-pdp-container__row ui-pdp-container__row--description">
                        <div className="ui-pdp-description bg-white p-4 rounded shadow-sm">
                            <h2 className="text-xl font-bold mb-3 text-gray-900">Descripción</h2>
                            <p
                                className="text-gray-700 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                    __html:
                                        producto.descripcionHTML ||
                                        `• Soldadora inverter portátil y compacta.<br>
          • Ideal para trabajos de herrería básicos y tareas en el hogar.<br><br>
          <strong>Datos técnicos:</strong><br>
          • Tensión de entrada: 220V<br>
          • Potencia: 3.5kW<br>
          • Ciclo de trabajo: 30%<br>
          • Clase de aislamiento: H<br><br>
          <strong>Incluye:</strong><br>
          • Cable con pinza porta-electrodo<br>
          • Cable con pinza masa<br>
          • Correa de transporte<br>
          • Máscara fotosensible`,
                                }}
                            />
                        </div>
                    </section>
                </section>




                <section className="container">
                    <article className="row justify-content-start">
                        <div className="col-12">
                        </div>
                        <div className="col-lg-10 col-md-11 col-sm-12">
                            <ProductosRelacionados
                                categoriaId={categoriaId} // Podés reemplazarlo dinámicamente si lo tenés
                                productoActualId={producto.id}
                            />
                        </div>
                    </article>
                </section>
            </article>
        </main>
    );
}
