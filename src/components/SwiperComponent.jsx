import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import "./SwiperComponent.css";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const promocionUrlsDesktop = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761350619/Disen%CC%83o_sin_ti%CC%81tulo_1_td6y3k.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757119093/grifo2swiperlocus_rdofjq.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757119135/promo3swiperlocus_moq8ot.webp",
];

const promocionUrlsMobile = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1761350717/Disen%CC%83o_sin_ti%CC%81tulo_2_lvluk3.jpg",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757119221/promo1celularlocus_zbsbqx.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757119320/promo3celllocus_mwexbl.webp",
];

const SwiperComponent = () => {
  const isMobile = window.innerWidth <= 768;
  const images = isMobile ? promocionUrlsMobile : promocionUrlsDesktop;

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
          <SwiperSlide key={index} className="swiper-slide-custom">
            <img src={image} alt={`Promoción ${index + 1}`} className="swiper-image" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperComponent;
