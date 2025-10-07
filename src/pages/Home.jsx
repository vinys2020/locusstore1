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
import HorizontalHerramientas from "../components/HorizontalHerramientas"; // ✅ importamos tu componente
import HorizontalPinturasYRev from "../components/HorizontalPinturasYRev";
import HorizontalPlomeYAgua from "../components/HorizontalPlomeYAgua";
import HorizontalServicios from "../components/HorizontalServicios";
import HorizontalElectricidad from "../components/HorizontalElectricidad";
import HorizontalAccesoriosSeguridad from "../components/HorizontalAccesoriosSeguridad";





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

  const userNombre = usuario?.displayName || "Nombre no disponible";

  // Función helper
  const capitalizeWords = (str) => {
    if (!str) return "";
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="home-background bg-light">


      <section
        className="pf-home-presentation text-white mt-lg-5 mt-4 position-relative"
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
                  ¡Bienvenido,{" "}
                  <span style={{ color: "#C7E86B" }}>
                    {userNombre ? userNombre.split(" ")[0].charAt(0).toUpperCase() + userNombre.split(" ")[0].slice(1) : ""}
                  </span>

                  !
                </h1>

                {/* Subtítulo */}
                <h2
                  className="fw-light mb-2 mt-lg-0 mt-2"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    fontSize: "clamp(1.3rem, 4vw, 2.2rem)",
                    lineHeight: "1.3",
                    color: "rgba(255,255,255,0.95)",
                    letterSpacing: "-0.3px",
                  }}
                >
                  <b>Locus Store</b> es un espacio <b>dinámico</b> y en constante evolución, diseñado para que accedas fácilmente a <b>productos y servicios exclusivos</b>.
                </h2>

                {/* Descripción */}
                <p
                  className="mx-auto mb-lg-4 mb-3"
                  style={{
                    fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
                    maxWidth: "100%",
                    color: "rgba(255,255,255,0.85)",
                    lineHeight: "1.7",
                    fontSize: "clamp(1.0rem, 3vw, 1.2rem)",
                  }}
                >
                  Nuestro objetivo es brindarte un acceso <b>simple</b> y <b>confiable</b>. Cada <b>interacción</b> está diseñada para transmitir <b>cuidado</b>, <b>coherencia</b> y <b>valor</b>, garantizando que tu <b>experiencia</b> en nuestra plataforma sea siempre <b>excepcional</b>.
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




      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">
          {/* 🏷️ Título de sección con línea decorativa */}
          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.6rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Materiales de Construcción
              {/* Línea decorativa */}
              <span className="mb-lg-2"
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

          </div>






          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">



            <HorizontalCarousel />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/materialesdeconstrucciónid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>













      <section className="section-banners-home" >
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
                  width: "100px",
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

            <section className="py-lg-4 slide-up">
              <div className="container">
                <div className="row g-3">

                  <div className="col-6 col-md-6 col-lg-3">
                    <Link to="/categorias/pinturasid" className="text-decoration-none">
                      <div className="border-0 shadow-sm p-0">
                        <img
                          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759161046/pinturaslocus_mp3o3x.webp"
                          className="card-img-top mb-0 rounded"
                          alt="Pinturas"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3">
                    <Link to="/categorias/plomeríayaguaid" className="text-decoration-none">
                      <div className="border-0 shadow-sm p-0">
                        <img
                          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759161097/bombasagua_vhfetb.webp"
                          className="card-img-top rounded"
                          alt="Bombas"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3">
                    <Link to="/categorias/electricidadid" className="text-decoration-none">
                      <div className=" border-0 shadow-sm p-0">
                        <img
                          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759161149/electricidad_zivbuy.webp"
                          className="card-img-top rounded"
                          alt="Electricidad"
                        />
                      </div>
                    </Link>
                  </div>

                  <div className="col-6 col-md-6 col-lg-3">
                    <Link to="/categorias/pisosyrevestimientosid" className="text-decoration-none">
                      <div className=" border-0 shadow-sm p-0">
                        <img
                          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759527940/pisosyreves_jybscf.webp"
                          className="card-img-top rounded"
                          alt="Electricidad"
                        />
                      </div>
                    </Link>
                  </div>



                </div>
              </div>
            </section>

            {/* 🎯 Botón de acción */}
            <div className="mt-4 mb-3">
              <Link
                to="/categorias/aberturasid"
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
              </Link>
            </div>
          </div>
        </div>





















        <div className="container text-center my-lg-5 my-4 mb-0">
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
            Todo para tu proyecto
            {/* Línea decorativa */}
            <span
              style={{
                display: "block",
                height: "3px",
                width: "120px",
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
            Descubrí productos de calidad a precios accesibles y con opciones de pago flexibles</p>

          {/* 🎨 Banners */}
          <div className="row g-4 justify-content-center">
            {/* Banner 1 */}
            <div className="col-12 col-sm-6 col-md-4 slide-up">
              <Link
                to="/categorias/aberturasid"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Ir a Aberturas"
                aria-label="Ir a Aberturas"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116396/aberturas_anq9y6.webp"
                  alt="Locus Aberturas"
                  className="img-fluid w-100"
                />
              </Link>
            </div>

            {/* Banner 2 */}
            <div className="col-12 col-sm-6 col-md-4 slide-up">
              <Link
                to="/categorias/herramientaseléctricasid"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Ir a Herramientas"
                aria-label="Ir a Herramientas"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116376/maquinas_mjdq6h.webp"
                  alt="Locus Herramientas"
                  className="img-fluid w-100"
                />
              </Link>
            </div>

                        {/* Banner 2 */}
                        <div className="col-12 col-sm-6 col-md-4 slide-up">
              <Link
                to="/categorias/plomeríayaguaid"
                className="d-block shadow-sm rounded overflow-hidden"
                title="Ir a Herramientas"
                aria-label="Ir a Herramientas"
              >
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757116261/bachas_fqvnvb.webp"
                  alt="Locus Herramientas"
                  className="img-fluid w-100"
                />
              </Link>
            </div>



          </div>
        </div>


      </section>


      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">

          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.9rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Herramientas Manuales
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>







          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">







            <HorizontalHerramientas />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/herramientasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>

      <hr className="bg-black mx-5" />



      <section data-testid="site-shopping-info" className="site-shopping-info py-5 mt-lg-5">
        <div className="container">
          <div className="row g-4">

            {/* Slide 1 */}
            <div className="col-12 col-md-4 text-center info-slide">
              <div className="mb-3">
                <img
                  decoding="async"
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759502485/elegicomopagar_xveedc.svg"
                  className="img-fluid"
                  alt="Elegí cómo pagar"
                />
              </div>
              <h2>Elegí cómo pagar</h2>
              <p>
                <span>Podés pagar con tarjeta, débito, transferencia, efectivo o con Cuotas sin Tarjeta</span>
              </p>

            </div>



            {/* Slide 3 */}
            <div className="col-12 col-md-4 text-center info-slide mt-5 mt-lg-0">
              <div className="mb-2">
                <img
                  decoding="async"
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759502445/seguridad_ejvflv.svg"
                  className="img-fluid"
                  alt="Seguridad, de principio a fin"
                />
              </div>
              <h2>Seguridad, de principio a fin</h2>
              <p>
                <span>Tus datos están totalmente resguardados y protegidos, para que compres con total tranquilidad</span>
              </p>

            </div>

                        {/* Slide 2 */}
                        <div className="col-12 col-md-4 text-center info-slide mt-5 mt-lg-0">
              <div className="mb-3">
                <img
                  decoding="async"
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759502392/pedidopuntos_fqb9ys.svg"
                  className="img-fluid"
                  alt="Por cada pedido sumas puntos"
                />
              </div>
              <h2>¡Pedí y sumá puntos!</h2>
              <p>
                <span>Solo por estar registrado en Locus Store tenés envíos gratis en miles de productos</span>
              </p>
            </div>

          </div>
        </div>
      </section>

      <hr className="bg-black mx-5" />



      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">

          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Plomeria y Agua
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>


          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">

            <HorizontalPlomeYAgua />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/herramientasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>

      <section className="py-4 bg-light mb-5 slide-up mt-3">
        <div className="container">
        <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Las Mejores Marcas
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>
          <div id="marcasCarousel" className="carousel slide" data-bs-ride="carousel">

            <div className="carousel-inner p-lg-2 p-3 ">
              {/* Slide 1 */}
              <div className="carousel-item active ">
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

      <section className="mx-lg-5 mb-5 slide-up mt-4">
        <div className="container-fluid w-100 mt-3">
          {/* 🏷️ Título de sección con línea decorativa */}
          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Pinturas y Accesorios
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>






          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">



            <HorizontalPinturasYRev />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/pinturasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>



      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">

          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.8rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Servicios Disponibles
              {/* Línea decorativa */}
              <span className=""
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
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

          </div>


          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">

          <HorizontalServicios />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/herramientasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>

      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">

          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.9rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Accesorios y Seguridad
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>







          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">







            <HorizontalAccesoriosSeguridad />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/herramientasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>

      <section className="mx-lg-5 mb-5 slide-up mt-5">
        <div className="container-fluid w-100 mt-3">

          <div style={{ textAlign: "center" }}>
            <h2
              className="fw-bold mb-3 mt-lg-4"
              style={{
                color: "#054a49",
                fontSize: "clamp(1.9rem, 3vw, 2.2rem)",
                display: "inline-block",
                position: "relative",
              }}
            >
              Instalación Eléctrica
              {/* Línea decorativa */}
              <span className="mb-2"
                style={{
                  display: "block",
                  height: "3px",
                  width: "120px",
                  backgroundColor: "#FFD700",
                  margin: "8px auto 0",
                  borderRadius: "2px",
                }}
              ></span>
            </h2>

          </div>







          <div className="container px-0 bg-white shadow-sm px-2 rounded-3 p-2">







            <HorizontalElectricidad />

            {/* Botón Ver más */}
            <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
              <Link
                className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                to="/categorias/herramientasid"
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
              </Link>
            </div>

          </div>
        </div>




      </section>























    </div>
  );
};

export default Home;
