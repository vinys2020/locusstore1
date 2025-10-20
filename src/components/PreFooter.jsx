import React from "react";
import locustoreLogo from "../assets/logolocus.png";
import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { Link } from "react-router-dom";

import "./PreFooter.css";

const PreFooter = () => {
  return (
    <section className="prefooter bg-dark text-white py-5">
      <div className="container">
        <div className="row gy-5">


          <article className="col-12 col-sm-6 col-lg-3 text-center ">
            <div className="d-flex justify-content-center align-items-center mb-3">
              <img
                src={locustoreLogo}
                alt="Locus Store Logo"
                style={{ maxWidth: "250px", maxHeight: "220px" }}
              />
            </div>

            <h3 className="h5 mb-2 border-bottom pb-2 text-white">Locus Store</h3>

            <p className="text-light opacity-75 mb-3" style={{ lineHeight: "1.6" }}>
              Tu plataforma confiable para comprar de una forma personalizada.
              Explora nuestro catálogo actualizado, descubrí promociones exclusivas
              y accedé a asesoramiento profesional para tus proyectos.
            </p>
          </article>


          {/* CONTACTO */}
          <article className="col-12 col-sm-6 col-lg-3 text-center text-sm-start">
            <h3 className="h5 mb-2 border-bottom pb-2">Contacto </h3>
            <ul className="list-unstyled fs-6 mb-0 lh-lg">
              <li className="d-flex align-items-start mb-2 text-warning ">
                <i className="bi bi-geo-alt-fill me-2 fs-5 "></i>
                Catamarca, Argentina
              </li>
              <li className="d-flex align-items-start mb-2">
                <i className="bi bi-envelope-fill me-2 fs-5 text-warning"></i>
                <a href="mailto:locusstore75@gmail.com" className="text-warning text-decoration-none">
                  locusstore75@gmail.com
                </a>

              </li>





            </ul>
          </article>

          {/* ENLACES RÁPIDOS */}
          <article className="col-12 col-sm-6 col-lg-6 text-center text-sm-start">
            <h3 className="h5 mb-2 border-bottom pb-2">Navegación</h3>
            <ul className="list-inline fs-6 lh-lg text-center text-sm-start">
              <li className="list-inline-item mx-2"><Link to="/home" className="text-warning text-decoration-none">Inicio</Link></li>
              <li className="list-inline-item mx-2"><Link to="/SobreNosotros" className="text-warning text-decoration-none">Sobre Nosotros</Link></li>
              <li className="list-inline-item mx-2"><Link to="/categorias/aberturasid" className="text-warning text-decoration-none">Categorias</Link></li>
              <li className="list-inline-item mx-2"><Link to="/Lotes" className="text-warning text-decoration-none">Lotes</Link></li>
              <li className="list-inline-item mx-2"><Link to="/Esparcimiento" className="text-warning text-decoration-none">Esparcimiento</Link></li>
              <li className="list-inline-item mx-2"><Link to="/ProyectosFuturos" className="text-warning text-decoration-none">Proyectos Futuros</Link></li>
              <li className="list-inline-item mx-2"><Link to="/contacto" className="text-warning text-decoration-none">Contacto</Link></li>
              <li className="list-inline-item mx-2"><Link to="/perfil" className="text-warning text-decoration-none">Mi Cuenta</Link></li>
            </ul>

          </article>



        </div>
      </div>
    </section>
  );
};

export default PreFooter;
