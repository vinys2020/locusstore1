import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";

import "./Lotes.css";

const imagenesLote1 = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862262/Captura_de_pantalla_2025-10-07_a_la_s_3.36.25_p._m._1_a2zzwp.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862566/Captura_de_pantalla_2025-10-07_a_la_s_3.42.09_p._m._1_b4g1r5.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759862937/Captura_de_pantalla_2025-10-07_a_la_s_3.48.23_p._m._1_byw2wx.png",

];

const imagenesLote2 = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759866926/Captura_de_pantalla_2025-10-07_a_la_s_4.54.46_p._m._1_mfuggg.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759867778/Nueva_Solicitud_de_Presupuesto_3_cyflnm.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759867966/Nueva_Solicitud_de_Presupuesto_5_me20ok.jpg",

];

const imagenesLote3 = [
    "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869493/Nueva_Solicitud_de_Presupuesto_7_xwkv4g.jpg",
    "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869622/Nueva_Solicitud_de_Presupuesto_8_jyka07.jpg",
    "https://res.cloudinary.com/dqesszxgv/image/upload/v1759869719/Nueva_Solicitud_de_Presupuesto_9_ud7ljg.jpg",
  
  ];

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
    <main className="lotes-main bg-light py-5">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 text-dark">Lotes en Venta</h1>
          <p className="text-muted lead">
            Amplia oferta de lotes disponibles, pensados para proyectos residenciales, comerciales o mixtos.
          </p>
        </header>

