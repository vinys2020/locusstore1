import React, { useEffect, useRef } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./toastStyles.css";
import dingSound from "../assets/ding.mp3";

// Botón de cierre personalizado
const CustomCloseButton = ({ closeToast, data }) => {
  const mensaje =
    typeof data?.content === "string"
      ? data.content.toLowerCase()
      : data?.content?.props?.children?.toLowerCase?.() || "";

  const esConfirmacion = mensaje.includes("pedido confirmado");

  return (
    <button className="toast-close-btn" onClick={closeToast}>
      {esConfirmacion ? "¡Gracias!" : "Aceptar"}
    </button>
  );
};

const ToastWithSound = () => {
  const audioRef = useRef(null);

  useEffect(() => {
    const playSound = () => {
      if (audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play();
      }
    };

    const unsubscribe = toast.onChange(({ status, content }) => {
      if (status === "added") {
        const mensaje =
          typeof content === "string"
            ? content.toLowerCase()
            : content?.props?.children?.toLowerCase?.() || "";

        if (mensaje.includes("pedido confirmado")) {
          playSound();
        }
      }
    });

    return () => {
      unsubscribe(); // Limpieza del listener
    };
  }, []);

  return (
    <>
      <audio ref={audioRef} src={dingSound} preload="auto" />
      <ToastContainer
        position="top-right"
        autoClose={false} // ❌ No se cierra automáticamente
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        transition={Slide}
        toastClassName="custom-toast"
        bodyClassName="custom-toast-body"
        closeButton={(props) => <CustomCloseButton {...props} />}
      />
    </>
  );
};

export default ToastWithSound;
