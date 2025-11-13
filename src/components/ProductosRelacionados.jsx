import React, { useState, useRef, useContext, useEffect } from "react";
import { CartContext } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
import { db } from "../config/firebase";
import { collection, getDocs, query, where } from "firebase/firestore";
import "./HorizontalCarousel.css";

const ProductosRelacionados = ({ categoriaId, productoActualId }) => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const scrollRef = useRef(null);
  const { agregarAlCarrito } = useContext(CartContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRelacionados = async () => {
      try {
        const productosRef = collection(db, "categorias", categoriaId, "Productosid");
        const q = query(productosRef, where("activo", "==", true));
        const snapshot = await getDocs(q);
        const relacionados = snapshot.docs
          .map((doc) => ({ id: doc.id, ...doc.data(), categoria: categoriaId }))
          .filter((p) => p.id !== productoActualId);

        setProductos(relacionados);
      } catch (error) {
        console.error("Error cargando productos relacionados:", error);
      } finally {
        setLoading(false);
      }
    };

    if (categoriaId) fetchRelacionados();
  }, [categoriaId, productoActualId]);

  const scroll = (direction) => {
    if (!scrollRef.current) return;
    const { scrollLeft, clientWidth, scrollWidth } = scrollRef.current;
    const maxScrollLeft = scrollWidth - clientWidth;
    const scrollStep = clientWidth * 0.8;

    let targetScroll =
      direction === "next"
        ? Math.min(scrollLeft + scrollStep, maxScrollLeft)
        : Math.max(scrollLeft - scrollStep, 0);

    scrollRef.current.scrollTo({ left: targetScroll, behavior: "smooth" });
  };

  const handleProductoClick = (producto) => {
    navigate(`/categorias/${categoriaId}/producto/${producto.id}`, {
      state: { producto },
    });
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center my-4">
        <div className="custom-loader-spin"></div>
      </div>
    );
  }

  if (!productos.length) return null;

  return (
    <div
      className="position-relative mt-4"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <h3 className="text-start mb-3 fw-bold">Productos relacionados</h3>

      {isHovered && (
        <button
          className="andes-carousel-snapped__control andes-carousel-snapped__control--size-large position-absolute start-0 top-50 translate-middle-y z-3 prev-button"
          onClick={() => scroll("prev")}
          style={{ background: "transparent", border: "none" }}
          aria-label="Anterior"
        >
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="rgba(0, 0, 0, 0.9)"
          >
            <path d="M20.057 25L11.0617 16.0047L20.0664 7L19.0057 5.93933L8.94038 16.0047L18.9964 26.0607L20.057 25Z" />
          </svg>
        </button>
      )}

      <div
        ref={scrollRef}
        className="scroll-producto-contenedor d-flex overflow-auto p-0"
        style={{
          scrollSnapType: "x mandatory",
          gap: "12px",
          paddingBottom: "8px",
        }}
      >
        {productos.map((producto) => (
          <div
            key={producto.id}
            className="scroll-producto-card flex-shrink-0"
            style={{ scrollSnapAlign: "start", cursor: "pointer" }}
            onClick={() => navigate(`/categorias/${categoriaId}/producto/${producto.id}`, { state: { producto } })}
          >
            <a
              href={`/categorias/${categoriaId}/producto/${producto.id}`}
              target="_self"
              rel="noopener noreferrer"
              style={{ textDecoration: "none", color: "inherit" }}
              onClick={(e) => {
                // Clic normal SPA
                if (e.ctrlKey || e.metaKey || e.button === 1) {
                  // clic medio o Ctrl/Cmd abre en nueva pestaña
                  window.open(`/categorias/${categoriaId}/producto/${producto.id}`, "_blank");
                  e.preventDefault();
                } else {
                  navigate(`/categorias/${categoriaId}/producto/${producto.id}`, { state: { producto } });
                  e.preventDefault();
                }
              }}
            >
              <img
                src={producto.imagenes?.[0] || ""}
                alt={producto.nombre}
                className="scroll-producto-img"
              />
              <div className="scroll-producto-body mt-3 mt-lg-0">
                <div className="scroll-producto-precio-wrapper d-flex flex-column align-items-start">
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#888",
                      fontSize: "0.85rem",
                    }}
                    className="mt-lg-3"
                  >
                    {producto.precio
                      ? `$${Math.round(producto.precio * 1.2).toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                      : "-"}
                  </span>

                  <p className="scroll-producto-precio mb-1">
                    ${producto.precio
                      ? producto.precio.toLocaleString("es-AR", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })
                      : "N/A"}
                  </p>

                  {producto.precio3Cuotas > 0 && (
                    <small className="text-success d-block fw-light">
                      3 cuotas de{" "}
                      {(producto.precio3Cuotas / 3).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </small>
                  )}
                  {producto.precio6Cuotas > 0 && (
                    <small className="text-success text-start d-block fw-light mt-1">
                      6 cuotas de{" "}
                      {(producto.precio6Cuotas / 6).toLocaleString(undefined, {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </small>
                  )}
                </div>

                <h6 className="scroll-producto-titulo text-start fs-6">
                  <b>{producto.nombre}</b>
                </h6>
              </div>
            </a>

            <button
              className="scroll-producto-boton text-dark mt-lg-4 mt-0"
              disabled={producto.stock === 0}
              onClick={(e) => {
                e.stopPropagation();
                if (producto.stock > 0) {
                  agregarAlCarrito(producto, producto.categoria);
                }
              }}
            >
              {producto.stock === 0 ? "Agotado" : "Agregar al carrito"}
            </button>
          </div>

        ))}
      </div>

      {isHovered && (
        <button
          className="andes-carousel-snapped__control andes-carousel-snapped__control--size-large position-absolute end-0 top-50 translate-middle-y z-3 next-button"
          onClick={() => scroll("next")}
          style={{ background: "transparent", border: "none" }}
          aria-label="Siguiente"
        >
          <svg
            aria-hidden="true"
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="rgba(0, 0, 0, 0.9)"
          >
            <path d="M11.943 6.99999L20.9383 15.9953L11.9336 25L12.9943 26.0607L23.0596 15.9953L13.0036 5.93933L11.943 6.99999Z" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default ProductosRelacionados;
