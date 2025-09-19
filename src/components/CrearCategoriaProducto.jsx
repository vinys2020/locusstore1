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
  const [caracteristicas, setCaracteristicas] = useState([{ nombre: "", valor: "" }]);
  const [descripcion, setDescripcion] = useState("");
  const [precioFinanciacion3, setPrecioFinanciacion3] = useState(""); // 3 cuotas (+15%)
  const [precioFinanciacion6, setPrecioFinanciacion6] = useState(""); // 6 cuotas (+30%)
  const [porcentaje3, setPorcentaje3] = useState(15);
  const [porcentaje6, setPorcentaje6] = useState(30);



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
      caracteristicas: caracteristicas.filter(c => c.nombre && c.valor), // sólo con valores
      descripcion: descripcion.trim() || null,
      precio3Cuotas: precioFinanciacion3 ? Number(precioFinanciacion3) : null,
      precio6Cuotas: precioFinanciacion6 ? Number(precioFinanciacion6) : null,
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
    <div className=" rounded-4 shadow-sm text-black">
      <form onSubmit={handleSubmit}>
        <h2 className="text-dark text-center mb-lg-3">Crear Nueva Categoría</h2>

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
            onChange={(e) => {
              const valor = e.target.value;
              setProductoPrecio(valor);

              if (valor) {
                setPrecioFinanciacion3((Number(valor) * (1 + Number(porcentaje3) / 100)).toFixed(2));
                setPrecioFinanciacion6((Number(valor) * (1 + Number(porcentaje6) / 100)).toFixed(2));
              } else {
                setPrecioFinanciacion3("");
                setPrecioFinanciacion6("");
              }
            }}
            step="0.01"
            min="0"
          />

        </div>

        <div className="mb-3 row g-3">
          {/* Porcentaje para 3 cuotas */}
          <div className="col-md-6">
            <label className="form-label">Porcentaje para 3 cuotas (%)</label>
            <input
              type="number"
              className="form-control"
              value={porcentaje3}
              onChange={(e) => {
                const valor = e.target.value;
                setPorcentaje3(valor);
                if (productoPrecio) setPrecioFinanciacion3((Number(productoPrecio) * (1 + Number(valor) / 100)).toFixed(2));
              }}
              min="0"
              step="0.01"
            />
            <small className="text-muted">
              Precio final: {precioFinanciacion3 || "0"}
            </small>
          </div>

          {/* Porcentaje para 6 cuotas */}
          <div className="col-md-6">
            <label className="form-label">Porcentaje para 6 cuotas (%)</label>
            <input
              type="number"
              className="form-control"
              value={porcentaje6}
              onChange={(e) => {
                const valor = e.target.value;
                setPorcentaje6(valor);
                if (productoPrecio) setPrecioFinanciacion6((Number(productoPrecio) * (1 + Number(valor) / 100)).toFixed(2));
              }}
              min="0"
              step="0.01"
            />
            <small className="text-muted">
              Precio final: {precioFinanciacion6 || "0"}
            </small>
          </div>
        </div>

        <div className="mb-4">
          <label className="mb-2">Características principales del producto</label>
          {caracteristicas.map((item, index) => (
            <div key={index} className="mb-2 row g-2 align-items-center">
              <div className="col">
                <input
                  type="text"
                  className="form-control"
                  placeholder="Nombre de la característica"
                  value={item.nombre}
                  onChange={(e) => {
                    const newCarac = [...caracteristicas];
                    newCarac[index].nombre = e.target.value;
                    setCaracteristicas(newCarac);
                  }}
                />
              </div>
              <div className="col-auto">
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => {
                    const newCarac = caracteristicas.filter((_, i) => i !== index);
                    setCaracteristicas(newCarac);
                  }}
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}

          <button
            type="button"
            className="btn btn-primary mt-2"
            onClick={() =>
              setCaracteristicas([...caracteristicas, { nombre: "" }])
            }
          >
            + Agregar característica
          </button>
        </div>

        <div className="mb-3">
          <label className="form-label">Descripción del producto</label>
          <textarea
            className="form-control"
            rows="4"
            value={descripcion}
            onChange={(e) => setDescripcion(e.target.value)}
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
