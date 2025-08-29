import React from "react";
import "./Carousel.css";

const items = [
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_695687-MLA81364471168_122024-G.webp",
    alt: "SUPER OFERTAS",
    link: "https://listado.mercadolibre.com.ar/supermercado/_Discount_20-100"
  },
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_702985-MLA81633888259_122024-G.webp",
    alt: "CAPSULAS",
    link: "https://listado.mercadolibre.com.ar/supermercado/_Container_black-friday-capsulas"
  },
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_646735-MLA81364443724_122024-G.webp",
    alt: "DESECHABLES",
    link: "https://listado.mercadolibre.com.ar/supermercado/_Container_desechables"
  },
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_799360-MLA82317787351_022025-G.webp",
    alt: "CONSUMO CONSCIENTE",
    link: "https://listado.mercadolibre.com.ar/supermercado/_Container_mk-saludables25-cpg"
  },
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_833202-MLA81364584956_122024-G.webp",
    alt: "LACTEOS",
    link: "https://listado.mercadolibre.com.ar/supermercado/leches-maternizadas"
  },
  {
    image: "https://http2.mlstatic.com/D_Q_NP_2X_846703-MLA81564985462_012025-G.webp",
    alt: "MASCOTAS",
    link: "https://listado.mercadolibre.com.ar/supermercado/mascotas"
  }
];

const Carousel = () => {
  return (
    <div className="carousel-scroll-container">
      {items.map((item, index) => (
        <a
          key={index}
          href={item.link}
          className="carousel-scroll-card"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={item.image} alt={item.alt} />
        </a>
      ))}
    </div>
  );
};

export default Carousel;
