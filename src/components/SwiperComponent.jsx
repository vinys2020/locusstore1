import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import "./SwiperComponent.css";
import { useNavigate } from "react-router-dom";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const promocionUrlsDesktop = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761350619/Disen%CC%83o_sin_ti%CC%81tulo_1_td6y3k.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761423156/Experiencia_Gastronomica_1_w9drdd.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761424174/Experiencia_Gastronomica_2_qyijlz.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1762462779/Dise%C3%B1o_sin_t%C3%ADtulo_1_rej77p.jpg",
];

const promocionUrlsMobile = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761350717/Disen%CC%83o_sin_ti%CC%81tulo_2_lvluk3.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761423106/Disen%CC%83o_sin_ti%CC%81tulo_3_g8ivbb.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761424810/Disen%CC%83o_sin_ti%CC%81tulo_4_dy1qbb.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1762462860/ver_mas_oombgh.jpg",
];

// 🧭 URLs correspondientes a cada slide
const slideLinks = [
  "/ProyectosFuturos",
  "/Esparcimiento",
  "/Lotes",
  "/Esparcimiento#vinos-section",
];


const SwiperComponent = () => {
  const isMobile = window.innerWidth <= 768;
  const images = isMobile ? promocionUrlsMobile : promocionUrlsDesktop;
  const navigate = useNavigate();

  const handleNavigate = (link) => {
    if (link.includes("#")) {
      const [path, hash] = link.split("#");
      navigate(path);
      setTimeout(() => {
        const section = document.getElementById(hash);
        if (section) section.scrollIntoView({ behavior: "smooth" });
      }, 300);
    } else {
      navigate(link);
    }
  };
  

  return (
    <div className="swiper-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={{ clickable: true }}
        loop={true}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        className="custom-swiper"
      >
        {images.map((image, index) => (
          <SwiperSlide
            key={index}
            className="swiper-slide-custom"
            onClick={() => handleNavigate(slideLinks[index])}
            style={{ cursor: "pointer" }}
          >
            <img
              src={image}
              alt={`Promoción ${index + 1}`}
              className="swiper-image"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
