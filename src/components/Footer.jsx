import React from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Footer.css";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-4 pb-3">
      <div className="container">

        {/* MEDIOS DE PAGO / ENVÍO */}
        <div className="row align-items-center mb-3">
        <div className="col-12 text-center text-md-start mb-3 mb-md-0">
  <h6 className="fw-bold mb-1 position-relative d-inline-block">
    Medios de Pago

  </h6>
  <p className="mb-0 text-warning" style={{ lineHeight: 1.6 }}>
  Los pagos pueden realizarse a través de <span style={{ textDecoration: "underline" }}>Financiación con entidades Bancarias</span>.
  </p>
</div>



        </div>

        <hr className="border-warning" />

        {/* COPYRIGHT / LEGAL */}
        <div className="row">
          <div className="col-12 text-center mb-2 mb-md-0">
            <span>© {new Date().getFullYear()} Locus Store. Todos los derechos reservados. Desarrollado por Publik</span>
          </div>

        </div>

      </div>
    </footer>
  );
};

export default Footer;
