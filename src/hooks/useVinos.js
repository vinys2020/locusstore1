import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const useVinos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(db, "categorias", "vinosid", "Productosid");
        const snapshot = await getDocs(productosRef);

        const productosData = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            categoria: "vinosid", // categoría para la ruta
            ...doc.data(),
          }))
          // ❌ Filtrar productos que tengan "Caja" en el nombre
          .filter(
            (producto) =>
              !producto.nombre?.toLowerCase().includes("caja")
          );

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de vinos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useVinos;
