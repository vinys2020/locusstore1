import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "./SwiperMini.css";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const bannerUrlsDesktop = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
];

const bannerUrlsMobile = [
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
  "https://res.cloudinary.com/dqesszxgv/image/upload/v1757118799/swiperchiquito_ahlia4.webp",
];

const SwiperMini = () => {
  const isMobile = window.innerWidth <= 768;
  const images = isMobile ? bannerUrlsMobile : bannerUrlsDesktop;

  return (
    <div className="swiper-mini-container">
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={10}
        slidesPerView={1}
        navigation={false} // sin flechas
        loop={true}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        className="custom-swiper-mini"
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="swiper-slide-mini">
            <img
              src={image}
              alt={`Banner ${index + 1}`}
              className="swiper-image-mini"
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  );
};

export default SwiperMini;
