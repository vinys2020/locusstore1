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
  const [imagenes, setImagenes] = useState([]);
  const [productoActivo, setProductoActivo] = useState(true);
  const [campoExtraNombre, setCampoExtraNombre] = useState("");
  const [campoExtraValor, setCampoExtraValor] = useState("");
  const [caracteristicas, setCaracteristicas] = useState([]);
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
      imagenes: imagenes.length > 0 ? imagenes.map(i => i.url) : null,
      activo: productoActivo,
      caracteristicas: caracteristicas.filter(c => c), // elimina strings vacíos
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
      setImagenes([]);
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
          <div className="form-text text-muted">
            Ingresá el número sin separar miles. Por ejemplo: <strong>10000.50</strong>.
            El punto <strong>(.)</strong> indica los decimales. Una vez subido el producto se ajusta con <strong>(.) y (,)</strong>
          </div>
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
          <label className="form-label">Características</label>
          <input
            type="text"
            className="form-control"
            placeholder="Ej: resistente, impermeable, ligero"
            value={caracteristicas.join(", ")}
            onChange={(e) =>
              setCaracteristicas(
                e.target.value.split(",").map((c) => c.trim())
              )
            }
          />
          <div className="form-text text-muted">
            Copiá y pegá las características desde otro documento. Armalas fuera de este campo y luego pegá aquí separadas por comas, ya que no se permiten espacios entre ellas dentro del input.
          </div>
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
          <label className="form-label">Imágenes o Videos del Producto</label>

          {/* Lista de miniaturas */}
          <div className="d-flex flex-wrap gap-2 mb-2">
            {imagenes.map((item, index) => (
              <div key={index} className="position-relative">
                {item.type?.startsWith("video") ? (
                  <video
                    src={item.url}
                    controls
                    className="rounded shadow-sm"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                ) : (
                  <img
                    src={item.url || item} // compatibilidad con URLs directas
                    alt={`Producto ${index}`}
                    className="rounded shadow-sm"
                    style={{ width: "80px", height: "80px", objectFit: "cover" }}
                  />
                )}

                <button
                  type="button"
                  className="btn-close position-absolute top-0 end-0 bg-light rounded-circle"
                  style={{ transform: "scale(0.8)" }}
                  onClick={() =>
                    setImagenes(prev => prev.filter((_, i) => i !== index))
                  }
                />
              </div>
            ))}
          </div>

          {/* Input de subida por URL */}
          <input
            type="text"
            className="form-control mb-2"
            placeholder="Pegá la URL de la imagen o video y presiona Enter"
            onKeyDown={e => {
              if (e.key === "Enter" && e.target.value.trim()) {
                e.preventDefault();
                const url = e.target.value.trim();
                const tipoVideo = /\.(mp4|webm|ogg)$/i.test(url) ? "video/mp4" : "image";
                setImagenes(prev => [...prev, { url, type: tipoVideo }]);
                e.target.value = "";
              }
            }}
          />

          {/* Input archivos desde dispositivo */}
          <input
            type="file"
            accept="image/*,video/*"
            multiple
            className="form-control"
            onChange={async (e) => {
              if (e.target.files) {
                let nuevasImgs = [...imagenes];

                for (let i = 0; i < e.target.files.length; i++) {
                  const file = e.target.files[i];

                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "ml_default"); // tu preset de Cloudinary

                  try {
                    const res = await fetch(
                      "https://api.cloudinary.com/v1_1/dqesszxgv/upload",
                      { method: "POST", body: formData }
                    );
                    const data = await res.json();
                    if (data.secure_url) {
                      nuevasImgs.push({ url: data.secure_url, type: file.type });
                    }
                  } catch (err) {
                    console.error("Error subiendo archivo:", err);
                  }
                }

                setImagenes(nuevasImgs);
              }
            }}
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
