import React, { useState } from "react";
import { crearCategoriaYProducto } from "../services/firebaseService";

export default function CrearCategoriaProducto() {
  const [categoriaNombre, setCategoriaNombre] = useState("");
  const [categoriaImagen, setCategoriaImagen] = useState("");
  const [categoriaOrden, setCategoriaOrden] = useState("");
  const [categoriaActivo, setCategoriaActivo] = useState(true);
  const [productoNombre, setProductoNombre] = useState("");
  const [productoMarca, setProductoMarca] = useState("");
  const [productoPrecio, setProductoPrecio] = useState("");
  const [productoStock, setProductoStock] = useState("");
  const [productoImagen, setProductoImagen] = useState("");
  const [productoActivo, setProductoActivo] = useState(true);
  const [campoExtraNombre, setCampoExtraNombre] = useState("");
  const [campoExtraValor, setCampoExtraValor] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!categoriaNombre.trim() || !productoNombre.trim()) {
      alert("Por favor completa al menos los nombres de categoría y producto");
      return;
    }

    const categoria = {
      nombre: categoriaNombre.trim(),
      imagen: categoriaImagen.trim() || null,
      orden: categoriaOrden ? Number(categoriaOrden) : null,
      activo: categoriaActivo,
    };

    const producto = {
      nombre: productoNombre.trim(),
      marca: productoMarca.trim() || null,
      precio: productoPrecio ? Number(productoPrecio) : null,
      stock: productoStock ? Number(productoStock) : null,
      imagen: productoImagen.trim() || null,
      activo: productoActivo,
    };

    if (campoExtraNombre.trim()) {
      producto[campoExtraNombre.trim()] = campoExtraValor.trim();
    }

    try {
      await crearCategoriaYProducto({ categoria, producto });
      alert("Categoría y producto creados correctamente");

      setCategoriaNombre("");
      setCategoriaImagen("");
      setCategoriaOrden("");
      setCategoriaActivo(true);
      setProductoNombre("");
      setProductoMarca("");
      setProductoPrecio("");
      setProductoStock("");
      setProductoImagen("");
      setProductoActivo(true);
      setCampoExtraNombre("");
      setCampoExtraValor("");
    } catch (error) {
      alert("Error al crear categoría y producto");
      console.error(error);
    }
  };

  return (
    <div className=" bg-white p-4 rounded-4 shadow-sm text-black">
      <h2 className="text-dark text-center"><i className="bi bi-plus-circle me-2"></i>Crear Nueva Categoría</h2>
      <form onSubmit={handleSubmit}>

        <div className="mb-3">
          <label htmlFor="categoriaNombre" className="form-label">
            Nombre de la Categoría *
          </label>
          <input
            type="text"
            id="categoriaNombre"
            className="form-control"
            value={categoriaNombre}
            onChange={(e) => setCategoriaNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoriaImagen" className="form-label">
            Imagen de la Categoría (URL)
          </label>
          <input
            type="text"
            id="categoriaImagen"
            className="form-control"
            value={categoriaImagen}
            onChange={(e) => setCategoriaImagen(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="categoriaOrden" className="form-label">
            Orden (Número determina la posición jerárquica en que se muestra la categoría al usuario.)
          </label>
          <input
            type="number"
            id="categoriaOrden"
            className="form-control"
            value={categoriaOrden}
            onChange={(e) => setCategoriaOrden(e.target.value)}
          />
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="categoriaActivo"
            checked={categoriaActivo}
            onChange={() => setCategoriaActivo(!categoriaActivo)}
          />
          <label className="form-check-label" htmlFor="categoriaActivo">
            Categoría Activa
          </label>
        </div>
        <div className="alert alert-warning d-flex align-items-center" role="alert">
          <i className="bi bi-exclamation-triangle-fill me-2"></i>
          Para crear una categoría, es necesario crear al menos un producto.
        </div>

        <div className="mb-3">
          <label htmlFor="productoNombre" className="form-label">
            Nombre del Producto *
          </label>
          <input
            type="text"
            id="productoNombre"
            className="form-control"
            value={productoNombre}
            onChange={(e) => setProductoNombre(e.target.value)}
            required
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productoMarca" className="form-label">
            Marca
          </label>
          <input
            type="text"
            id="productoMarca"
            className="form-control"
            value={productoMarca}
            onChange={(e) => setProductoMarca(e.target.value)}
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productoPrecio" className="form-label">
            Precio
          </label>
          <input
            type="number"
            id="productoPrecio"
            className="form-control"
            value={productoPrecio}
            onChange={(e) => setProductoPrecio(e.target.value)}
            step="0.01"
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productoStock" className="form-label">
            Stock
          </label>
          <input
            type="number"
            id="productoStock"
            className="form-control"
            value={productoStock}
            onChange={(e) => setProductoStock(e.target.value)}
            min="0"
          />
        </div>

        <div className="mb-3">
          <label htmlFor="productoImagen" className="form-label">
            Imagen del Producto (URL)
          </label>
          <input
            type="text"
            id="productoImagen"
            className="form-control"
            value={productoImagen}
            onChange={(e) => setProductoImagen(e.target.value)}
          />
        </div>

        <div className="form-check mb-4">
          <input
            className="form-check-input"
            type="checkbox"
            id="productoActivo"
            checked={productoActivo}
            onChange={() => setProductoActivo(!productoActivo)}
          />
          <label className="form-check-label" htmlFor="productoActivo">
            Producto Activo
          </label>
        </div>


        <button type="submit" className="btn btn-success mb-4">
          Crear Categoría y Producto
        </button>
      </form>
    </div>
  );
}
