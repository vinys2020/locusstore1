import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import "./Esparcimiento.css";

const imagenes = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939226/WhatsApp_Image_2025-09-17_at_1.29.42_PM_psybhl.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939226/WhatsApp_Image_2025-09-17_at_1.29.41_PM_pdkw4g.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939226/WhatsApp_Image_2025-09-17_at_1.29.39_PM_pgovqd.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.35_PM_o86nhv.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.36_PM_iivx5r.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.30_PM_vyftzs.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.32_PM_coox3k.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.34_PM_lp3rle.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759939225/WhatsApp_Image_2025-09-17_at_1.29.40_PM_ve19av.jpg",
];

const Esparcimiento = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("esp-active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.01, rootMargin: "100px" }
    );

    const slideElements = document.querySelectorAll(".esp-slide-up");
    slideElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("esp-active");
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const images = document.querySelectorAll(".esp-img img");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    images.forEach((img) => observer.observe(img));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      {/* 🟡 MAIN 1 — Contenido e información */}
      <main className="esp-main bg-light py-0" style={{ marginTop: "90px" }}>
        {/* Hero Section */}
        <section
          className="hero-section mt-0"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dqesszxgv/image/upload/v1759939226/WhatsApp_Image_2025-09-17_at_1.29.37_PM_wcenur.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
            height: "500px",
          }}
        >
          <div className="hero-overlay d-flex align-items-center justify-content-center">
            <div className="hero-content text-center text-white">
              <h1 className="titulo-prata">El Chaperio de Mamerto</h1>
              <p className="mx-2">
                Un espacio gastronómico íntimo y exclusivo para vivir experiencias únicas.
              </p>
            </div>
          </div>
        </section>

        {/* Info Section */}
        <div className="container py-5">
          <header className="text-center mb-5">
            <h2 className="text-muted lead">
              Viví una experiencia privada de sabor y relax, Pensada para grupos de entre{" "}
              <strong>4 y 12 personas</strong>.
            </h2>
          </header>

          <section className="esp-slide-up text-center mb-5 px-3">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-0">
              <div className="card-body px-lg-4 py-5">
                <h2 className="fw-bold text-dark display-6 mb-3">
                  Experiencia Gastronómica Exclusiva
                </h2>

                <p className="text-muted fs-5 ">
                  De lunes a viernes, un solo evento por día. Reservá tu lugar y viví una propuesta
                  gourmet única en <b>El Chaperio de Mamerto</b>, donde la excelencia y el sabor
                  se encuentran en un entorno íntimo y relajado.
                </p>

                <div className="mx-auto text-center" style={{ maxWidth: "720px" }}>
                  <ul className="list-group list-group-flush">
                    <li className="text-dark py-4 border-bottom-rounded  ">
                      <div><b>Aperitivo de bienvenida</b></div>
                      <div>• Un cóctel de autor por persona</div>
                    </li>
                    <li className=" text-dark py-4 d-flex flex-column border-bottom-rounded  ">
                      <b>Entrada</b>
                      <span>• Empanada artesanal por persona</span>
                    </li>
                    <li className=" text-dark py-4 border-bottom-rounded ">
                      <div><b>Tabla de degustación</b></div>
                      <div>• Burrata o selección de quesos y fiambres criollos (para cada 6 personas)</div>

                    </li>
                    <li className=" text-dark py-4 border-bottom-rounded ">
                      <div><b>Plato principal</b></div>
                      <div>• Pescados para compartir: pacú, salmón, trucha salmonada o surubí</div>
                      <div>o</div>
                      <div>• Carnes individuales: costillas banderita u ojo de bife</div>
                    </li>
                    <li className=" text-dark py-4 border-bottom-rounded">
                      <div><b>Postre</b></div>
                      <div>• Dos opciones para compartir</div>

                    </li>
                    <li className=" text-dark py-4 border-bottom-rounded ">
                      <div><b>Agua</b></div>
                      <div>• En jarra libre durante toda la cena</div>
                    </li>
                  </ul>
                </div>

                <div className=" d-flex bg-success  text-white  justify-content-center aling-items-center fw-semibold fs-4 py-3 rounded-3 mt-4 mx-lg-5">
                  Precio: $30.000 por persona
                </div>

                <p className="text-muted mt-4 mb-0 fs-5">
                  <b>Una experiencia diseñada para disfrutar, compartir y redescubrir el placer de comer bien</b>
                </p>
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* 🟣 MAIN 2 — Galería de Fotografías (ocupa todo el ancho) */}
      <main className="esp-gallery-main mb-0">
        <section className="pt-5 bg-black esp-slide-up" id="galeria-fotos">
          <article className="col-12 d-flex justify-content-center w-100 mb-0 mt-0">
            <div className="text-center">
              <h3 style={{ color: "#fff" }}>
                Experiencia Gastronómica Exclusiva
              </h3>
              <p style={{ color: "#fff" }}>Descubrí nuevos sabores en un ambiente único</p>
            </div>
          </article>

          <article className="col-12 d-flex justify-content-center w-100 mb-0">
            <section className="esp-img mt-0">
              {imagenes.map((img, i) => (
                <img
                  key={i}
                  src={img}
                  alt={`Imagen ${i + 1}`}
                  width="100%"
                  decoding="async"
                  loading="eager"
                  onClick={() => setSelectedImage(img)}
                  style={{ cursor: "pointer" }}
                />
              ))}
            </section>
          </article>
        </section>

        {/* Modal Imagen */}
        {selectedImage && (
          <div
            className="modal fade show d-block"
            tabIndex="-1"
            style={{ backgroundColor: "rgba(0,0,0,0.8)" }}
            onClick={() => setSelectedImage(null)}
          >
            <div className="modal-dialog modal-dialog-centered modal-lg">
              <div className="modal-content bg-transparent border-0">
                <img
                  src={selectedImage}
                  alt="Vista ampliada"
                  className="w-100 rounded-4 shadow-lg"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  );
};

export default Esparcimiento;
