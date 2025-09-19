// src/pages/Home.jsx
import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { auth } from "../config/firebase";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import SwiperComponent from "../components/SwiperComponent";
import HorizontalScroll2 from "../components/HorizontalScroll2"; // ✅ importamos tu componente
import SwiperMini from "../components/SwiperMini"; // ✅ Importamos SwiperMini
import HorizontalCarousel from "../components/HorizontalCarousel"; // ✅ importamos tu componente
import { Link } from "react-router-dom";



import "./Home.css";

const Home = () => {
  const { usuario } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await auth.signOut();
    navigate("/");
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const slideElements = document.querySelectorAll(".slide-up");

    slideElements.forEach((el) => {
      observer.observe(el);
      // activamos los elementos ya visibles al cargar
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("active");
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, []);



  return (
    <div className="home-background bg-light">


<section
  className="pf-home-presentation text-white mt-5 position-relative"
  style={{
    background:
      "radial-gradient(circle at -50% 120%, rgba(208,242,36,0.15) 20%, #054a49 60%)",
  }}
>
  <div className="container slide-up mt-lg-5 px-3 px-md-0 mt-4">
    <div className="row justify-content-center">
      <div className="col-12 col-md-10 col-lg-8 text-center">
        <div
          className="p-lg-4 p-3 p-md-5 rounded-4 shadow-lg"
          style={{
            background: "rgba(255,255,255,0.06)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          {/* Título principal */}
          <h1
            className="fw-bold mb-lg-3 mb-2"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.6rem, 6vw, 3rem)",
              lineHeight: "1.1",
              color: "#fff",
              letterSpacing: "-0.5px",
              textShadow: "1px 1px 4px rgba(0,0,0,0.3)",
            }}
          >
            ¡Bienvenido a <span style={{ color: "#C7E86B" }}>Locus Store</span>!
          </h1>

          {/* Subtítulo */}
          <h2
            className="fw-light mb-2"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              fontSize: "clamp(1.4rem, 4vw, 1.8rem)",
              lineHeight: "1.3",
              color: "rgba(255,255,255,0.95)",
              letterSpacing: "-0.3px",
            }}
          >
            Un espacio <b>dinámico</b> y en constante evolución, diseñado para que accedas fácilmente a <b>productos y servicios exclusivos</b>.
          </h2>

          {/* Descripción */}
          <p
            className="mx-auto mb-4"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              maxWidth: "100%",
              color: "rgba(255,255,255,0.85)",
              lineHeight: "1.7",
              fontSize: "clamp(1.1rem, 3vw, 1.2rem)",
            }}
          >
            Nuestro objetivo es ofrecer un acceso <b>sencillo</b> y <b>confiable</b> a <b>productos</b> en <b>cuotas</b>. Cada <b>interacción</b> refleja <b>cuidado</b>, <b>coherencia</b> y <b>valor</b>, para que tu <b>experiencia</b> en nuestra plataforma sea siempre <b>única</b>.
          </p>

          {/* CTA */}
          <Link
            to="/SobreNosotros"
            className="btn btn-light btn-lg fw-bold px-4 px-md-5 py-3 rounded-pill shadow"
            style={{
              fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
              color: "#054a49",
              letterSpacing: "0.4px",
              fontSize: "clamp(1rem, 3vw, 1.1rem)",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) => (e.target.style.backgroundColor = "#f8f9fa")}
            onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            Saber más
          </Link>
        </div>
      </div>
    </div>
  </div>

{/* Flecha estilo Apple clicable */}
<div
  style={{
    position: "absolute",
    bottom: "30px",
    left: "50%",
    transform: "translateX(-50%)",
    textAlign: "center",
    zIndex: 10,
    cursor: "pointer", // hace que se vea clicable
  }}
  onClick={() =>
    window.scrollBy({ top: window.innerHeight * 0.9, behavior: "smooth" })
  }
>
  <svg
    width="34"
    height="34"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      stroke: "#C7E86B",
      strokeWidth: 3,
      strokeLinecap: "round",
      strokeLinejoin: "round",
      animation: "fadeMove 2s infinite",
    }}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="6,13 12,19 18,13" />
  </svg>

  <style>
    {`
      @keyframes fadeMove {
        0%, 100% {
          transform: translateY(0);
          opacity: 0.6;
        }
        50% {
          transform: translateY(8px);
          opacity: 1;
        }
      }
    `}
  </style>
</div>


