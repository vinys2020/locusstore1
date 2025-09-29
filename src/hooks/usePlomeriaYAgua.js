import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const usePlomeriaYAgua = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(
          db,
          "categorias",
          "plomeríayaguaid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "plomeríayaguaid", // 👈 agregamos categoría para la ruta
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de plomería y agua:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default usePlomeriaYAgua;
