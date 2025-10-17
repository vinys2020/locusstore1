import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import "./Lotes.css";

// Datos de los lotes
const lotes = [
  {
    id: "Lote1",
    imagenes: [
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862262/Captura_de_pantalla_2025-10-07_a_la_s_3.36.25_p._m._1_a2zzwp.png",
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862566/Captura_de_pantalla_2025-10-07_a_la_s_3.42.09_p._m._1_b4g1r5.png",
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862937/Captura_de_pantalla_2025-10-07_a_la_s_3.48.23_p._m._1_byw2wx.png",
    ],
    titulo: "Pozo de Mistol, San Isidro (Valle Viejo – Catamarca)",
    cliente: "Unión del Personal Civil de la Nación – UPCN",
    descripcion: "Se trata de 8 lotes ubicados en una zona ideal para la construcción de viviendas unifamiliares.",
    detalles: [
      { nombre: "Lote N°21", superficie: "300 m²" },
      { nombre: "Lote N°22", superficie: "300 m²" },
      { nombre: "Lote N°23", superficie: "300 m²" },
      { nombre: "Lote N°29", superficie: "336,09 m²" },
      { nombre: "Lote N°30", superficie: "300 m²" },
      { nombre: "Lote N°31", superficie: "301,08 m²" },
      { nombre: "Lote N°32", superficie: "300 m²" },
      { nombre: "Lote N°33", superficie: "335,90 m²" },
    ],
    precio: "U$S 48/m²",
    titularidad: `A nombre de Benigno Calixto Rubio. Dominio: Hijuela N°1 (año 1948), inscrita bajo Matrícula Folio Real N°607 – Departamento Valle Viejo.
Plano de unificación y loteo a cargo del Ing. Agrimensor Carlos Bustamante, aprobado por la Municipalidad. En condiciones de escriturar en 3 meses.`,
    ubicacion: [
      "Sobre Calle Manuel Soria, con acceso rápido a Capital y Valle Viejo.",
      "A 650 m de la Av. de Circunvalación Néstor Kirchner (Ruta 38).",
      "A 850 m de la Av. Félix Avellaneda (Ruta 33).",
    ],
  },
  {
    id: "Lote3",
    imagenes: [
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869493/Nueva_Solicitud_de_Presupuesto_7_xwkv4g.jpg",
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869622/Nueva_Solicitud_de_Presupuesto_8_jyka07.jpg",
      "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869719/Nueva_Solicitud_de_Presupuesto_9_ud7ljg.jpg",
    ],
    titulo: "El Hueco, Fray Mamerto Esquiú – Catamarca",
    cliente: "Unión del Personal Civil de la Nación – UPCN",
    descripcion: "Se trata de 2 lotes ubicados en una región de gran potencial urbanístico y comercial dentro del Valle Central de Catamarca.",
    detalles: [
      { nombre: "Lote 1", superficie: "Matrícula Catastral 09-22-31-5673 – Superficie 60.802,72 m² – U$S 6,3/m²" },
      { nombre: "Lote 2", superficie: "Matrícula Catastral 09-22-31-7348 – Superficie 36.973,58 m² – U$S 4,8/m²" },
    ],
    precio: null,
    titularidad: `Propiedad registrada a nombre de Rodolfo Gustavo Moyano y Alejandra Irupé Ocampo, según Escritura N°53 del 10 de mayo de 2019.
Inscripción en el Registro de la Propiedad y Mandatos bajo Folio Real N°3.062 y 3.066 – Departamento Fray Mamerto Esquiú.`,
    ubicacion: [
      "Sobre Ruta Provincial N°1, con excelentes vías de acceso.",
      "A 10 km (15 minutos en vehículo) de la Plaza Principal 25 de Mayo de la Capital.",
      "A 17 km (20 minutos en vehículo) del Dique Las Pirquitas.",
      "A 350 m al norte se está desarrollando el Parque Provincial El Palmeral.",
    ],
  },
];

const LoteCard = ({ lote }) => (
  <div className="col-md-6 col-lg-6 mb-4">
    <div className="lotes-card shadow-lg border-0 rounded-4 overflow-hidden" style={{ backgroundColor: "#261731", display: "flex", flexDirection: "column", height: "100%" }}>
      {/* Carrusel */}
      <div
        id={`carousel${lote.id}`}
        className="carousel slide lotes-carousel text-center rounded-top-4"
        data-bs-ride="carousel"
      >
        <div className="carousel-inner rounded-top-4 overflow-hidden">
          {lote.imagenes.map((url, index) => (
            <div key={index} className={`carousel-item ${index === 0 ? "active" : ""}`}>
              <img
                src={url}
                className="d-block w-100 object-fit-cover"
                alt={`${lote.id} - Imagen ${index + 1}`}
                style={{ maxHeight: "350px", width: "100%" }}
              />
            </div>
          ))}
        </div>
        <button className="carousel-control-prev" type="button" data-bs-target={`#carousel${lote.id}`} data-bs-slide="prev">
          <span className="carousel-control-prev-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Anterior</span>
        </button>
        <button className="carousel-control-next" type="button" data-bs-target={`#carousel${lote.id}`} data-bs-slide="next">
          <span className="carousel-control-next-icon bg-dark rounded-circle p-2" aria-hidden="true"></span>
          <span className="visually-hidden">Siguiente</span>
        </button>
      </div>

      {/* Info */}
      <div className="p-3 bg-light rounded-bottom-4 d-flex flex-column flex-grow-1" style={{ overflowWrap: "break-word", wordWrap: "break-word", hyphens: "auto" }}>
        <h5 className="fw-bold text-center mb-2 text-wrap">{`Venta de Lotes – ${lote.titulo}`}</h5>
        <p className="text-wrap"><b>Cliente:</b> {lote.cliente}</p>
        <p className="text-wrap"><b>Descripción:</b> {lote.descripcion}</p>

        <div className="mb-3 text-wrap bg-white rounded px-lg-2">
          <b>Detalles:</b>
          <ul className="small">
            {lote.detalles.map((d, i) => (
              <li key={i}><b>{d.nombre}:</b> {d.superficie}</li>
            ))}
          </ul>
          {lote.precio && <p className="text-end"><b>Precio:</b> {lote.precio}</p>}
        </div>

        <p className="text-wrap"><b>Titularidad:</b> {lote.titularidad}</p>

        <div className="text-wrap mb-lg-3">
          <b>Ubicación Estratégica:</b>
          <ul className="small mb-0">
            {lote.ubicacion.map((u, i) => (
              <li key={i}>{u}</li>
            ))}
          </ul>
        </div>

        <div className="text-center  mt-auto">
          <Link to="/contacto" className="btn btn-warning fw-semibold px-4 py-2 rounded-pill shadow-sm">
            Consultar Ahora
          </Link>
        </div>
      </div>
    </div>
  </div>
);


const LotesPage = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("lotes-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const slideElements = document.querySelectorAll(".lotes-slide-up");
    slideElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("lotes-active");
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="lotes-main  py-5 px-lg-5 px-2">
      <header className="text-center mb-5">
        <h1 className="fw-bold display-5 text-dark">Lotes en Venta</h1>
        <p className="text-muted lead">
          Amplia oferta de lotes disponibles, pensados para proyectos residenciales, comerciales o mixtos.
        </p>
      </header>

      <div className="row lotes-slide-up">
        {lotes.map((lote) => (
          <LoteCard key={lote.id} lote={lote} />
        ))}
      </div>
    </main>
  );
};

export default LotesPage;
