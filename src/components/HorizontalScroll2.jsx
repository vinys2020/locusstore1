import React from "react";
import { Link } from "react-router-dom";

import "./HorizontalScroll2.css";

const items = [
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757430352/er_15_vvakvr.png",
    alt: "HERRAMIENTAS",
    link: "/categorias/herramientasid",
    title: "HERRAMIENTAS"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757430745/er_18_cjxquo.png",
    alt: "MATERIALES",
    link: "/categorias/materialesdeconstrucciónid",
    title: "MATERIALES"
  },

  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757431449/er_22_xwl1ae.png",
    alt: "HIERROS",
    link: "/categorias/materialesdeconstrucciónid?search=hierro",
    title: "HIERROS"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757431866/er_24_nagvs1.png",
    alt: "CEMENTO",
    link: "/categorias/materialesdeconstrucciónid?search=cemento",
    title: "CEMENTO"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757442249/er_28_hv7xgc.png",
    alt: "SERVICIOS",
    link: "/categorias/serviciosid",
    title: "SERVICIOS"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757432773/er_26_psnmrv.png",
    alt: "PROYECTOS",
    link: "/ProyectosFuturos",
    title: "PROYECTOS"
  }
];

const HorizontalScroll2 = () => {
  return (
    <div className="scroll-container-two mb-0 mb-lg-3 rounded-0">
      {items.map((item, index) => (
        <Link
          key={index}
          to={item.link}
          className="scroll-card-two"
        >
          <div className="image-container rounded-0">
            <img src={item.image} alt={item.alt} />
          </div>
          <div className="card-title">{item.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default HorizontalScroll2;
