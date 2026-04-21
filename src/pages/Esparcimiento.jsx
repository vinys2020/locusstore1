import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import HorizontalVinos from "../components/HorizontalVinos";
import HorizontalVinosCaja from "../components/HorizontalVinosCaja";
import { useLocation } from "react-router-dom";

import { Link } from "react-router-dom";

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
  const navigate = useNavigate();

  const location = useLocation();

useEffect(() => {
  if (location.hash) {
    const el = document.querySelector(location.hash);
    if (el) {
      setTimeout(() => {
        el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }
}, [location]);

const handleScrollTop = () => {
  setIsOpen(false);
  if (onCloseNavbar) onCloseNavbar();

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
};


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
      <main id="chaperio-section" className=" esp-main bg-light py-0" style={{ marginTop: "90px" }}>
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
              Viví una experiencia privada de sabor y relax, pensada y armada para un grupo selecto de{" "}
              <strong>4 y 12 personas</strong>.
            </h2>
          </header>

          <section className="esp-slide-up text-center mb-5 px-lg-3">
            <div className="card border-0 shadow-lg rounded-4 overflow-hidden bg-white p-0">
              <div className="card-body px-lg-4 py-5">
                <h2 className="fw-bold text-dark display-6 mb-3">
                  Experiencia Gastronómica Exclusiva
                </h2>

                <p className="text-muted fs-5 ">
                  De lunes a jueves, un solo evento por día. Reservá tu lugar y viví una propuesta
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
                      <div><b>Agua Saborizada</b></div>
                      <div>• En jarra libre durante todo el evento </div>
                    </li>
                  </ul>
                </div>

                <div className="d-flex justify-content-center gap-3 mt-4 mx-lg-5">
                  {/* Botón de Precio */}
                  <div
                    className="bg-success text-white d-flex justify-content-center align-items-center fw-semibold fs-4 py-3 px-4 rounded-3"
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/categorias/serviciosid/producto/PX7tNOzWacOQkRWWhXju")
                    }
                  >
                    $36.000 por persona
                  </div>

                  {/* Botón Comprar */}
                  <button
                    className="btn btn-warning fw-semibold fs-5 py-3 px-4 rounded-3"
                    onClick={() =>
                      navigate("/categorias/serviciosid/producto/PX7tNOzWacOQkRWWhXju")
                    }
                  >
                    Comprar
                  </button>
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
      <main className="esp-gallery-main pb-5">
        <section className="pt-5 bg-black esp-slide-up" id="galeria-fotos" >
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
            className="modal fade show d-block "
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

      {/* 🟡 MAIN 3 — Contenido e información */}
      <main id="laguarda" className="esp-main bg-light" style={{ marginTop: "0px" }}>
        {/* Hero Section */}
        <section
          className="hero-section hero-responsive mt-0"
          style={{
            backgroundImage:
              "url(https://res.cloudinary.com/dqesszxgv/image/upload/v1762457801/laguarda2_mhcb3o.jpg)",
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        >

        </section>

        {/* Info Section */}
        <div className="container py-5">
          <header className="text-center mb-5">
            <h2 className="text-muted fs-4">
              Una experiencia de cata privada en <strong>La Guarda</strong>, ideal para grupos de
              <strong> 4 a 20 personas</strong>.
            </h2>
          </header>

          {/* 🟣 SECCIÓN VINOS - LA GUARDA */}
          <section className="py-5 bg-white" >
            <div className="container">
              <header className="text-center mb-5">
                <h1><b>La Guarda</b></h1>
                <h3 className=" row text-white justify-content-center text-center" style={{ backgroundColor: "black", }}>Vinoteca & Accesorios</h3>


              </header>

              {/* Fila 1 */}
              <div className="row align-items-center mb-5">
                <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                  <img
                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762459051/WhatsApp_Image_2025-10-30_at_11.36.12_AM_12_krnvra.jpg"
                    alt="Vino tinto La Guarda"
                    className="img-fluid rounded-4 shadow-sm"
                  />
                </div>
                <div className="col-md-6">
                  <h3 className="fw-bold mb-3 p-2 text-start">Explora Nuestros Vinos</h3>
                  <p className="text-muted fs-4 p-2">
                    En <strong>La Guarda</strong> contamos con una amplia selección de vinos cuidadosamente
                    elegidos para cada ocasión. Desde etiquetas jóvenes y frescas hasta líneas reserva
                    y gran reserva, nuestra vinoteca reúne bodegas que reflejan la identidad, el clima
                    y la pasión por el buen vino.
                    <br /><br />
                    Proponemos un recorrido por distintos estilos y variedades, pensado tanto para
                    quienes dan sus primeros pasos en el mundo del vino como para los paladares más
                    exigentes.
                    <br /><br />
                    <em>Vinos que inspiran momentos, celebran encuentros y acompañan la experiencia
                      de disfrutar con todos los sentidos.</em>
                  </p>
                </div>

              </div>

              {/* Fila 2 */}
              <div className="row align-items-center flex-md-row-reverse mb-5">
                <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                  <img
                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762459134/WhatsApp_Image_2025-10-30_at_11.36.12_AM_9_encr0x.jpg"
                    alt="Vino blanco La Guarda"
                    className="img-fluid rounded-4 shadow-sm"
                  />
                </div>
                <div className="col-md-6">
                  <h3 className="fw-semibold mb-3 p-2">Experiencia de Cata Exclusiva</h3>
                  <p className="text-muted fs-4 p-2">
                    En <strong>La Guarda</strong> te invitamos a vivir una experiencia sensorial única,
                    donde cada copa cuenta una historia. Nuestros expertos te guiarán en un recorrido
                    por los secretos del vino, explorando sus aromas, texturas y matices, en un ambiente
                    íntimo y cuidadosamente diseñado.
                    <br /><br />
                    La cata incluye una selección especial de etiquetas premium, acompañadas por
                    maridajes que realzan cada sabor y elevan el momento. Ideal para disfrutar entre
                    amigos, celebrar una ocasión especial o simplemente dejarte llevar por el placer
                    del buen vino.
                    <br /><br />
                    Cupos limitados para grupos de entre <strong>4 y 20 personas</strong>.
                    Descubrí el arte de degustar, sentir y compartir el vino como nunca antes.
                  </p>
                </div>

              </div>

              {/* Fila 3 */}
              <div className="row align-items-center mb-5">
                <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                  <img
                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762459241/WhatsApp_Image_2025-10-30_at_11.36.12_AM_11_xodv1w.jpg"
                    alt="Espumantes La Guarda"
                    className="img-fluid rounded-4 shadow-sm"
                  />
                </div>
                <div className="col-md-6">
                  <h4 className="fw-semibold mb-3">Vinos de Bodegas Selectas</h4>
                  <p className="text-muted fs-5">
                    En <strong>La Guarda</strong> trabajamos con reconocidas bodegas como <strong>El Martín Fierro</strong> y
                    <strong> La Quebrada</strong>, referentes en la producción de vinos auténticos y de carácter distintivo.
                    <br /><br />
                    Cada etiqueta refleja la dedicación, el clima y la nobleza de su origen, ofreciendo una experiencia sensorial
                    única en cada copa. Nuestra selección reúne vinos equilibrados, intensos y elegantes, ideales para quienes
                    buscan calidad y expresión en cada degustación.
                  </p>
                </div>

              </div>


              {/* Fila 4 */}
              <div className="row align-items-center flex-md-row-reverse mb-5">
                <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                  <img
                    src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762460320/Disen%CC%83o_sin_ti%CC%81tulo_6_eaip5n.jpg"
                    alt="Vino blanco La Guarda"
                    className="img-fluid rounded-4 shadow-sm"
                  />
                </div>
                <div className="col-md-6">
                  <h4 className="fw-semibold mb-3">Colección Las Perdices & Partridge</h4>
                  <p className="text-muted fs-5">
                    En <strong>La Guarda</strong> contamos con una distinguida selección de vinos de
                    <strong> Las Perdices</strong> y <strong> Partridge</strong>, reconocidas bodegas que combinan
                    tradición, innovación y carácter en cada etiqueta.
                    <br /><br />
                    Vinos que destacan por su equilibrio, elegancia y autenticidad, ideales para disfrutar en toda ocasión.
                  </p>
                </div>


              </div>
            </div>

            <section className="mx-lg-5 mb-5 esp-slide-up mt-5">
              <div className="container-fluid w-100 mt-3">

                <div style={{ textAlign: "center" }}>
                  <h2
                    className="fw-bold mb-3 mt-lg-4"
                    style={{
                      color: "#054a49",
                      display: "inline-block",
                      position: "relative",
                    }}
                  >
                    Conocé mas de nuestros productos
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







                  <HorizontalVinos />

                  {/* Botón Ver más */}
                  <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
                    <Link
                      className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                      to="/categorias/vinosid"
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

            <div className="row align-items-center mb-5">
              <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762610765/caja1_f65tj4.jpg"
                  alt="Vino tinto La Guarda"
                  className="img-fluid rounded-4 shadow-sm "
                  style={{ maxHeight: "800px", objectFit: "cover", width: "100%" }}
                />
              </div>
              <div className="col-md-6">
                <h3 className="fw-bold mb-3 p-2 text-start">Descubrí Nuestras Cajas de Vinos</h3>
                <p className="text-muted fs-4 p-2">
                  En <strong>La Guarda</strong> no solo ofrecemos vinos individuales, sino también
                  <strong> exclusivas cajas de vinos</strong> ideales para regalar, compartir o disfrutar en casa.
                  Cada presentación combina etiquetas seleccionadas que reflejan lo mejor de cada bodega y la
                  esencia de nuestros terroirs.
                  <br /><br />
                  Encontrá <strong>cajas temáticas</strong>, ediciones especiales y opciones personalizadas,
                  pensadas para quienes buscan una experiencia completa alrededor del vino.
                  <br /><br />
                  <em>Cajas que cuentan historias, celebran momentos y convierten cada descorche en una experiencia única.</em>
                </p>
              </div>


            </div>

            {/* Fila 2 */}
            <div className="row align-items-center flex-md-row-reverse mb-5">
              <div className="col-md-6 mb-4 mb-md-0 esp-slide-up">
                <img
                  src="https://res.cloudinary.com/dqesszxgv/image/upload/v1762610765/caja2_dx59ch.jpg"
                  alt="Vino blanco La Guarda"
                  className="img-fluid rounded-4 shadow-sm"
                  style={{ maxHeight: "800px", objectFit: "cover", width: "100%" }}

                />
              </div>
              <div className="col-md-6">
                <h3 className="fw-semibold mb-3 p-2">Vinos en Formato Bag in Box</h3>
                <p className="text-muted fs-4 p-2">
                  En <strong>La Guarda</strong> te presentamos una nueva forma de disfrutar el vino:
                  el <strong>formato Bag in Box</strong>, una opción moderna, práctica y sustentable
                  que conserva toda la calidad y frescura del vino por más tiempo.
                  <br /><br />

                  Este formato permite disfrutar de una <strong>excelente relación calidad-precio</strong>,
                  ideal para reuniones, eventos o simplemente para tener siempre a mano un vino de calidad.
                  Cada Bag in Box mantiene el vino en condiciones óptimas desde la primera hasta la última copa.
                  <br /><br />
                  <em>Una nueva forma de vivir el vino — auténtica, conveniente y con el sello de excelencia de
                    <strong> La Guarda</strong>.</em>
                </p>
              </div>


            </div>

            <section className="mx-lg-5 mb-5 esp-slide-up mt-5">
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
                    Compra tu Caja de Vinos aquí
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







                  <HorizontalVinosCaja />

                  {/* Botón Ver más */}
                  <div className="d-flex justify-content-end px-2 mt-0 bg-white py-2 border-top">
                    <Link
                      className="ui-recommendations-footer__link d-flex align-items-center text-decoration-none mt-1"
                      to="/categorias/vinosid"
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









          </section>








        </div>
      </main>

    </>
  );
};

export default Esparcimiento;
