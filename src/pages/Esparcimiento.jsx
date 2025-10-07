import React, { useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./ProyectosFuturos.css";

const imagenPlaceholder =
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757115686/20943816_s00t6l.jpg";

const ProyectosFuturos = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("pf-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const slideElements = document.querySelectorAll(".pf-slide-up");

    slideElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("pf-active");
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="pf-main bg-light py-5">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-5 ">
          <h1 className="fw-bold display-5 text-dark">Esparcimiento</h1>
          <p className="text-muted lead">
          Amplia oferta de lotes disponibles, pensados para proyectos residenciales, comerciales o mixtos.
          </p>
        </header>

        {/* Proyecto 1 */}
        <section className="pf-project pf-slide-up mb-5">
          <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="row g-0 align-items-center">
              <div className="col-lg-6 p-4">
                <h2 className="h4 fw-bold text-primary mb-3">
                  Venta de Lotes en <b>El Hueco – Fray Mamerto Esquiú</b>
                </h2>
                <p className="text-muted mb-3">
                  Desarrollo urbanístico y comercial dentro del Valle Central de Catamarca.
                </p>
                <h5 className="fw-semibold mb-2">Detalles Catastrales</h5>
                <ul className="pf-list">
                  <li><strong>Lote 1:</strong> Matrícula 09-22-31-5673 – 60.802,72 m² – U$S 6,3/m²</li>
                  <li><strong>Lote 2:</strong> Matrícula 09-22-31-7348 – 36.973,58 m² – U$S 4,8/m²</li>
                </ul>
                <h5 className="fw-semibold mt-3 mb-2">Ubicación Estratégica</h5>
                <ul className="pf-list">
                  <li>10 km de la Plaza Principal de la Capital</li>
                  <li>17 km del Dique Las Pirquitas</li>
                  <li>350 m del futuro Parque Provincial El Palmeral</li>
                </ul>
                <p className="small text-muted mt-3">
                  Propiedad registrada bajo Escritura N°53 (2019) en el Registro de la Propiedad y Mandatos.
                </p>
              </div>

              <div className="col-lg-6">
                <div
                  id="carouselProyecto1"
                  className="carousel slide pf-carousel h-100"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner h-100">
                    <div className="carousel-item active">
                      <img
                        src={imagenPlaceholder}
                        className="d-block w-100 h-100 object-fit-cover rounded"
                        alt="Lote 1"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src={imagenPlaceholder}
                        className="d-block w-100 h-100 object-fit-cover rounded"
                        alt="Lote 2"
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselProyecto1"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselProyecto1"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Proyecto 2 */}
        <section className="pf-project pf-slide-up mb-5">
          <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden">
            <div className="row g-0 flex-lg-row-reverse align-items-center">
              <div className="col-lg-6 p-4">
                <h2 className="h4 fw-bold text-primary mb-3">
                  Venta de Lotes en Pozo de Mistol – San Isidro, Valle Viejo
                </h2>
                <p className="text-muted mb-3">
                  Proyecto ideal para viviendas unifamiliares con plano de loteo aprobado.
                </p>
                <h5 className="fw-semibold mb-2">Detalles por Lote</h5>
                <ul className="pf-list">
                  <li>Lotes N°21, 22, 23, 30, 32: 300 m²</li>
                  <li>Lote N°29: 336,09 m²</li>
                  <li>Lote N°31: 301,08 m²</li>
                  <li>Lote N°33: 335,90 m²</li>
                  <li><strong>Precio:</strong> U$S 48/m²</li>
                </ul>
                <h5 className="fw-semibold mt-3 mb-2">Ubicación</h5>
                <ul className="pf-list">
                  <li>650 m de Av. de Circunvalación Néstor Kirchner</li>
                  <li>850 m de Av. Félix Avellaneda</li>
                  <li>Calle Manuel Soria, acceso rápido a Capital y Valle Viejo</li>
                </ul>
                <p className="small text-muted mt-3">
                  Lotes en condiciones de escriturar en 3 meses – Dominio a nombre de Benigno Calixto Rubio.
                </p>
              </div>

              <div className="col-lg-6">
                <div
                  id="carouselProyecto2"
                  className="carousel slide pf-carousel h-100"
                  data-bs-ride="carousel"
                >
                  <div className="carousel-inner h-100">
                    <div className="carousel-item active">
                      <img
                        src={imagenPlaceholder}
                        className="d-block w-100 h-100 object-fit-cover rounded"
                        alt="Plano loteo"
                      />
                    </div>
                    <div className="carousel-item">
                      <img
                        src={imagenPlaceholder}
                        className="d-block w-100 h-100 object-fit-cover rounded"
                        alt="Ubicación satelital"
                      />
                    </div>
                  </div>
                  <button
                    className="carousel-control-prev"
                    type="button"
                    data-bs-target="#carouselProyecto2"
                    data-bs-slide="prev"
                  >
                    <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Anterior</span>
                  </button>
                  <button
                    className="carousel-control-next"
                    type="button"
                    data-bs-target="#carouselProyecto2"
                    data-bs-slide="next"
                  >
                    <span className="carousel-control-next-icon" aria-hidden="true"></span>
                    <span className="visually-hidden">Siguiente</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default ProyectosFuturos;
