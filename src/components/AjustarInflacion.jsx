// AjustarInflacion.jsx
import React, { useState, useEffect } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "../config/firebase";

const AjustarInflacion = () => {
  const [categorias, setCategorias] = useState([]);
  const [porcentaje, setPorcentaje] = useState("");

  const obtenerCategorias = async () => {
    try {
      const categoriasRef = collection(db, "categorias");
      const snapshot = await getDocs(categoriasRef);
      const listaCategorias = snapshot.docs.map((doc) => doc.id);
      setCategorias(listaCategorias);
    } catch (err) {
      console.error("Error obteniendo categorías:", err);
    }
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  const aumentarPreciosCategoria = async (categoriaId, porcentaje) => {
    try {
      const productosRef = collection(db, `categorias/${categoriaId}/Productosid`);
      const snapshot = await getDocs(productosRef);

      const batchPromises = snapshot.docs.map(async (docSnap) => {
        const producto = docSnap.data();
        const precioActual = Number(producto.precio || 0);

        const nuevoPrecio = Number((precioActual * (1 + porcentaje / 100)).toFixed(2));

        // Recalculamos las cuotas usando los intereses guardados o valores por defecto
        const interes3 = Number(producto.interes3 || 15);
        const interes6 = Number(producto.interes6 || 30);

        const precio3Cuotas = Number((nuevoPrecio * (1 + interes3 / 100)).toFixed(2));
        const precio6Cuotas = Number((nuevoPrecio * (1 + interes6 / 100)).toFixed(2));

        return updateDoc(doc(db, `categorias/${categoriaId}/Productosid`, docSnap.id), {
          precio: nuevoPrecio,
          precio3Cuotas,
          precio6Cuotas,
        });
      });

      await Promise.all(batchPromises);
    } catch (err) {
      console.error(`Error actualizando precios de ${categoriaId}:`, err);
      throw err;
    }
  };

  const aplicarInflacion = async () => {
    if (!porcentaje) {
      alert("Ingresa un porcentaje válido");
      return;
    }

    try {
      for (let cat of categorias) {
        await aumentarPreciosCategoria(cat, Number(porcentaje));
      }
      alert(`✅ Todos los precios y cuotas se actualizaron +${porcentaje}%`);
      setPorcentaje("");
    } catch (err) {
      alert("❌ Ocurrió un error al actualizar los precios. Revisa la consola.");
    }
  };

  return (
    <section className="my-5">
      <div className="container">
        <div className="card shadow-sm p-4 rounded-4">
          <h3 className="text-center mb-4">Ajustar por Inflación</h3>
          <div className="row g-3 align-items-end">
            <div className="col-md-6">
              <label className="form-label">Porcentaje de aumento (%)</label>
              <input
                type="number"
                className="form-control"
                placeholder="Ej: 10"
                value={porcentaje}
                onChange={(e) => setPorcentaje(e.target.value)}
                min="0"
                step="0.01"
              />
            </div>
            <div className="col-md-6 d-grid">
              <button className="btn btn-warning" onClick={aplicarInflacion}>
                Aplicar Aumento
              </button>
            </div>
          </div>
          <p className="mt-3 text-muted">
            Esto actualizará automáticamente los precios base y las cuotas de todos los productos en todas las categorías según el porcentaje ingresado.
          </p>
        </div>
      </div>
    </section>
  );
};

export default AjustarInflacion;
