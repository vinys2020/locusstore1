import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const useElectricidad = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(
          db,
          "categorias",
          "electricidadid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "electricidadid", // 👈 agregamos categoría para la ruta
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de electricidad:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useElectricidad;
