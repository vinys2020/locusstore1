import { useEffect, useState } from "react";
import { collectionGroup, getDocs, query, where } from "firebase/firestore";
import { db } from "../config/firebase";

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Trae todos los documentos de cualquier subcolección "Productosid"
        const productosRef = collectionGroup(db, "Productosid");

        // Solo productos activos
        const q = query(productosRef, where("activo", "==", true));

        const snapshot = await getDocs(q);

        const productosData = snapshot.docs.map(doc => {
          // Obtener la categoría a partir de la ruta: /Categoriasid/{categoriaId}/Productosid/{productoId}
          const categoria = doc.ref.path.split("/")[1];
          return {
            id: doc.id,
            categoria,
            ...doc.data(),
          };
        });

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useProductos;
