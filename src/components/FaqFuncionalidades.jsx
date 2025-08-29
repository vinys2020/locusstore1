import React from 'react';
import { FaQuestionCircle } from 'react-icons/fa';
import '../pages/ayuda.css';

const FaqFuncionalidades = () => {
  const faqs = [
    {
      pregunta: "¿Cómo uso la plataforma?",
      respuesta: "La plataforma es intuitiva: navegá por las categorías, agregá productos al carrito y finalizá tu pedido desde allí."
    },
    {
      pregunta: "¿Qué pasa después de hacer un pedido?",
      respuesta: "Una vez que completás tu pedido, recibirás un correo electrónico notificándote cuando esté listo para ser retirado."
    },
    {
      pregunta: "¿Puedo seguir el estado de mi pedido?",
      respuesta: "Sí, desde tu perfil podés consultar el estado actual de tu pedido en la sección de Mis compras."
    },
    {
      pregunta: "¿La plataforma funciona desde el celular?",
      respuesta: "Sí, podés acceder y usar todas las funciones desde cualquier dispositivo móvil sin inconvenientes."
    }
  ];


  return (
    <section className="faq-section ">
      <h2 className="faq-title text-warning"><FaQuestionCircle /> Funcionalidades</h2>
      <div className="accordion" id="funcionalidadesAccordion">
        {faqs.map((faq, index) => (
          <div className="custom-accordion-item" key={index}>
            <h2 className="accordion-header" id={`headingFuncionalidades${index}`}>
              <button
                className={`accordion-button custom-accordion-button ${index !== 0 ? 'collapsed' : ''}`}
                type="button"
                data-bs-toggle="collapse"
                data-bs-target={`#collapseFuncionalidades${index}`}
                aria-expanded={index === 0 ? "true" : "false"}
                aria-controls={`collapseFuncionalidades${index}`}
              >
                {faq.pregunta}
              </button>
            </h2>
            <div
              id={`collapseFuncionalidades${index}`}
              className={`accordion-collapse collapse ${index === 0 ? 'show' : ''}`}
              data-bs-parent="#funcionalidadesAccordion"
            >
              <div className="accordion-body custom-accordion-body mb-2 mx-2">
                {faq.respuesta}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FaqFuncionalidades;
