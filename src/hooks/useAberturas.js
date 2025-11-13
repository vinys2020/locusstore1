import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const useAberturas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(
          db,
          "categorias",
          "aberturasid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "aberturasid", // 👈 categoría de aberturas
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de aberturas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useAberturas;
