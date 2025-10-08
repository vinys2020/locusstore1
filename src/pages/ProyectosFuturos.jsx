import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import FsLightbox from "fslightbox-react";

import "./ProyectosFuturos.css";

const imagenPlaceholder = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759870263/Captura_de_pantalla_2025-10-07_a_la_s_5.50.38_p._m._ht1wak.png",
];



const galeriaUrls = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759877118/Captura_de_pantalla_2025-10-07_a_la_s_5.59.31_p._m._1_tqd9yw.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759877123/Captura_de_pantalla_2025-10-07_a_la_s_5.59.51_p._m._1_awo9gg.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759877153/Captura_de_pantalla_2025-10-07_a_la_s_6.00.19_p._m._1_s3hlnw.png",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1759877206/Captura_de_pantalla_2025-10-07_a_la_s_6.00.35_p._m._1_lutb2y.png",
];

const ProyectosFuturos = () => {
  const [lightboxController, setLightboxController] = useState({
    toggler: false,
    slide: 1,
  });
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
    <main className="pf-main bg-dark py-5">
      <div className="container">
        {/* Header */}
        <header className="text-center mb-5 ">
          <h1 className="fw-bold display-5 text-white">Planes y Proyectos Futuros</h1>
          <p className="text-white lead">
            Propuestas estratégicas en desarrollo, sujetas a la concreción de inversores y condiciones de mercado.
          </p>
        </header>

        <section
        className="hero-section rounded-4 mb-3"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dqesszxgv/image/upload/v1759870077/Captura_de_pantalla_2025-10-07_a_la_s_5.47.27_p._m._aghosi.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          width: "100%",
          
        }}
      >

      </section>

