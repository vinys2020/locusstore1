import React, { useEffect } from "react";
import "./SobreNosotros.css";

const SobreNosotros = () => {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("active");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );

    const slideElements = document.querySelectorAll(".slide-up");

    slideElements.forEach((el) => {
      observer.observe(el);
      const rect = el.getBoundingClientRect();
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add("active");
        observer.unobserve(el);
      }
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main className="sobre-nosotros bg-light text-dark" >
      {/* Hero Section */}
      <section
        className="hero-section"
        style={{
          backgroundImage:
            "url(https://res.cloudinary.com/dqesszxgv/image/upload/v1757115686/20943816_s00t6l.jpg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "450px",
        }}
      >
        <div className="hero-overlay d-flex align-items-center justify-content-center">
          <div className="hero-content text-center text-white ">
            <h1 className="titulo-prata">Locus Store</h1>
            <p className="mx-2">
              Un espacio exclusivo para agremiados, con productos y servicios
              preferenciales.
            </p>
          </div>
        </div>
      </section>

      {/* Misión */}
      <section className="container-light py-5 ">
        <div className="text-center mx-lg-5">
          <h2 className="mb-4">Nuestra Misión</h2>
          <p>
            En <b>Locus Store</b> nuestro objetivo es crear un espacio dinámico y
            confiable donde los agremiados puedan acceder a productos y servicios
            de manera exclusiva. Brindamos una experiencia segura, ágil y
            diferenciadora para que cada usuario se sienta valorado y satisfecho.
          </p>
        </div>
      </section>

      {/* Propósito y Valores */}
      <section className="container-light py-5">
        <div className="row align-items-center">
          <article className="col-12 col-md-6 mb-4 mb-md-0 slide-up">
            <img
              className="img-fluid rounded shadow"
              src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759872671/proposi_a2lub6.webp"
              alt="Propósito y Valores"
            />
          </article>
          <article className="col-12 col-md-6 slide-up">
            <h2 className="mb-3">Propósito y Valores</h2>
            <p>
              Locus Store busca ofrecer valor real a los agremiados mediante un
              catálogo confiable y organizado. Nos guiamos por la transparencia,
              innovación y atención al detalle, asegurando que cada interacción
              sea positiva y enriquecedora.
            </p>
          </article>
        </div>
      </section>

      {/* Un Espacio Exclusivo */}
      <section className="container-light py-5">
        <div className="row align-items-center">
          <article className="col-12 col-md-6 order-md-1 mb-4 mb-md-0 slide-up">
            <h2 className="mb-3">Un Espacio Exclusivo</h2>
            <p>
            Locus Store es mucho más que un catálogo, es un punto de acceso único para que nuestros agremiados disfruten de recursos, ofertas y servicios exclusivos, pensados para su comodidad y beneficio
            </p>
          </article>  
          <article className="col-12 col-md-6 order-md-2 slide-up">
            <img
              className="img-fluid rounded shadow"
              src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759873018/Captura_de_pantalla_2025-10-07_a_la_s_6.36.28_p._m._juy38f.png"
              alt="Espacio Exclusivo"
            />
          </article>
        </div>
      </section>

      {/* Experiencia y Asesoramiento */}
      <section className="container-light py-5">
        <div className="row align-items-center">
          <article className="col-12 col-md-6 mb-4 mb-md-0 slide-up">
            <img
              className="img-fluid rounded shadow"
              src="https://res.cloudinary.com/dqesszxgv/image/upload/v1759872264/blog_4_-1_oltgaq.webp"
              alt="Asesoramiento"
            />
          </article>
          <article className="col-12 col-md-6 slide-up">
            <h2 className="mb-3">Experiencia y Asesoramiento</h2>
            <p>
              Nuestro equipo acompaña a los agremiados en cada paso, desde la
              elección de productos hasta la finalización de la compra, asegurando
              un soporte confiable y personalizado.
            </p>
          </article>
        </div>
      </section>


    </main>
  );
};

export default SobreNosotros;
