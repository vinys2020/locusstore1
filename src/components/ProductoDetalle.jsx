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

  // Zoom
  const [zoomVisible, setZoomVisible] = useState(false);
  const [lensPosition, setLensPosition] = useState({ x: 0, y: 0 });
  const [backgroundPosition, setBackgroundPosition] = useState("0% 0%");
  const imgRef = useRef(null);

  // Imagen seleccionada
  const [imagenSeleccionada, setImagenSeleccionada] = useState(0);

  useEffect(() => {
    const ref = doc(db, "categorias", categoriaId, "Productosid", productoId);
    const unsubscribe = onSnapshot(ref, (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        setProducto({
          id: docSnap.id,
          ...data,
          imagenes: data.imagenes && data.imagenes.length > 0
            ? data.imagenes
            : data.imagen
              ? [data.imagen]
              : [], // Evita undefined
        });
      } else {
        setProducto(null);
      }
    });
    return () => unsubscribe();
  }, [categoriaId, productoId]);



  const lensSize = 120;

  const handleMouseMove = (e) => {
    const rect = imgRef.current.getBoundingClientRect();
    let x = e.clientX - rect.left - lensSize / 2;
    let y = e.clientY - rect.top - lensSize / 2;

    if (x < 0) x = 0;
    if (y < 0) y = 0;
    if (x > rect.width - lensSize) x = rect.width - lensSize;
    if (y > rect.height - lensSize) y = rect.height - lensSize;

    setLensPosition({ x, y });

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

        <section className="producto-zoom-container col-lg-6 col-md-8 col-sm-10 col-12 mx-auto text-start mt-lg-5 d-flex flex-row">
          {/* Miniaturas */}
          <div
            className="miniaturas d-flex flex-column gap-2  me-1"
            style={{ overflowY: "auto", maxHeight: "400px", flexShrink: 0 }}
          >
            {producto.imagenes.map((img, index) => (
              <button
                key={index}
                className={`miniatura-btn border p-1 rounded ${index === imagenSeleccionada ? "border-primary" : "border-secondary"}`}
                onClick={() => setImagenSeleccionada(index)}
                style={{ background: "transparent", flex: "0 0 auto" }}
              >
                {img.endsWith(".mp4") ? (
                  <video
                    src={img}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                  />
                ) : img.includes("youtube") ? (
                  <iframe
                    src={img}
                    style={{ width: "60px", height: "60px", borderRadius: "4px" }}
                    title={`youtube-${index}`}
                  />
                ) : (
                  <img
                    src={img}
                    alt={`${producto.nombre} ${index + 1}`}
                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                  />
                )}
              </button>
            ))}
          </div>
          {/* Imagen principal */}
          <div
            className="producto-imagen-container position-relative d-flex align-items-center justify-content-center"
            style={{
              height: "400px",
              backgroundImage: zoomVisible
                ? `url(${producto.imagenes[imagenSeleccionada]})`
                : "none",
              backgroundRepeat: "no-repeat",
              backgroundSize: "200%", // 🔥 zoom al 200%
              backgroundPosition: backgroundPosition, // 🔥 sigue el mouse
            }}
            onMouseEnter={() => setZoomVisible(true)}
            onMouseLeave={() => setZoomVisible(false)}
            onMouseMove={handleMouseMove}
          >
            {producto.imagenes[imagenSeleccionada].endsWith(".mp4") ? (
              <video
                src={producto.imagenes[imagenSeleccionada]}
                controls
                className="producto-imagen rounded shadow-sm"
                style={{ maxHeight: "100%", maxWidth: "100%", objectFit: "contain" }}
                ref={imgRef}
              />
            ) : producto.imagenes[imagenSeleccionada].includes("youtube") ? (
              <iframe
                src={producto.imagenes[imagenSeleccionada]}
                title="Video"
                className="producto-imagen rounded shadow-sm"
                style={{
                  width: "100%",
                  height: "100%",
                  border: "none",
                }}
              />
            ) : (
              <img
                src={producto.imagenes[imagenSeleccionada]}
                alt={producto.nombre}
                className="producto-imagen rounded shadow-none"
                style={{
                  maxHeight: "100%",
                  maxWidth: "100%",
                  objectFit: "contain",
                  opacity: zoomVisible ? 0 : 1, // 🔥 ocultar imagen real al hacer zoom
                }}
                ref={imgRef}
              />
            )}

            {/* Zoom lens solo decorativo */}
            {zoomVisible &&
              !producto.imagenes[imagenSeleccionada].endsWith(".mp4") &&
              !producto.imagenes[imagenSeleccionada].includes("youtube") && (
                <div
                  className="zoom-lens position-absolute"
                  style={{
                    left: lensPosition.x,
                    top: lensPosition.y,
                    width: lensSize,
                    height: lensSize,
                    border: "2px solid rgba(0,0,0,0.3)",
                    backgroundColor: "rgba(255,255,255,0.2)",
                    cursor: "crosshair",
                  }}
                />
              )}
          </div>


        </section>






        {/* Información del producto */}
        <section className="col-lg-5 col-md-8 col-sm-10 d-flex flex-column mt-3">
          <header className="d-flex justify-content-between align-items-start mb-3 mb-lg-0 mt-lg-3">
            <h1 className="producto-titulo fw-bold mb-lg-3 mt-lg-5 text-black">{producto.nombre}</h1>


          </header>

          <section>
            {/* Precio anterior */}
            <p className="text-muted mb-1 text-decoration-line-through fs-5">
              ${Math.round(producto.precio * 1.2).toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </p>


            <h2 className="producto-precio text-black fw-light fs-1 mb-3">
              ${producto.precio.toLocaleString("es-AR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
            <div className="col-12 text-start text-lg-start mb-3 mb-md-0 mt-3">
              <h6 className="text-primary mb-2">Medios de pago</h6>
              <div className="d-flex flex-wrap gap-2 justify-content-start justify-content-md-start">
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
            <div className="row bg-light rounded p-lg-3 p-1">
              {producto.caracteristicas && producto.caracteristicas.length > 0 ? (
                <div
                  className="d-grid gap-4"
                  style={{ gridTemplateColumns: 'repeat(2, 1fr)' }}
                >
                  {producto.caracteristicas.map((carac, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 rounded-md"
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

              <div className="row justify-content-start">
                <div className="col-12 col-md-8 col-lg-6 p-2 mx-lg-2 ">
                  <p
                    className="text-dark "
                    style={{ whiteSpace: 'pre-line', lineHeight: '1.8' }}
                  >
                    {producto.descripcion || "No hay descripción disponible"}
                  </p>
                </div>
              </div>
            </section>

          </div>
        </section>






        <section className="">
          <article className="row justify-content-center">
            <div className="col-12">
            </div>
            <div className="col-12">
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
