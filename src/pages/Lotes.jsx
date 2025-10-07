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
  <div className="card lotes-card shadow-sm border-0 rounded-4 overflow-hidden">

    {/* Carrusel de imágenes arriba */}
    <div className="row g-0">
      <div className="col-12">
        <div
          id="carouselLote1"
          className="carousel slide lotes-carousel d-flex justify-content-center align-items-center "
          style={{ maxHeight: "500px", maxWidth: "1150px", margin: "0 auto" }}

          data-bs-ride="carousel"
        >
          <div className="carousel-inner" >
            {imagenesLote1.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover rounded"
                  alt={`Lote 1 - Imagen ${index + 1}`}
                  style={{ maxHeight: "500px", maxWidth: "1250px" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
  className="carousel-control-prev d-flex align-items-center justify-content-center rounded-circle mx-2"
  type="button"
  data-bs-target="#carouselLote1"
  data-bs-slide="prev"
  style={{
    backgroundColor: "white",
    width: "50px",
    height: "50px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "1px solid #007bff",
    zIndex: 5,
  }}
>
  <span
    className="carousel-control-prev-icon p-3"
    aria-hidden="true"
    style={{
      filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)"
    }}
  ></span>
  <span className="visually-hidden">Anterior</span>
</button>

<button
  className="carousel-control-next d-flex align-items-center justify-content-center rounded-circle mx-2"
  type="button"
  data-bs-target="#carouselLote1"
  data-bs-slide="next"
  style={{
    backgroundColor: "white",
    width: "50px",
    height: "50px",
    top: "50%",
    transform: "translateY(-50%)",
    border: "1px solid #007bff",
    zIndex: 5,
  }}
>
  <span
    className="carousel-control-next-icon"
    aria-hidden="true"
    style={{
      filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)"
    }}
  ></span>
  <span className="visually-hidden">Siguiente</span>
</button>

        </div>
      </div>
    </div>

    {/* Información del lote debajo del carrusel */}
    <div className="row g-0 mt-0 p-3">
      <div className="col-12 col-lg-12 mx-auto p-lg-4 ">
        <h2 className="h2 fw-bold mb-3 text-dark text-center mt-lg-1 mt-2 ">
          Venta de Lotes – <b>Pozo de Mistol, San Isidro (Valle Viejo – Catamarca)</b>
        </h2>

        <h5 className="fw-semibold text-primary mb-2 mt-lg-4 ">Cliente</h5>
        <p className="text-muted mb-3 ">
          Unión del Personal Civil de la Nación – <b>UPCN</b>
        </p>

        <h5 className="fw-semibold text-primary mb-2 ">Descripción de la Propiedad</h5>
        <p className="text-muted mb-3 ">
          Se trata de <b>8 lotes</b> ubicados en una zona ideal para la construcción de viviendas unifamiliares.
        </p>

        <h5 className="fw-semibold text-primary mb-2 ">Detalles por Lote</h5>
        <ul className="lotes-list mb-3">
          <li><strong>Lote N°21:</strong> Superficie 300 m²</li>
          <li><strong>Lote N°22:</strong> Superficie 300 m²</li>
          <li><strong>Lote N°23:</strong> Superficie 300 m²</li>
          <li><strong>Lote N°29:</strong> Superficie 336,09 m²</li>
          <li><strong>Lote N°30:</strong> Superficie 300 m²</li>
          <li><strong>Lote N°31:</strong> Superficie 301,08 m²</li>
          <li><strong>Lote N°32:</strong> Superficie 300 m²</li>
          <li><strong>Lote N°33:</strong> Superficie 335,90 m²</li>
          <li><b>Precio:</b> U$S 48/m²</li>
        </ul>

        <h5 className="fw-semibold text-primary mb-2">Titularidad</h5>
        <p className="text-muted mb-3">
          Lotes a nombre de <b>Benigno Calixto Rubio</b>. Dominio: Hijuela N°1 (año 1948) inscrita en el Registro de la Propiedad y Mandatos bajo <b>Matrícula Folio Real N°607</b> – Departamento Valle Viejo.
        </p>
        <p className="text-muted mb-3">
          Plano de unificación y loteo a cargo del <b>Ing. Agrimensor Carlos Bustamante</b>. Plano aprobado por la Municipalidad. En condiciones de escriturar en <b>3 meses</b>.
        </p>

        <h5 className="fw-semibold text-primary mb-2">Ubicación Estratégica</h5>
        <ul className=" mb-3">
          <li>Sobre <b>Calle Manuel Soria</b>, con acceso rápido a Capital y Valle Viejo</li>
          <li>A <b>650 m</b> de la Av. de Circunvalación Néstor Kirchner (Ruta Nacional 38)</li>
          <li>A <b>850 m</b> de la Av. Félix Avellaneda (Ruta Nacional 33)</li>
        </ul>

        <div className="text-center mt-4 mb-2 mb-lg-0">
          <Link to="/contacto" className="btn btn-warning fw-semibold px-4 py-2 rounded-pill">
            Consultar Ahora
          </Link>
        </div>
      </div>
    </div>

  </div>
</section>


{/* Lote 2 */}
<section className="lotes-project lotes-slide-up mb-5">
  <div className="card lotes-card shadow-sm border-0 rounded-4 overflow-hidden">

    {/* Carrusel de imágenes arriba */}
    <div className="row g-0">
      <div className="col-12 d-flex justify-content-center">
        <div
          id="carouselLote2"
          className="carousel slide lotes-carousel d-flex justify-content-center align-items-center"
          style={{ maxWidth: "1150px", width: "100%" }}
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {imagenesLote2.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover rounded"
                  alt={`Lote 2 - Imagen ${index + 1}`}
                  style={{ maxHeight: "500px", width: "100%" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev d-flex align-items-center justify-content-center rounded-circle mx-2"
            type="button"
            data-bs-target="#carouselLote2"
            data-bs-slide="prev"
            style={{
              backgroundColor: "white",
              width: "50px",
              height: "50px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid #007bff",
              zIndex: 5,
            }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{
                filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)",
                padding: "3px",
              }}
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next d-flex align-items-center justify-content-center rounded-circle mx-2"
            type="button"
            data-bs-target="#carouselLote2"
            data-bs-slide="next"
            style={{
              backgroundColor: "white",
              width: "50px",
              height: "50px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid #007bff",
              zIndex: 5,
            }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{
                filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)",
                padding: "3px",
              }}
            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    {/* Información del lote debajo del carrusel */}
    <div className="row g-0 mt-lg-4 p-3">
      <div className="col-12 col-lg-12 mx-auto p-lg-4">
        <h2 className="h2 fw-bold mb-3 text-dark text-center mt-2">
          Venta de Lotes – <b>El Hueco, Fray Mamerto Esquiú – Catamarca</b>
        </h2>

        <h5 className="fw-semibold text-primary mb-2 mt-4">Cliente</h5>
        <p className="text-muted mb-3">
          Unión del Personal Civil de la Nación – <b>UPCN</b>
        </p>

        <h5 className="fw-semibold text-primary mb-2">Descripción de la Propiedad</h5>
        <p className="text-muted mb-3">
          Se trata de <b>2 lotes</b> ubicados en una región de gran potencial urbanístico y comercial dentro del Valle Central de Catamarca.
        </p>

        <h5 className="fw-semibold text-primary mb-2">Detalles Catastrales</h5>
        <ul className="lotes-list mb-3">
          <li><strong>Lote 1:</strong> Matrícula Catastral 09-22-31-5673 – Superficie 60.802,72 m² – <b>U$S 6,3/m²</b></li>
          <li><strong>Lote 2:</strong> Matrícula Catastral 09-22-31-7348 – Superficie 36.973,58 m² – <b>U$S 4,8/m²</b></li>
        </ul>

        <h5 className="fw-semibold text-primary mb-2">Titularidad</h5>
        <p className="text-muted mb-3">
          Propiedad registrada a nombre de <b>Rodolfo Gustavo Moyano</b> y <b>Alejandra Irupé Ocampo</b>, según Escritura N°53 del 10 de mayo de 2019. Inscripción en el Registro de la Propiedad y Mandatos bajo Folio Real N°3.062 y 3.066 – Departamento Fray Mamerto Esquiú.
        </p>

        <h5 className="fw-semibold text-primary mb-2">Ubicación Estratégica</h5>
        <ul className="mb-3">
          <li>Sobre <b>Ruta Provincial N°1</b>, con excelentes vías de acceso</li>
          <li>A <b>10 km</b> (15 minutos en vehículo) de la Plaza Principal 25 de Mayo de la Capital</li>
          <li>A <b>17 km</b> (20 minutos en vehículo) del Dique Las Pirquitas</li>
          <li>A <b>350 m</b> al norte se está desarrollando el Parque Provincial El Palmeral</li>
        </ul>

        <div className="text-center mt-4 mb-2 mb-lg-0">
          <Link to="/contacto" className="btn btn-warning fw-semibold px-4 py-2 rounded-pill">
            Consultar Ahora
          </Link>
        </div>
      </div>
    </div>

  </div>
</section>

{/* Lote 3 */}
<section className="lotes-project lotes-slide-up mb-5">
  <div className="card lotes-card shadow-sm border-0 rounded-4 overflow-hidden">

    {/* Carrusel de imágenes arriba */}
    <div className="row g-0">
      <div className="col-12 d-flex justify-content-center">
        <div
          id="carouselLote3"
          className="carousel slide lotes-carousel d-flex justify-content-center align-items-center"
          style={{ maxWidth: "1150px", width: "100%" }}
          data-bs-ride="carousel"
        >
          <div className="carousel-inner">
            {imagenesLote3.map((url, index) => (
              <div
                key={index}
                className={`carousel-item ${index === 0 ? "active" : ""}`}
              >
                <img
                  src={url}
                  className="d-block w-100 object-fit-cover rounded"
                  alt={`Lote 2 - Imagen ${index + 1}`}
                  style={{ maxHeight: "500px", width: "100%" }}
                />
              </div>
            ))}
          </div>

          {/* Controles */}
          <button
            className="carousel-control-prev d-flex align-items-center justify-content-center rounded-circle mx-2"
            type="button"
            data-bs-target="#carouselLote3"
            data-bs-slide="prev"
            style={{
              backgroundColor: "white",
              width: "50px",
              height: "50px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid #007bff",
              zIndex: 5,
            }}
          >
            <span
              className="carousel-control-prev-icon"
              aria-hidden="true"
              style={{
                filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)",
                padding: "3px",
              }}
            ></span>
            <span className="visually-hidden">Anterior</span>
          </button>

          <button
            className="carousel-control-next d-flex align-items-center justify-content-center rounded-circle mx-2"
            type="button"
            data-bs-target="#carouselLote3"
            data-bs-slide="next"
            style={{
              backgroundColor: "white",
              width: "50px",
              height: "50px",
              top: "50%",
              transform: "translateY(-50%)",
              border: "1px solid #007bff",
              zIndex: 5,
            }}
          >
            <span
              className="carousel-control-next-icon"
              aria-hidden="true"
              style={{
                filter: "invert(24%) sepia(90%) saturate(3491%) hue-rotate(196deg) brightness(97%) contrast(96%)",
                padding: "3px",
              }}
            ></span>
            <span className="visually-hidden">Siguiente</span>
          </button>
        </div>
      </div>
    </div>

    {/* Información del lote debajo del carrusel */}
    <div className="row g-0 mt-lg-4 p-3">
      <div className="col-12 col-lg-12 mx-auto p-lg-4">
        <h2 className="h2 fw-bold mb-3 text-dark text-center mt-2">
          Venta de Lotes – <b>El Hueco, Fray Mamerto Esquiú – Catamarca</b>
        </h2>

        <h5 className="fw-semibold text-primary mb-2 mt-4">Cliente</h5>
        <p className="text-muted mb-3">
          Unión del Personal Civil de la Nación – <b>UPCN</b>
        </p>

        <h5 className="fw-semibold text-primary mb-2">Descripción de la Propiedad</h5>
        <p className="text-muted mb-3">
          Se trata de <b>2 lotes</b> ubicados en una región de gran potencial urbanístico y comercial dentro del Valle Central de Catamarca.
        </p>

        <h5 className="fw-semibold text-primary mb-2">Detalles Catastrales</h5>
        <ul className="lotes-list mb-3">
          <li><strong>Lote 1:</strong> Matrícula Catastral 09-22-31-5673 – Superficie 60.802,72 m² – <b>U$S 6,3/m²</b></li>
          <li><strong>Lote 2:</strong> Matrícula Catastral 09-22-31-7348 – Superficie 36.973,58 m² – <b>U$S 4,8/m²</b></li>
        </ul>

        <h5 className="fw-semibold text-primary mb-2">Titularidad</h5>
        <p className="text-muted mb-3">
          Propiedad registrada a nombre de <b>Rodolfo Gustavo Moyano</b> y <b>Alejandra Irupé Ocampo</b>, según Escritura N°53 del 10 de mayo de 2019. Inscripción en el Registro de la Propiedad y Mandatos bajo Folio Real N°3.062 y 3.066 – Departamento Fray Mamerto Esquiú.
        </p>

        <h5 className="fw-semibold text-primary mb-2">Ubicación Estratégica</h5>
        <ul className="mb-3">
          <li>Sobre <b>Ruta Provincial N°1</b>, con excelentes vías de acceso</li>
          <li>A <b>10 km</b> (15 minutos en vehículo) de la Plaza Principal 25 de Mayo de la Capital</li>
          <li>A <b>17 km</b> (20 minutos en vehículo) del Dique Las Pirquitas</li>
          <li>A <b>350 m</b> al norte se está desarrollando el Parque Provincial El Palmeral</li>
        </ul>

        <div className="text-center mt-4 mb-2 mb-lg-0">
          <Link to="/contacto" className="btn btn-warning fw-semibold px-4 py-2 rounded-pill">
            Consultar Ahora
          </Link>
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