{/* Proyecto 1 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 align-items-center">
    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    Proyecto Inmobiliario <b>Tierra Alta – El Hueco, Fray Mamerto Esquiú</b>
  </h2>
  <p className="mb-3">
    <strong>Tierra Alta</strong> es un desarrollo único diseñado para quienes buscan <b>naturaleza, tranquilidad y conectividad</b>. 
    Un lugar pensado para vivir con calidad, en un entorno que inspira bienestar y confort.
  </p>
  <p className="mb-3">
    Ubicado estratégicamente sobre la <b>Ruta Provincial N°1</b>, a menos de 500 metros del futuro <b>Parque Provincial Los Palmares</b> 
    y a solo 15 minutos del centro de la capital, Tierra Alta combina acceso rápido con la serenidad del paisaje.
  </p>
  <p className="mb-3">
    Este proyecto se consolida como <b>tu lugar perfecto</b>, ofreciendo espacios pensados para el descanso, la recreación y la vida familiar.
  </p>
  <p className="small text-primary mt-3">
    En Tierra Alta, nuestra prioridad es que cada detalle te conecte con el entorno, integrando la belleza natural con la comodidad 
    de estar cerca de todo lo que necesitás.
  </p>
</div>



      <div className="col-lg-6">
        <img
          src={imagenPlaceholder[0]}
          className="d-block w-100 h-100 object-fit-cover rounded"
          alt="Proyecto El Hueco"
        />
      </div>
    </div>
  </div>
</section>


{/* Proyecto 2 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 flex-lg-row-reverse align-items-center">
    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    <b>Respirá Tranquilidad en el Valle</b>
  </h2>
  <p className="mb-3">
    En el Departamento Fray Mamerto Esquiú, Tierra Alta se proyecta como un espacio pensado para quienes valoran la serenidad y el contacto con la naturaleza. Cada lote y recorrido del proyecto aprovecha la belleza del Valle Central de Catamarca.
  </p>
  <p className="mb-3">
    Diseñado para ofrecer un estilo de vida relajado y armonioso, Tierra Alta combina espacios amplios, áreas verdes y un entorno que inspira bienestar. Cada detalle está pensado para fomentar la tranquilidad, la recreación y el disfrute de momentos en familia o con amigos.
  </p>
  <p className="mb-3">
    El crecimiento sostenido del área convierte a Tierra Alta en una elección estratégica para vivir, combinando privacidad y conexión con el entorno natural. Un lugar donde cada amanecer invita a disfrutar de calma y serenidad.
  </p>
  <p className="small text-primary mt-3">
    Descubrí un proyecto que integra la vida moderna con la calma del valle, ofreciendo un refugio para relajarte, compartir y vivir plenamente.
  </p>
</div>



      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759870911/Captura_de_pantalla_2025-10-07_a_la_s_5.55.55_p._m._1_scyof4.png"
          className="d-block w-100 rounded"
          alt="Proyecto Pozo de Mistol"
        />
      </div>
    </div>
  </div>
</section>

{/* Proyecto 3 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 align-items-center">

    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    <b>Conectividad y Cercanía</b>
  </h2>
  <p className="mb-3">
    Tierra Alta se encuentra estratégicamente próxima a rutas clave como la R.P. N°1 y la R.P. N°4, facilitando la movilidad hacia el centro de San Fernando del Valle de Catamarca y zonas aledañas. Su ubicación permite combinar tranquilidad con rápida conexión a servicios, comercios y espacios recreativos.
  </p>
  <p className="mb-3">
    A pocos minutos se encuentran plazas, avenidas principales y desarrollos urbanos, integrando la vida moderna con un entorno natural. Esto convierte al proyecto en una opción ideal para quienes buscan comodidad, accesibilidad y calidad de vida en un solo lugar.
  </p>
  <p className="mb-3">
    La cercanía al futuro Parque Provincial Los Palmares brinda además un espacio verde de esparcimiento, promoviendo actividades al aire libre y momentos de recreación para toda la familia. Cada detalle del proyecto potencia la experiencia de vivir conectado sin perder el contacto con la naturaleza.
  </p>
  <p className="small text-primary mt-3">
    Descubrí un lugar donde la conectividad se une con la tranquilidad del valle, haciendo de Tierra Alta un proyecto con todas las ventajas para tu vida cotidiana y familiar.
  </p>
</div>


      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876368/Captura_de_pantalla_2025-10-07_a_la_s_5.56.23_p._m._1_y1apha.png"
          className="d-block w-100 h-100 object-fit-cover rounded"
          alt="Proyecto Tierra Alta"
        />
      </div>

    </div>
  </div>
</section>


{/* Proyecto 4 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 flex-lg-row-reverse align-items-center">
    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    <b>Un Entorno Natural y Activo</b>
  </h2>
  <p className="mb-3">
    La zona que rodea Tierra Alta se destaca por su combinación de naturaleza y oportunidades para el deporte al aire libre. Senderos, ciclovías y espacios recreativos permiten disfrutar de actividades como ciclismo, caminatas y deportes acuáticos en el dique y la laguna cercanos.
  </p>
  <p className="mb-3">
    Con la incorporación de nuevas bicisendas y circuitos hacia el Cerro Gracián, la región se consolida como un lugar ideal para quienes buscan un estilo de vida activo, en contacto con la naturaleza y rodeado de paisajes únicos del Valle Central de Catamarca.
  </p>
  <p className="mb-3">
    Además, la presencia de hoteles, salones de eventos y complejos de cabañas refuerza el potencial turístico y residencial de la zona, haciendo de Tierra Alta un proyecto que combina comodidad, recreación y desarrollo sostenido.
  </p>
  <p className="small text-primary mt-3">
    Viví en un entorno que inspira bienestar, fomenta la vida activa y ofrece todas las ventajas de un área en pleno crecimiento y con gran potencial natural y turístico.
  </p>
</div>

      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876500/Captura_de_pantalla_2025-10-07_a_la_s_5.56.44_p._m._1_iexy6h.png"
          className="d-block w-100 rounded"
          alt="Proyecto Pozo de Mistol"
        />
      </div>
    </div>
  </div>
</section>

{/* Proyecto 5 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 align-items-center">

    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    <b>Servicios e Infraestructura</b>
  </h2>
  <p className="mb-3">
    Tierra Alta está diseñado para ofrecer confort y funcionalidad sin comprometer la conexión con la naturaleza. Cada espacio cuenta con la infraestructura necesaria para vivir con comodidad y seguridad.
  </p>
  <p className="mb-3">
    El proyecto dispone de <b>energía eléctrica</b> confiable, <b>agua potable</b> y <b>calles habilitadas y accesibles</b>, garantizando que cada lote y área común esté plenamente preparado para la vida cotidiana.
  </p>
  <p className="mb-3">
    Estos servicios esenciales se complementan con un diseño urbano pensado para facilitar la movilidad y asegurar que la naturaleza y la comodidad convivan en armonía.
  </p>
  <p className="small text-primary mt-3">
    Viví en un proyecto donde la infraestructura moderna se integra con el entorno natural, brindando practicidad, seguridad y bienestar para vos y tu familia.
  </p>
</div>


      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876599/Captura_de_pantalla_2025-10-07_a_la_s_5.57.19_p._m._1_ri0tq2.png"
          className="d-block w-100 h-100 object-fit-cover rounded"
          alt="Proyecto Tierra Alta"
        />
      </div>

    </div>
  </div>
</section>

{/* Proyecto 6 */}
<section className="pf-project pf-slide-up mb-5">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-0 flex-lg-row-reverse align-items-center">
    <div className="col-lg-6 p-4">
  <h2 className="h4 fw-bold text-dark mb-3">
    <b>Amenidades Exclusivas</b>
  </h2>
  <p className="mb-3">
    Tierra Alta cuenta con una amplia variedad de espacios diseñados para tu comodidad y disfrute. Cada amenidad está pensada para fomentar la recreación, la convivencia y la vida social dentro del proyecto.
  </p>
  <p className="mb-3">
    Entre las principales instalaciones se incluyen un <b>salón de usos múltiples con capacidad para 500 personas</b>, un <b>centro de convenciones</b> y áreas recreativas para disfrutar de actividades al aire libre.
  </p>
  <p className="mb-3">
    Además, el proyecto incorpora un <b>área comercial con 8 locales</b>, ofreciendo servicios y comercios accesibles dentro del mismo desarrollo, integrando confort y funcionalidad en un solo lugar.
  </p>
  <p className="small text-primary mt-3">
    Descubrí un proyecto que combina la vida residencial con espacios pensados para el esparcimiento, la comunidad y el bienestar integral.
  </p>
