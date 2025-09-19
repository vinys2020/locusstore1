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
                        <h2 className="producto-precio text-black fw-light fs-1 mb-3">
                            ${producto.precio.toLocaleString()}
                        </h2>

                        {/* Precio de financiación estilo Mercado Libre */}
                        <div className="scroll-producto-cuotas mt-2">
                            {producto.precio3Cuotas > 0 && (
                                <h6 className="text-success d-block fw-light">
                                    3 cuotas de ${(producto.precio3Cuotas / 3).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h6>
                            )}
                            {producto.precio6Cuotas > 0 && (
                                <h6 className="text-success d-block fw-light mt-1">
                                    6 cuotas de ${(producto.precio6Cuotas / 6).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                </h6>
                            )}
                        </div>









                        <p className="mb-2 text-black">
                            <strong>Marca:</strong> {producto.marca}
                        </p>
                        <p className="mb-3 text-black">
                            <strong>Stock disponible:</strong>{" "}
                            {producto.stock > 0 ? producto.stock : "Agotado"}
                        </p>

                        {/* 🏦 Medios de pago */}
                        <div className="col-12 text-center text-md-start mb-3 mb-md-0 mt-3">
                            <h6 className="text-primary mb-2">Medios de pago</h6>
                            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                                {/* Tarjetas de crédito */}
                                <img
                                    alt="Visa"
                                    height="30"
                                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757440161/visa_2x_la3lfi.png"
                                />
                                <img
                                    alt="Mastercard"
                                    height="30"
                                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757442922/mastercard_2x_qlp3sk.png"
                                />
                                <img
                                    alt="Amex"
                                    height="30"
                                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757442926/tarjeta-naranja_2x_ohravu.png"
                                />

                                {/* Efectivo */}
                                <img
                                    alt="Pago Fácil"
                                    height="30"
                                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757443047/amex_2x_w20vu7.png"
                                />
                                <img
                                    alt="Rapipago"
                                    height="30"
                                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757443156/tarjeta-shopping_2x_tsejmn.png"
                                />
                            </div>
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

                {/* 🏷️ CARACTERÍSTICAS DEL PRODUCTO */}
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
                        <div className="row bg-light rounded p-lg-3">
                            {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                                <div
                                    className="d-grid gap-4"
                                    style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
                                >
                                    {producto.caracteristicas.map((carac, i) => (
                                        <div
                                            key={i}
                                            className="flex items-center gap-2 rounded-md  "
                                        >
                                            {/* Ícono gris */}
                                            <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 rounded-full flex-shrink-0">
                                                <img
                                                    src="https://http2.mlstatic.com/storage/catalog-technical-specs/images/assets/vectorial/default.svg"
                                                    alt="✔"
                                                    className="w-3 h-3"
                                                />
                                            </span>

                                            {/* Texto de la característica */}
                                            <span className="text-sm text-gray-800">{carac}</span>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-gray-700 p-3">No hay características agregadas para este producto.</p>
                            )}
                        </div>



                        {/* 📝 DESCRIPCIÓN DETALLADA */}
                        <section className="mt-4">
                            <h2 className="text-dark">Descripción</h2>

                            <div className="container">
                                <div className="row justify-content-start">
                                    <div className="col-12 col-md-8 col-lg-6 p-2 ">
                                        <p
                                            className="text-dark"
                                            style={{ whiteSpace: 'pre-line', lineHeight: '1.5' }}
                                        >
                                            {producto.descripcion || "No hay descripción disponible"}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>

                    </div>
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
