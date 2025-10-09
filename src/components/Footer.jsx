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
            <h6 className="">Medios de pago</h6>
            <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
              <div className="d-flex flex-wrap gap-2 justify-content-center justify-content-md-start">
                <img src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757440161/visa_2x_la3lfi.png" alt="Visa" height="30" />
                <img src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757442922/mastercard_2x_qlp3sk.png" alt="Mastercard" height="30" />
                <img src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757442926/tarjeta-naranja_2x_ohravu.png" alt="Amex" height="30" />
                <img src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757443047/amex_2x_w20vu7.png" alt="Pago Fácil" height="30" />
                <img src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757443156/tarjeta-shopping_2x_tsejmn.png" alt="Rapipago" height="30" />
              </div>

            </div>
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
