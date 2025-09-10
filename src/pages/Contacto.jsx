import React, { useState } from "react";
import "./Contacto.css";

const Contactos = () => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    empresa: "",
    servicio: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Formulario enviado:", formData);
    alert("¡Gracias! Tu mensaje ha sido enviado.");
    setFormData({
      nombre: "",
      email: "",
      telefono: "",
      empresa: "",
      servicio: "",
      mensaje: "",
    });
  };

  return (
    <main className="contactos-page container-fluid py-5 px-lg-5">
      <section className="row align-items-center mb-5">
        {/* Título */}
        <article className="col-12 text-center mb-5">
          <h1 className="text-dark">¿Interesado?</h1>
          <p className="fs-5 ">¡Déjanos tu mensaje y te contestamos a la brevedad!</p>
        </article>

        {/* Imagen */}
        <article className="col-12 col-lg-6  mt-0 d-flex justify-content-center">
          <img
            className="img-fluid rounded bg-transparent shadow-lg"
            id="fotoComenzar"
            src="https://res.cloudinary.com/dqesszxgv/image/upload/v1757427836/locuslogo1_trt8qx.png"
            alt="Contacto Locus Store"
          />
        </article>

        {/* Formulario */}
        <article className="col-12 col-lg-6">
          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="nombre"
                name="nombre"
                placeholder="Nombre"
                required
                value={formData.nombre}
                onChange={handleChange}
              />
              <label htmlFor="nombre">Nombre:</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="nombre@example.com"
                required
                value={formData.email}
                onChange={handleChange}
              />
              <label htmlFor="email">Correo electrónico:</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="telefono"
                name="telefono"
                placeholder="Teléfono"
                required
                value={formData.telefono}
                onChange={handleChange}
              />
              <label htmlFor="telefono">Teléfono:</label>
            </div>

            <div className="form-floating mb-2">
              <input
                type="text"
                className="form-control"
                id="empresa"
                name="empresa"
                placeholder="Nombre de Empresa"
                required
                value={formData.empresa}
                onChange={handleChange}
              />
              <label htmlFor="empresa">Nombre de Empresa:</label>
            </div>

            <div className="form-floating mb-2">
              <select
                className="form-select"
                id="servicio"
                name="servicio"
                required
                value={formData.servicio}
                onChange={handleChange}
              >
                <option value="">En qué puedo ayudarte?</option>
                <option value="Consultas generales">Consultas generales</option>
                <option value="Pedidos y entregas">Pedidos y entregas</option>
                <option value="Soporte técnico">Soporte técnico</option>
                <option value="Sugerencias">Sugerencias</option>
              </select>
              <label htmlFor="servicio">Área de interés:</label>
            </div>

            <div className="form-floating mt-4">
              <textarea
                className="form-control"
                id="mensaje"
                name="mensaje"
                placeholder="Deja un comentario"
                style={{ height: "100px" }}
                required
                value={formData.mensaje}
                onChange={handleChange}
              ></textarea>
              <label htmlFor="mensaje">Mensaje:</label>
            </div>

            <div className="mt-3 text-center">
              <button type="submit" className="btn btn-lg btn-outline-dark">
                Enviar
              </button>
            </div>
          </form>
        </article>
      </section>
    </main>
  );
};

export default Contactos;
