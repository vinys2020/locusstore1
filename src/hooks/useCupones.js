import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

export const obtenerCuponesUsuario = async (uid) => {
  try {
    const cuponesRef = collection(db, `usuarios/${uid}/cuponesid`);

    const snapshot = await getDocs(cuponesRef);

    if (snapshot.empty) {
      console.log(`El usuario ${uid} no tiene cupones.`);
      return []; 
    }

    const cupones = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data()
    }));

    const cuponesDisponibles = cupones.filter(
      (c) =>
        // 🔹 Ignora solo el documento con id "init"
        c.id !== "init" &&
        // 🔹 Muestra los cupones válidos
        (c.usado === false || c.usado === undefined) &&
        (c.activo === true || c.activo === undefined)
    );
    
    

    return cuponesDisponibles;
  } catch (error) {
    console.error("Error al obtener cupones:", error);
    return [];
  }
};
