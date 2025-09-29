import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const useProductosHerramientas = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        // 📌 Traemos TODOS los productos de la categoría herramientas
        const productosRef = collection(
          db,
          "categorias",
          "herramientasid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "herramientasid", // 👈 propiedad añadida
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching productos de herramientas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useProductosHerramientas;
