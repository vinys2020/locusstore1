import React from "react";
import locustoreLogo from "../assets/logolocus.png";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import "./PreFooter.css";

const PreFooter = () => {
  return (
    <section className="prefooter bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-5">

{/* LOGO Y SOBRE NOSOTROS */}
<article className="col-12 col-sm-6 col-lg-3 text-center text-sm-start">
  <img 
    src={locustoreLogo} 
    alt="Locus Store Logo" 
    className="mb-3 mx-auto mx-sm-0" 
    style={{ maxWidth: "300px" }} 
  />
  <h3 className="h5 mb-3 fw-bold text-warning">Locus Store</h3>
  <p className="text-light opacity-75 mb-3" style={{ lineHeight: "1.6" }}>
    Tu plataforma confiable para materiales de construcción. 
    Explora nuestro catálogo actualizado, descubrí promociones exclusivas 
    y accedé a asesoramiento profesional para tus proyectos.
  </p>
</article>


          {/* CONTACTO */}
          <article className="col-12 col-sm-6 col-lg-3 text-center text-sm-start">
            <h3 className="h5 mb-2 border-bottom pb-2">Contacto</h3>
            <ul className="list-unstyled fs-6 mb-0 lh-lg">
              <li className="d-flex align-items-start mb-2">
                <i className="bi bi-geo-alt-fill me-2 fs-5 text-warning"></i>
                Av. Principal 123 – Ciudad, Argentina
              </li>
              <li className="d-flex align-items-start mb-2">
                <i className="bi bi-envelope-fill me-2 fs-5 text-warning"></i>
                <a href="mailto:info@locustore.com" className="text-warning text-decoration-none">
                  info@locustore.com
                </a>
              </li>
              <li className="d-flex align-items-start">
                <i className="bi bi-telephone-fill me-2 fs-5 text-warning"></i>
                <a href="tel:+5493814685931" className="text-warning text-decoration-none">
                  +54 9 381 4685931
                </a>
              </li>
            </ul>
          </article>

          {/* ENLACES RÁPIDOS */}
          <article className="col-12 col-sm-6 col-lg-3 text-center text-sm-start">
            <h3 className="h5 mb-2 border-bottom pb-2">Enlaces</h3>
            <ul className="list-unstyled fs-6 lh-lg">
              <li><a href="/" className="text-warning text-decoration-none">Inicio</a></li>
              <li><a href="/beneficios" className="text-warning text-decoration-none">Beneficios</a></li>
              <li><a href="/productos" className="text-warning text-decoration-none">Productos</a></li>
              <li><a href="/noticias" className="text-warning text-decoration-none">Noticias</a></li>
              <li><a href="/contacto" className="text-warning text-decoration-none">Contacto</a></li>
              <li><a href="/micuenta" className="text-warning text-decoration-none">Mi Cuenta</a></li>
            </ul>
          </article>

          {/* REDES SOCIALES */}
          <article className="col-12 col-sm-6 col-lg-3 text-center text-sm-start">
            <h3 className="h5 mb-3 border-bottom pb-2">Seguinos</h3>
            <div className="d-flex justify-content-center justify-content-sm-start gap-3">
              <a
                href="https://facebook.com/locusstore"
                className="text-warning d-inline-flex align-items-center justify-content-center rounded-circle border border-warning"
                target="_blank"
                rel="noreferrer"
                style={{ width: "40px", height: "40px" }}
              >
                <FaFacebookF size={18} />
              </a>

              <a
                href="https://instagram.com/locusstore"
                className="text-warning d-inline-flex align-items-center justify-content-center rounded-circle border border-warning"
                target="_blank"
                rel="noreferrer"
                style={{ width: "40px", height: "40px" }}
              >
                <FaInstagram size={18} />
              </a>

              <a
                href="https://wa.me/5493814685931"
                className="text-warning d-inline-flex align-items-center justify-content-center rounded-circle border border-warning"
                target="_blank"
                rel="noreferrer"
                style={{ width: "40px", height: "40px" }}
              >
                <FaWhatsapp size={18} />
              </a>
            </div>
          </article>

        </div>
      </div>
    </section>
  );
};

export default PreFooter;
