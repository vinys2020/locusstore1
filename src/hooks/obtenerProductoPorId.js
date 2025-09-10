import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const obtenerProductoPorId = async (categoriaId, productoId) => {
  try {
    // Ajustamos la ruta a la colección correcta
    const docRef = doc(db, `categorias/${categoriaId}/productos/${productoId}`);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return {
        id: docSnap.id,
        categoriaId,
        ...docSnap.data()
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error obteniendo producto por ID:", error);
    return null;
  }
};
