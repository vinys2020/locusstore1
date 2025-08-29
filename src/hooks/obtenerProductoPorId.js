import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

export const obtenerProductoPorId = async (categoriaId, productoId) => {
    try {
      const docRef = doc(db, `Categoriasid/${categoriaId}/Productosid/${productoId}`);
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
  