{/* Lote 1 */}
<section className="lotes-project lotes-slide-up mb-5">
  <div className="card lotes-card shadow-lg border-0 rounded-4 overflow-hidden" style={{backgroundColor:"#261731"}}>

    {/* Carrusel de imágenes */}
    <div className="row g-0">
      <div className="col-12 ">
        <div
          id="carouselLote1"
          className="carousel slide lotes-carousel text-center rounded-top-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-top-4 overflow-hidden ">
            {imagenesLote1.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover"
                  alt={`Lote 1 - Imagen ${index + 1}`}
                  style={{ maxHeight: "480px" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselLote1"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bg-dark rounded-circle p-2"
              aria-hidden="true"

            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselLote1"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bg-dark rounded-circle p-2"
              aria-hidden="true"

            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    {/* Información del lote */}
    <div className="p-4 p-lg-5 bg-light rounded-bottom-4">
      <h2 className="fw-bold text-center mb-4 text-dark">
        Venta de Lotes –{" "}
        <span className="text-primary">
          Pozo de Mistol, San Isidro (Valle Viejo – Catamarca)
        </span>
      </h2>

      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Cliente */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Cliente</h5>
            <p className="text-muted mb-2">
              Unión del Personal Civil de la Nación – <b>UPCN</b>
            </p>
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Descripción</h5>
            <p className="text-muted mb-2">
              Se trata de <b>8 lotes</b> ubicados en una zona ideal para la
              construcción de viviendas unifamiliares.
            </p>
          </div>

          {/* Detalles por Lote */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Detalles por Lote</h5>
            <div className="bg-white rounded-3 shadow-sm p-3 small">
              <div className="row">
                <div className="col-md-6">
                  <ul className="mb-2">
                    <li><b>Lote N°21:</b> 300 m²</li>
                    <li><b>Lote N°22:</b> 300 m²</li>
                    <li><b>Lote N°23:</b> 300 m²</li>
                    <li><b>Lote N°29:</b> 336,09 m²</li>
                  </ul>
                </div>
                <div className="col-md-6">
                  <ul className="mb-2">
                    <li><b>Lote N°30:</b> 300 m²</li>
                    <li><b>Lote N°31:</b> 301,08 m²</li>
                    <li><b>Lote N°32:</b> 300 m²</li>
                    <li><b>Lote N°33:</b> 335,90 m²</li>
                  </ul>
                </div>
              </div>
              <p className="mb-0 text-end">
                <b>Precio:</b> U$S 48/m²
              </p>
            </div>
          </div>

          {/* Titularidad */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Titularidad</h5>
            <p className="text-muted mb-2">
              A nombre de <b>Benigno Calixto Rubio</b>. Dominio: Hijuela N°1 (año
              1948), inscrita bajo <b>Matrícula Folio Real N°607</b> – Departamento
              Valle Viejo.
            </p>
            <p className="text-muted mb-2">
              Plano de unificación y loteo a cargo del{" "}
              <b>Ing. Agrimensor Carlos Bustamante</b>, aprobado por la
              Municipalidad. En condiciones de escriturar en{" "}
              <b>3 meses</b>.
            </p>
          </div>

          {/* Ubicación */}
          <div className="mb-4">
            <h5 className="fw-semibold text-primary mb-1">Ubicación Estratégica</h5>
            <ul className="text-muted small mb-0">
              <li>Sobre <b>Calle Manuel Soria</b>, con acceso rápido a Capital y Valle Viejo.</li>
              <li>A <b>650 m</b> de la Av. de Circunvalación Néstor Kirchner (Ruta 38).</li>
              <li>A <b>850 m</b> de la Av. Félix Avellaneda (Ruta 33).</li>
            </ul>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/contacto"
              className="btn btn-warning fw-semibold px-4 py-2 rounded-pill shadow-sm"
            >
              Consultar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>



{/* Lote 2 */}
<section className="lotes-project lotes-slide-up mb-5">
  <div className="card lotes-card shadow-lg border-0 rounded-4 overflow-hidden " style={{backgroundColor:"#261731"}}>

    {/* Carrusel de imágenes */}
    <div className="row g-0">
      <div className="col-12">
        <div
          id="carouselLote2"
          className="carousel slide lotes-carousel text-center rounded-top-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-top-4 overflow-hidden">
            {imagenesLote2.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover"
                  alt={`Lote 2 - Imagen ${index + 1}`}
                  style={{ maxHeight: "480px" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselLote2"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselLote2"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    {/* Información del lote */}
    <div className="p-4 p-lg-5 bg-light rounded-bottom-4">
      <h2 className="fw-bold text-center mb-4 text-dark">
        Venta de Lotes –{" "}
        <span className="text-primary">
          El Hueco, Fray Mamerto Esquiú – Catamarca
        </span>
      </h2>

      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Cliente */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Cliente</h5>
            <p className="text-muted mb-2">
              Unión del Personal Civil de la Nación – <b>UPCN</b>
            </p>
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Descripción</h5>
            <p className="text-muted mb-2">
              Se trata de <b>2 lotes</b> ubicados en una región de gran potencial urbanístico y comercial dentro del Valle Central de Catamarca.
            </p>
          </div>

          {/* Detalles Catastrales */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Detalles Catastrales</h5>
            <div className="bg-white rounded-3 shadow-sm p-3 small">
              <ul className="mb-2">
                <li>
                  <b>Lote 1:</b> Matrícula Catastral 09-22-31-5673 – Superficie 60.802,72 m² – <b>U$S 6,3/m²</b>
                </li>
                <li>
                  <b>Lote 2:</b> Matrícula Catastral 09-22-31-7348 – Superficie 36.973,58 m² – <b>U$S 4,8/m²</b>
                </li>
              </ul>
            </div>
          </div>

          {/* Titularidad */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Titularidad</h5>
            <p className="text-muted mb-2">
              Propiedad registrada a nombre de <b>Rodolfo Gustavo Moyano</b> y <b>Alejandra Irupé Ocampo</b>, según Escritura N°53 del 10 de mayo de 2019.
            </p>
            <p className="text-muted mb-2">
              Inscripción en el Registro de la Propiedad y Mandatos bajo Folio Real N°3.062 y 3.066 – Departamento Fray Mamerto Esquiú.
            </p>
          </div>

          {/* Ubicación Estratégica */}
          <div className="mb-4">
            <h5 className="fw-semibold text-primary mb-1">Ubicación Estratégica</h5>
            <ul className="text-muted small mb-0">
              <li>Sobre <b>Ruta Provincial N°1</b>, con excelentes vías de acceso.</li>
              <li>A <b>10 km</b> (15 minutos en vehículo) de la Plaza Principal 25 de Mayo de la Capital.</li>
              <li>A <b>17 km</b> (20 minutos en vehículo) del Dique Las Pirquitas.</li>
              <li>A <b>350 m</b> al norte se está desarrollando el Parque Provincial El Palmeral.</li>
            </ul>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/contacto"
              className="btn btn-warning fw-semibold px-4 py-2 rounded-pill shadow-sm"
            >
              Consultar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* Lote 3 */}
<section className="lotes-project lotes-slide-up mb-5">
  <div className="card lotes-card shadow-lg border-0 rounded-4 overflow-hidden " style={{backgroundColor:"#261731"}}>

    {/* Carrusel de imágenes */}
    <div className="row g-0">
      <div className="col-12">
        <div
          id="carouselLote3"
          className="carousel slide lotes-carousel text-center rounded-top-4"
          data-bs-ride="carousel"
        >
          <div className="carousel-inner rounded-top-4 overflow-hidden">
            {imagenesLote3.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover"
                  alt={`Lote 3 - Imagen ${index + 1}`}
                  style={{ maxHeight: "480px" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev"
            type="button"
            data-bs-target="#carouselLote3"
            data-bs-slide="prev"
          >
            <span
              className="carousel-control-prev-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>
          <button
            className="carousel-control-next"
            type="button"
            data-bs-target="#carouselLote3"
            data-bs-slide="next"
          >
            <span
              className="carousel-control-next-icon bg-dark rounded-circle p-2"
              aria-hidden="true"
            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    {/* Información del lote */}
    <div className="p-4 p-lg-5 bg-white rounded-bottom-4">
      <h2 className="fw-bold text-center mb-4 text-dark">
        Venta de Lotes –{" "}
        <span className="text-primary">
          El Hueco, Fray Mamerto Esquiú – Catamarca
        </span>
      </h2>

      <div className="row justify-content-center">
        <div className="col-lg-10">

          {/* Cliente */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Cliente</h5>
            <p className="text-muted mb-2">
              Unión del Personal Civil de la Nación – <b>UPCN</b>
            </p>
          </div>

          {/* Descripción */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Descripción de la Propiedad</h5>
            <p className="text-muted mb-2">
              Se trata de <b>2 lotes</b> ubicados en una región de gran potencial urbanístico y comercial dentro del Valle Central de Catamarca.
            </p>
          </div>

          {/* Detalles Catastrales */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Detalles Catastrales</h5>
            <div className="bg-white rounded-3 shadow-sm p-3 small">
              <ul className="mb-2">
                <li>
                  <b>Lote 1:</b> Matrícula Catastral 09-22-31-5673 – Superficie 60.802,72 m² – <b>U$S 6,3/m²</b>
                </li>
                <li>
                  <b>Lote 2:</b> Matrícula Catastral 09-22-31-7348 – Superficie 36.973,58 m² – <b>U$S 4,8/m²</b>
                </li>
              </ul>
            </div>
          </div>

          {/* Titularidad */}
          <div className="mb-3">
            <h5 className="fw-semibold text-primary mb-1">Titularidad</h5>
            <p className="text-muted mb-2">
              Propiedad registrada a nombre de <b>Rodolfo Gustavo Moyano</b> y <b>Alejandra Irupé Ocampo</b>, según Escritura N°53 del 10 de mayo de 2019.  
              Inscripción en el Registro de la Propiedad y Mandatos bajo Folio Real N°3.062 y 3.066 – Departamento Fray Mamerto Esquiú.
            </p>
          </div>

          {/* Ubicación Estratégica */}
          <div className="mb-4">
            <h5 className="fw-semibold text-primary mb-1">Ubicación Estratégica</h5>
            <ul className="text-muted small mb-0">
              <li>Sobre <b>Ruta Provincial N°1</b>, con excelentes vías de acceso.</li>
              <li>A <b>10 km</b> (15 minutos en vehículo) de la Plaza Principal 25 de Mayo de la Capital.</li>
              <li>A <b>17 km</b> (20 minutos en vehículo) del Dique Las Pirquitas.</li>
              <li>A <b>350 m</b> al norte se está desarrollando el Parque Provincial El Palmeral.</li>
            </ul>
          </div>

          <div className="text-center mt-4">
            <Link
              to="/contacto"
              className="btn btn-warning fw-semibold px-4 py-2 rounded-pill shadow-sm"
            >
              Consultar Ahora
            </Link>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>





      </div>
    </main>
  );
};

export default LotesPage;
