import { useEffect, useState } from "react";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../config/firebase";

const useProductoMaterialConstruccion = () => {
  const [producto, setProducto] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducto = async () => {
      try {
        const productoRef = doc(
          db,
          "categorias",
          "materialesdeconstrucciónid",
          "Productosid",
          "CRp6CAaQZxaIhv3m4QbW"
        );
        const snapshot = await getDoc(productoRef);

        if (snapshot.exists()) {
          setProducto({ id: snapshot.id, ...snapshot.data() });
        } else {
          console.warn("El producto no existe en Firestore.");
          setProducto(null);
        }
      } catch (error) {
        console.error("Error fetching product: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducto();
  }, []);

  return { producto, loading };
};

export default useProductoMaterialConstruccion;