</div>


      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876734/Captura_de_pantalla_2025-10-07_a_la_s_5.57.36_p._m._1_hdtvfr.png"
          className="d-block w-100 rounded"
          alt="Proyecto Pozo de Mistol"
        />
      </div>
    </div>
  </div>
</section>

{/* Proyecto 7 */}
<section className="pf-project pf-slide-up mb-5 mt-2">
  <div className="card pf-card shadow-sm border-0 rounded-4 overflow-hidden p-0 p-lg-3">
    <div className="row g-2 align-items-center ">
      
      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876106/Captura_de_pantalla_2025-10-07_a_la_s_5.58.23_p._m._1_cqnfaf.png"
          className="d-block w-100 h-100 object-fit-cover rounded-4 "
          alt="Proyecto Tierra Alta Imagen 1"
        />
      </div>

      <div className="col-lg-6">
        <img
          src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759876029/Captura_de_pantalla_2025-10-07_a_la_s_5.58.03_p._m._1_mnxfui.png"
          className="d-block w-100 h-100 object-fit-cover rounded-4 "
          alt="Proyecto Tierra Alta Imagen 2"
        />
      </div>

    </div>
  </div>
</section>

<section
        className="hero-section rounded-4 mb-3 mt-2"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dqesszxgv/image/upload/v1759876856/Captura_de_pantalla_2025-10-07_a_la_s_5.59.01_p._m._c2azvh.png)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
          width: "100%",
          
        }}
      >

      </section>
{/* Galería de Proyecto Tierra Alta */}
<section className="pf-gallery pf-slide-up mb-5">
  <div className="row justify-content-center g-lg-3 mb-lg-5 mb-4 position-relative ">
    {/* Imagen principal */}
    <div className="col-12 col-md-8 mb-3 mb-md-0 position-relative">
      <img
        src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759877118/Captura_de_pantalla_2025-10-07_a_la_s_5.59.31_p._m._1_tqd9yw.png"
        alt="Proyecto Tierra Alta principal"
        className="img-fluid rounded-3 shadow-sm propiedad-img"
        style={{ height: "450px", objectFit: "cover", width: "100%", cursor: "pointer" }}
        onClick={() => setLightboxController({
          toggler: !lightboxController.toggler,
          slide: 1
        })}      />
    </div>

    {/* Miniaturas a la derecha */}
    <div className="col-12 col-md-4">
      <div className="row g-3">
        <div className="col-6 col-md-12 position-relative">
          <img
            src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759877123/Captura_de_pantalla_2025-10-07_a_la_s_5.59.51_p._m._1_awo9gg.png"
            alt="Proyecto Tierra Alta 2"
            className="img-fluid rounded-3 shadow-sm propiedad-img"
            style={{ height: "215px", objectFit: "cover", width: "100%", cursor: "pointer" }}
            onClick={() => setLightboxController({
              toggler: !lightboxController.toggler,
              slide: 1
            })}          />
        </div>

        <div className="col-6 col-md-12 position-relative">
          <img
            src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759877153/Captura_de_pantalla_2025-10-07_a_la_s_6.00.19_p._m._1_s3hlnw.png"
            alt="Proyecto Tierra Alta 3"
            className="img-fluid rounded-3 shadow-sm propiedad-img"
            style={{ height: "215px", objectFit: "cover", width: "100%", cursor: "pointer" }}
            onClick={() => setLightboxController({
              toggler: !lightboxController.toggler,
              slide: 1
            })}          />
          <div
            className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
            style={{
              borderRadius: "0.5rem",
              cursor: "pointer",
              textAlign: "center",
            }}
            onClick={() => setLightboxController({
              toggler: !lightboxController.toggler,
              slide: 1
            })}          >
            <span
              style={{
                backgroundColor: "rgba(0, 0, 0, 0.7)",
                padding: "0.5rem 1rem",
                borderRadius: "0.5rem",
                color: "#fff",
                fontWeight: "bold",
                fontSize: "1.25rem",
                display: "inline-flex",
                alignItems: "center",
                gap: "0.3rem",
              }}
            >
              +2 <i className="fas fa-images"></i>
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


<FsLightbox
  toggler={lightboxController.toggler}
  sources={galeriaUrls}
  slide={lightboxController.slide}
/>




      </div>
    </main>
  );
};

export default ProyectosFuturos;
