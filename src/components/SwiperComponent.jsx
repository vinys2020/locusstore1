import React from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";
import "./SwiperComponent.css";

import { Navigation, Pagination, Autoplay } from "swiper/modules";

const promocionUrlsDesktop = [
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517729/awt4b3kruauwgra2nuij.webp",
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517745/ggrylhcqqd5yr8nsspkr.webp",
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517763/rm9uuf1wzc8hxwhxvlwk.webp",
];

const promocionUrlsMobile = [
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517799/tjdbhu9ede103or7fejk.webp",
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517811/xmq8qvm8t6qazifrseys.webp",
  "https://res.cloudinary.com/dcggcw8df/image/upload/v1751517835/fzyksm5gk2mggvlme2mz.webp",
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
        pagination={{ clickable: true }}
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
