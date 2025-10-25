// src/components/PuntosDropdown.jsx
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const PuntosDropdown = ({ pedido }) => {
  const asignarPuntos = async (puntos) => {
    try {
      const pedidoRef = doc(db, "pedidos", pedido.id);
      const pedidoSnap = await getDoc(pedidoRef);
      if (!pedidoSnap.exists()) return;

      const pedidoData = pedidoSnap.data();

      // 1️⃣ Actualizar estado del pedido
      await updateDoc(pedidoRef, { estado: "completado" });

      // 2️⃣ Actualizar puntos del usuario
      if (pedidoData.userId) {
        const usuarioRef = doc(db, "usuarios", pedidoData.userId);
        const usuarioSnap = await getDoc(usuarioRef);
        if (usuarioSnap.exists()) {
          const usuarioData = usuarioSnap.data();
          const puntosActuales = usuarioData.puntos || 0;
          await updateDoc(usuarioRef, { puntos: puntosActuales + puntos });
        }
      }

      console.log(`Pedido completado y ${puntos} puntos sumados al usuario`);
    } catch (error) {
      console.error("Error al completar el pedido y sumar puntos:", error);
    }
  };

  return (
    <div className="dropdown w-100 w-md-auto">
      <button
        className="btn btn-success btn-sm dropdown-toggle w-100 w-md-auto text-white"
        type="button"
        id={`dropdownPuntos-${pedido.id}`}
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Completado
      </button>
      <ul className="dropdown-menu" aria-labelledby={`dropdownPuntos-${pedido.id}`}>
        {[5, 10, 20].map((p) => (
          <li key={p}>
            <button className="dropdown-item" onClick={() => asignarPuntos(p)}>
              {p} puntos
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PuntosDropdown;
