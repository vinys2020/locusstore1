import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const usePisosYRevestimientos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // Traemos TODOS los productos de la categoría Pisos y Revestimientos
        const productosRef = collection(
          db,
          "categorias",
          "pisosyrevestimientosid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "pisosyrevestimientosid", // 👈 para navegación
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de Pisos y Revestimientos:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default usePisosYRevestimientos;
