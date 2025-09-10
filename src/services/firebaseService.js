import { db } from "../config/firebase";
import { collection, doc, setDoc } from "firebase/firestore";

export async function crearCategoriaYProducto({ categoria, producto }) {
  try {

    const categoriaId =
      categoria.nombre.toLowerCase().replace(/\s+/g, "") + "id";

    const categoriaRef = doc(db, "categorias", categoriaId);
    await setDoc(categoriaRef, categoria);

    const productoRef = doc(collection(categoriaRef, "Productosid")); 
    await setDoc(productoRef, producto);

    console.log("Categoría y producto creados correctamente");
  } catch (error) {
    console.error("Error al crear categoría y producto:", error);
    throw error;
  }
}
