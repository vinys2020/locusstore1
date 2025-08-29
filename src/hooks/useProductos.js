import { useEffect, useState } from "react";
import { collectionGroup, getDocs, query, where, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

const useProductos = () => {
  const [productos, setProductos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProductos = async () => {
      const productosRef = collectionGroup(db, "Productosid");

      const q = query(
        productosRef,
        where("activo", "==", true),
        orderBy("activo", "asc")
      );

      try {
        const snapshot = await getDocs(q);
        const productosData = snapshot.docs.map(doc => {
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
