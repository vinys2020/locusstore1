import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";

const useProductosMaterialesConstruccion = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      try {
        const productosRef = collection(
          db,
          "categorias",
          "materialesdeconstrucciónid",
          "Productosid"
        );

        const snapshot = await getDocs(productosRef);

        const productosData = snapshot.docs.map((doc) => ({
          id: doc.id,
          categoria: "materialesdeconstrucciónid", // 👈 propiedad añadida
          ...doc.data(),
        }));

        setProductos(productosData);
      } catch (error) {
        console.error(
          "Error fetching productos de materiales de construcción:",
          error
        );
      } finally {
        setLoading(false);
      }
    };

    fetchProductos();
  }, []);

  return { productos, loading };
};

export default useProductosMaterialesConstruccion;
