import React from "react";
import { Link } from "react-router-dom";

import "./HorizontalScroll2.css";

const items = [
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757430352/er_15_vvakvr.png",
    alt: "OFERTAS",
    link: "/categorias/Ofertasid",
    title: "HERRAMIENTAS & ACCESORIOS"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757430745/er_18_cjxquo.png",
    alt: "CAFÉ",
    link: "/categorias/Almacenid?search=Cafe",
    title: "LADRILLOS & BLOQUES"
  },
  
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757431449/er_22_xwl1ae.png",
    alt: "LIMPIEZA",
    link: "/categorias/Articuloslimpiezaid",
    title: "HIERROS & ALAMBRES"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757431866/er_24_nagvs1.png",
    alt: "CEMENTO",
    link: "/categorias/Snacksygalletitasid",
    title: "CEMENTO & CAL"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757442249/er_28_hv7xgc.png",
    alt: "ALMACÉN",
    link: "/categorias/Almacenid",
    title: "MAQUINARIA & EQUIPOS"
  },
  {
    image: "https://res.cloudinary.com/dqesszxgv/image/upload/v1757432773/er_26_psnmrv.png",
    alt: "PROYECTOS",
    link: "/categorias/Bebidasid?search=jugo",
    title: "PROYECTOS FUTUROS"
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
            <img src={item.image} alt={item.alt}  />
          </div>
          <div className="card-title">{item.title}</div>
        </Link>
      ))}
    </div>
  );
};

export default HorizontalScroll2;