</section>




      {/* SWIPER PRINCIPAL */}
      <section className="container-fluid px-0 mt-0">
        <div className="row g-0">
          <div className="col-12 text-center">
            {/* Título principal */}
            <h1 className="display-5 fw-bold my-4" style={{ color: "#054a49" }}>
              Enterate de todas las novedades
            </h1>

            {/* Sección del Swiper */}
            <div className="swiper-section">
              <SwiperComponent />
            </div>
          </div>
        </div>
      </section>

      <section className="home-swiper-mini">
        <SwiperMini />
      </section>




      <section className="mx-lg-5 slide-up">

        <div className="container-fluid w-100 mt-3">

          <div className="container px-0  px-2 text-center mt-5">

            {/* 🏷️ Título de sección con línea decorativa */}
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                position: "relative",
                display: "inline-block",
              }}
            >
              Materiales de Construcción
              {/* Línea decorativa */}
              <span
                style={{
                  display: "block",
                  height: "3px",
                  width: "60px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            {/* 📝 Texto descriptivo */}
            <p
              className="mx-auto mb-4"
              style={{
                fontSize: "1.1rem",
                maxWidth: "600px",
                color: "rgba(0,0,0,0.7)",
                lineHeight: "1.6",
              }}
            >
              Explora nuestras categorías y encuentra los productos que estás buscando de forma rápida y sencilla.
            </p>

            <HorizontalCarousel />



          </div>
        </div>

      </section>

      <section className="py-lg-4 slide-up">
        <div className="container">
          <div className="row g-3">

            <div className="col-6 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-0">
                <img
                  src="https://http2.mlstatic.com/D_NQ_NP2X_903719-MLA71136006834_082023-B.webp"
                  className="card-img-top mb-0 "
                  alt="Pinturas"
                />
              </div>
            </div>

            <div className="col-6 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-0">
                <img
                  src="https://http2.mlstatic.com/D_NQ_NP2X_612153-MLA71329696758_082023-B.webp"
                  className="card-img-top"
                  alt="Bombas"
                />
              </div>
            </div>

            <div className="col-6 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-0">
                <img
                  src="https://http2.mlstatic.com/D_NQ_NP2X_675521-MLA71305994603_082023-B.webp"
                  className="card-img-top"
                  alt="Electricidad"
                />
              </div>
            </div>

            <div className="col-6 col-md-6 col-lg-3">
              <div className="card border-0 shadow-sm p-0">
                <img
                  src="https://http2.mlstatic.com/D_NQ_NP2X_763287-MLA71306430107_082023-B.webp"
                  className="card-img-top"
                  alt="Pisos y Revestimientos"
                />
              </div>
            </div>

          </div>
        </div>
      </section>












      <section className="section-banners-home py-5" >
        {/* 🔥 SECTION DE OFERTAS (CAROUSEL) */}
        <div className="row justify-content-center mt-0 text-center">
          <div className="col-12">
            {/* 🏷️ Título de sección con línea decorativa */}
            <h2
              className="fw-bold mb-3"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                position: "relative",
                display: "inline-block",
              }}
            >
              Categorías
              {/* Línea decorativa */}
              <span
                style={{
                  display: "block",
                  height: "3px",
                  width: "60px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

            {/* 📝 Texto descriptivo */}
            <p
              className="mx-auto mb-4"
              style={{
                fontSize: "1.1rem",
                maxWidth: "600px",
                color: "rgba(0,0,0,0.7)",
                lineHeight: "1.6",
              }}
            >
              Explora nuestras categorías y encuentra los productos que estás buscando de forma rápida y sencilla.
            </p>

            {/* 🎠 Carrusel de categorías */}
            <HorizontalScroll2 />

            {/* 🎯 Botón de acción */}
            <div className="mt-4 mb-5">
              <a
                href="/catalogo"
                className="btn btn-warning px-4 py-2 fw-bold shadow-sm"
                style={{
                  backgroundColor: "#FFD700",
                  color: "#054a49",
                  borderRadius: "30px",
                  fontSize: "1.1rem",
                  transition: "all 0.3s ease-in-out",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffc107")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "#FFD700")}
              >
                Ver catálogo
              </a>
            </div>
          </div>
        </div>









        <div className="container text-center my-lg-5 my-4">
          {/* 🏷️ Título de sección */}
          <h2
            className="fw-bold mb-1"
            style={{
              color: "#054a49",
              fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
              position: "relative",
              display: "inline-block",
            }}
          >
            Nuestras Promociones
            {/* Línea decorativa */}

          </h2>

          {/* 📝 Texto descriptivo */}
          <p
            className="mx-auto mb-4"
            style={{
              fontSize: "1.1rem",
              maxWidth: "600px",
              color: "rgba(0,0,0,0.7)",
              lineHeight: "1.6",
            }}
          >
            Descubrí nuestras ofertas y oportunidades especiales en productos seleccionados.
          </p>

          {/* 🎨 Banners */}
          <div className="row g-4 justify-content-center">
            {/* Banner 1 */}
            <div className="col-12 col-sm-6 col-md-4 slide-up">
              <a
                href="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116396/aberturas_anq9y6.webp"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Banner de EMI SRL"
                aria-label="Banner de EMI SRL"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116396/aberturas_anq9y6.webp"
                  alt="Banner de EMI SRL"
                  className="img-fluid w-100"
                />
              </a>
            </div>

            {/* Banner 2 */}
            <div className="col-12 col-sm-6 col-md-4 slide-up">
              <a
                href="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116376/maquinas_mjdq6h.webp"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Banner de EMI SRL"
                aria-label="Banner de EMI SRL"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116376/maquinas_mjdq6h.webp"
                  alt="Banner de EMI SRL"
                  className="img-fluid w-100"
                />
              </a>
            </div>

            {/* Banner 3 */}
            <div className="col-12 col-sm-6 col-md-4 slide-up">
              <a
                href="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116261/bachas_fqvnvb.webp"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Banner de EMI SRL"
                aria-label="Banner de EMI SRL"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116261/bachas_fqvnvb.webp"
                  alt="Banner de EMI SRL"
                  className="img-fluid w-100"
                />
              </a>
            </div>
          </div>
        </div>


      </section>

      <section className="mx-lg-5 mb-5 slide-up">
        <div className="container-fluid w-100 mt-3">
          <div className="container px-0 bg-white shadow-sm px-2 rounded-3">
            <h1 className="text-start pt-2 px-2 ">Aceros y Hierros</h1>

            <HorizontalCarousel />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-3  border-top">
              <a
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none"
                href="/categorias"
                rel="nofollow"
                style={{ color: "#3483fa" }}
              >
                <div className="ui-recommendations-footer__wrapper d-flex align-items-center gap-2">
                  <div className="ui-recommendations-footer__text" style={{ fontWeight: 600 }}>
                    Ver más
                  </div>
                  <div className="ui-recommendations-footer__chevron d-flex align-items-center">
                    <svg
                      className="ui-homes-icon ui-homes-icon--chevron"
                      width="9"
                      height="14"
                      viewBox="0 0 9 14"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path d="M1 1l6 6-6 6" stroke="#3483fa" strokeWidth="2" fill="none" fillRule="evenodd" />
                    </svg>
                  </div>
                </div>
              </a>
            </div>

          </div>
        </div>




      </section>
      <section className="py-4 bg-light mb-5 slide-up">
        <div className="container">
          <h2 className="text-center mb-4">💫 LAS MEJORES MARCAS 💫</h2>

          <div id="marcasCarousel" className="carousel slide" data-bs-ride="carousel">

            <div className="carousel-inner p-2">
              {/* Slide 1 */}
              <div className="carousel-item active">
                <div className="row g-3 justify-content-center">
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0 shadow-sm">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_600242-MLA45341687389_032021-G.webp"
                          className="card-img-top"
                          alt="FV"
                        />
                        <div className="text-center mt-2">FV</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0 shadow-sm">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_724547-MLA45341663417_032021-G.webp"
                          className="card-img-top"
                          alt="PIAZZA"
                        />
                        <div className="text-center mt-2">PIAZZA</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0 shadow-sm">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_675631-MLA45341666416_032021-G.webp"
                          className="card-img-top"
                          alt="FERRUM"
                        />
                        <div className="text-center mt-2">FERRUM</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0 shadow-sm">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_740225-MLA45341666418_032021-G.webp"
                          className="card-img-top"
                          alt="ROCA"
                        />
                        <div className="text-center mt-2">ROCA</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0 shadow-sm">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_696144-MLA45341666425_032021-G.webp"
                          className="card-img-top"
                          alt="SINTEPLAST"
                        />
                        <div className="text-center mt-2">SINTEPLAST</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>

              {/* Slide 2 */}
              <div className="carousel-item">
                <div className="row g-3 justify-content-center">
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_601949-MLA45341663426_032021-G.webp"
                          className="card-img-top"
                          alt="ALBA"
                        />
                        <div className="text-center mt-2">ALBA</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_960623-MLA45341666436_032021-G.webp"
                          className="card-img-top"
                          alt="SICA"
                        />
                        <div className="text-center mt-2">SICA</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_995015-MLA45341666451_032021-G.webp"
                          className="card-img-top"
                          alt="KLAUKOL"
                        />
                        <div className="text-center mt-2">KLAUKOL</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_824668-MLA45464391827_042021-G.webp"
                          className="card-img-top"
                          alt="SIKA"
                        />
                        <div className="text-center mt-2">SIKA</div>
                      </a>
                    </div>
                  </div>
                  <div className="col-6 col-md-4 col-lg-2">
                    <div className="card border-0">
                      <a href="#">
                        <img
                          src="https://http2.mlstatic.com/D_Q_NP_2X_640503-MLA45464408698_042021-G.webp"
                          className="card-img-top"
                          alt="PRINGLES SAN LUIS"
                        />
                        <div className="text-center mt-2">PRINGLES</div>
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controls */}
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#marcasCarousel"
              data-bs-slide="prev"
            >
              <span className="carousel-control-prev-icon icon-dark" aria-hidden="true"></span>
              <span className="visually-hidden">Anterior</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#marcasCarousel"
              data-bs-slide="next"
            >
              <span className="carousel-control-next-icon icon-dark" aria-hidden="true"></span>
              <span className="visually-hidden">Siguiente</span>
            </button>
          </div>
        </div>
      </section>













    </div>
  );
};

export default Home;
