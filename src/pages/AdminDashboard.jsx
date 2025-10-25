import React, { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
} from "firebase/firestore";
import CrearCategoriaProducto from "../components/CrearCategoriaProducto";
import { db } from "../config/firebase";
import AjustarInflacion from "../components/AjustarInflacion";
import AdminPresupuesto from "../components/AdminPresupuesto"; // ajustá la ruta si es necesario
import AdminUsers from "../components/AdminUsers";
import EstadisticasAdm from "../components/EstadisticasAdm";
import ResumenEstadisticas from "../components/ResumenEstadisticas";
import PagosCuotas from "../components/PagosCuotas";







import "./admindashboard.css";

const AdminDashboard = () => {
  const [productos, setProductos] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState("");
  const [busqueda, setBusqueda] = useState("");
  const [nuevoProducto, setNuevoProducto] = useState({
    nombre: "",
    precio: "",
    imagen: "",
    marca: "",
    stock: "",
    contenido: "",
    descripcion: "",
    caracteristicas: [],
    precio3Cuotas: "",
    precio6Cuotas: "",
    activo3: true,
    activo6: true,
  });


  // ✅ Obtener categorías y seleccionar la primera por defecto
  const obtenerCategorias = async () => {
    try {
      const categoriasRef = collection(db, "categorias");
      const data = await getDocs(categoriasRef);
      const categoriasList = data.docs.map((doc) => doc.id);
      setCategorias(categoriasList);

      // Seleccionar primera categoría automáticamente
      if (categoriasList.length > 0 && !categoriaSeleccionada) {
        setCategoriaSeleccionada(categoriasList[0]);
      }
    } catch (err) {
      console.error("Error obteniendo categorías:", err);
    }
  };

  // ✅ Subida de imagen a Cloudinary
  const subirImagenCloudinary = async (file, productoId, imagenesPrevias = []) => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", "ml_default");

    try {
      const res = await fetch(
        "https://api.cloudinary.com/v1_1/dqesszxgv/upload",
        { method: "POST", body: formData }
      );
      const data = await res.json();
      if (data.secure_url) {
        // Agregamos la nueva URL al array de imágenes existente
        const nuevasImgs = [...imagenesPrevias, data.secure_url];
        await actualizarProducto(productoId, "imagenes", nuevasImgs);
      }
    } catch (err) {
      console.error("Error subiendo imagen a Cloudinary:", err);
    }
  };


  // ✅ Escuchar productos en tiempo real
  const escucharProductos = () => {
    if (!categoriaSeleccionada) return;

    const productosRef = collection(
      db,
      `categorias/${categoriaSeleccionada}/Productosid`
    );

    return onSnapshot(
      productosRef,
      (snapshot) => {
        const productosList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProductos(productosList);
      },
      (err) => {
        console.error("Error escuchando productos:", err);
      }
    );
  };

  useEffect(() => {
    obtenerCategorias();
  }, []);

  useEffect(() => {
    const unsubscribe = escucharProductos();
    return () => unsubscribe && unsubscribe();
  }, [categoriaSeleccionada]);

  // ✅ Crear producto
  const crearProducto = async () => {
    if (!nuevoProducto.nombre || !nuevoProducto.precio) return;

    const productosRef = collection(
      db,
      `categorias/${categoriaSeleccionada}/Productosid`
    );

    const productoAGuardar = {
      ...nuevoProducto,
      imagenes: nuevoProducto.imagenes || [],
      precio: Number(nuevoProducto.precio),
      stock: Number(nuevoProducto.stock) || 0,
      activo: true,
    };

    if (categoriaSeleccionada === "Bebidasid") {
      productoAGuardar.contenido = nuevoProducto.contenido || "sin alcohol";
    } else {
      delete productoAGuardar.contenido;
    }

    try {
      await addDoc(productosRef, productoAGuardar);
      setNuevoProducto({
        nombre: "",
        precio: "",
        imagenes: [],  // <-- ahora es un array de imágenes/videos
        marca: "",
        stock: "",
        contenido: "",
        descripcion: "",           // ✅ NUEVO
        caracteristicas: [],       // ✅ NUEVO
        precio3Cuotas: "",         // ✅ NUEVO
        precio6Cuotas: "",
        activo3: nuevoProducto.activo3,  // ✅ agregar si no está
        activo6: nuevoProducto.activo6,  // ✅ agregar si no está
      });
    } catch (err) {
      console.error("Error creando producto:", err);
    }
  };

  // ✅ Actualizar producto
  // ✅ Actualizar producto
  const actualizarProducto = async (id, campo, valor) => {
    const productoDoc = doc(
      db,
      `categorias/${categoriaSeleccionada}/Productosid`,
      id
    );

    try {
      let updateData = {};

      const productoActual = productos.find((p) => p.id === id);
      const precioBase = Number(productoActual.precio || 0);

      if (campo === "precio") {
        const interes3 = Number(productoActual.interes3 || 15);
        const interes6 = Number(productoActual.interes6 || 30);

        updateData = {
          precio: Number(valor),
          precio3Cuotas: productoActual.activo3
            ? Number((Number(valor) * (1 + interes3 / 100)).toFixed(2))
            : 0,
          precio6Cuotas: productoActual.activo6
            ? Number((Number(valor) * (1 + interes6 / 100)).toFixed(2))
            : 0,
        };
      } else if (campo === "interes3") {
        updateData = {
          interes3: Number(valor),
          precio3Cuotas: productoActual.activo3
            ? Number((precioBase * (1 + Number(valor) / 100)).toFixed(2))
            : 0,
        };
      } else if (campo === "interes6") {
        updateData = {
          interes6: Number(valor),
          precio6Cuotas: productoActual.activo6
            ? Number((precioBase * (1 + Number(valor) / 100)).toFixed(2))
            : 0,
        };
      } else if (campo === "activo3") {
        updateData = {
          activo3: valor,
          precio3Cuotas: valor
            ? Number((precioBase * (1 + Number(productoActual.interes3 || 15) / 100)).toFixed(2))
            : 0,
        };
      } else if (campo === "activo6") {
        updateData = {
          activo6: valor,
          precio6Cuotas: valor
            ? Number((precioBase * (1 + Number(productoActual.interes6 || 30) / 100)).toFixed(2))
            : 0,
        };
      } else {
        updateData[campo] = campo === "stock" ? Number(valor) : valor;
      }

      await updateDoc(productoDoc, updateData);

      // Actualizamos localmente
      setProductos((prev) =>
        prev.map((p) => (p.id === id ? { ...p, ...updateData } : p))
      );
    } catch (err) {
      console.error("Error actualizando producto:", err);
    }
  };




  // ✅ Eliminar producto
  const eliminarProducto = async (id) => {
    const productoDoc = doc(
      db,
      `categorias/${categoriaSeleccionada}/Productosid`,
      id
    );
    try {
      await deleteDoc(productoDoc);
    } catch (err) {
      console.error("Error eliminando producto:", err);
    }
  };

  return (
    <section className="admin-dashboard py-5">
      <div className="container-fluid px-lg-4 p-0">
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 text-white mt-3">Panel de Administración</h1>
          <p className="text-white fs-5 ">Gestiona categorías y productos fácilmente.</p>
        </header>

        <section className="row g-4 mb-5">
          <ResumenEstadisticas />



        </section>




        {/* CRUD Categorías */}
        <section className="row mb-5 mx-lg-4 ">
          <article className="col-12">
            <CrearCategoriaProducto />
          </article>
        </section>

        {/* CRUD Productos */}
        <section className="row mx-lg-4">
          <article className="col-12">
            <div className="cards shadow-sm rounded-4 p-3 mt-5 bg-white">
              <h2 className="text-center mb-4 text-black">Gestión de Productos</h2>

              {/* Selección de Categoría */}
              <div className="mb-4">
                <h5 className="mb-2 text-dark">Selecciona una categoría:</h5>
                <select
                  className="form-select form-select-lg"
                  value={categoriaSeleccionada}
                  onChange={(e) => setCategoriaSeleccionada(e.target.value)}
                >
                  {categorias.map((c) => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crear Producto */}
              <div className="row g-2 mb-4">
                {/* Nombre */}
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Nombre"
                    value={nuevoProducto.nombre}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, nombre: e.target.value })
                    }
                  />
                </div>

                {/* Precio */}
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Precio (Contado)"
                    value={nuevoProducto.precio}
                    onChange={(e) => {
                      const precio = e.target.value;
                      setNuevoProducto({
                        ...nuevoProducto,
                        precio,
                        precio3Cuotas: precio
                          ? (Number(precio) * (1 + (nuevoProducto.interes3 || 15) / 100)).toFixed(2)
                          : "",
                        precio6Cuotas: precio
                          ? (Number(precio) * (1 + (nuevoProducto.interes6 || 30) / 100)).toFixed(2)
                          : "",
                      });
                    }}
                  />
                  <small className="form-text text-muted">
                    Ingresá el número sin separar miles. Ejemplo: <b>10000.50</b>
                  </small>
                </div>

                {/* Marca */}
                <div className="col-md-4">
                  <input
                    className="form-control"
                    placeholder="Marca"
                    value={nuevoProducto.marca}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, marca: e.target.value })
                    }
                  />
                </div>

                {/* Stock */}
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="Stock"
                    value={nuevoProducto.stock}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, stock: e.target.value })
                    }
                  />
                </div>
                {/* Características */}
                <div className="col-md-4">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Características (separadas por coma)"
                    value={nuevoProducto.caracteristicas.join(", ")}
                    onChange={(e) =>
                      setNuevoProducto({
                        ...nuevoProducto,
                        caracteristicas: e.target.value
                          .split(",")
                          .map((c) => c.trim()), // Solo recorta espacios al inicio/final
                      })
                    }
                  />
                </div>



                {/* Descripción */}
                <div className="col-md-4">
                  <textarea
                    className="form-control"
                    placeholder="Descripción"
                    value={nuevoProducto.descripcion}
                    onChange={(e) =>
                      setNuevoProducto({ ...nuevoProducto, descripcion: e.target.value })
                    }
                  />
                </div>

                {/* Interés y cálculo de cuotas */}
                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Interés 3 cuotas (%)"
                    value={nuevoProducto.interes3 || 15}
                    onChange={(e) => {
                      const interes = e.target.value;
                      setNuevoProducto({
                        ...nuevoProducto,
                        interes3: interes,
                        precio3Cuotas: nuevoProducto.precio
                          ? (Number(nuevoProducto.precio) * (1 + interes / 100)).toFixed(2)
                          : "",
                      });
                    }}
                  />
                  <small className="text-muted">
                    💳 3 cuotas de{" "}
                    {nuevoProducto.precio3Cuotas
                      ? (nuevoProducto.precio3Cuotas / 3).toFixed(2)
                      : "0"}{" "}
                    ={" "}
                    {nuevoProducto.precio3Cuotas
                      ? Number(nuevoProducto.precio3Cuotas).toFixed(2)
                      : "0"}
                  </small>
                </div>

                <div className="col-md-4">
                  <input
                    type="number"
                    className="form-control mb-1"
                    placeholder="Interés 6 cuotas (%)"
                    value={nuevoProducto.interes6 || 30}
                    onChange={(e) => {
                      const interes = e.target.value;
                      setNuevoProducto({
                        ...nuevoProducto,
                        interes6: interes,
                        precio6Cuotas: nuevoProducto.precio
                          ? (Number(nuevoProducto.precio) * (1 + interes / 100)).toFixed(2)
                          : "",
                      });
                    }}
                  />
                  <small className="text-muted">
                    💳 6 cuotas de{" "}
                    {nuevoProducto.precio6Cuotas
                      ? (nuevoProducto.precio6Cuotas / 6).toFixed(2)
                      : "0"}{" "}
                    ={" "}
                    {nuevoProducto.precio6Cuotas
                      ? Number(nuevoProducto.precio6Cuotas).toFixed(2)
                      : "0"}
                  </small>
                </div>


                {/* Contenido (solo si es Bebidas) */}
                {categoriaSeleccionada === "Bebidasid" && (
                  <div className="col-md-4">
                    <select
                      className="form-control"
                      value={nuevoProducto.contenido || "sin alcohol"}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, contenido: e.target.value })
                      }
                    >
                      <option value="sin alcohol">Sin alcohol</option>
                      <option value="con alcohol">Con alcohol</option>
                    </select>
                  </div>
                )}

                {/* Imágenes o Videos */}
                <div className="col-md-12">
                  {/* Lista de miniaturas */}
                  <div className="d-flex flex-wrap gap-2 mb-2">
                    {Array.isArray(nuevoProducto.imagenes) &&
                      nuevoProducto.imagenes.map((item, index) => (
                        <div key={index} className="position-relative">
                          {item.endsWith(".mp4") || item.includes("video") ? (
                            <video
                              src={item}
                              controls
                              className="rounded shadow-sm"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                          ) : (
                            <img
                              src={item}
                              alt={`media-${index}`}
                              className="rounded shadow-sm"
                              style={{ width: "80px", height: "80px", objectFit: "cover" }}
                            />
                          )}

                          {/* Botón eliminar */}
                          <button
                            type="button"
                            className="btn-close position-absolute top-0 end-0 bg-light rounded-circle"
                            style={{ transform: "scale(0.8)" }}
                            onClick={() =>
                              setNuevoProducto((prev) => ({
                                ...prev,
                                imagenes: prev.imagenes.filter((_, i) => i !== index),
                              }))
                            }
                          />
                        </div>
                      ))}
                  </div>

                  {/* Input URL */}
                  <input
                    type="text"
                    className="form-control mb-2"
                    placeholder="Pegá la URL de la imagen o video y presiona Enter"
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && e.target.value.trim()) {
                        e.preventDefault();
                        setNuevoProducto((prev) => ({
                          ...prev,
                          imagenes: [...(prev.imagenes || []), e.target.value.trim()],
                        }));
                        e.target.value = "";
                      }
                    }}
                  />

                  {/* Input local (múltiples archivos) */}
                  <label htmlFor="file-upload-nuevo" className="btn btn-primary btn-sm mb-2">
                    Subir Archivos
                  </label>
                  <input
                    id="file-upload-nuevo"
                    type="file"
                    accept="image/*,video/*"
                    multiple
                    style={{ display: "none" }}
                    onChange={async (e) => {
                      if (e.target.files) {
                        let nuevasImgs = [...(nuevoProducto.imagenes || [])];
                        for (let i = 0; i < e.target.files.length; i++) {
                          const file = e.target.files[i];

                          // Crear URL local temporal para preview
                          const localUrl = URL.createObjectURL(file);
                          nuevasImgs.push(localUrl);

                          // Subir a Cloudinary (si querés subir a la nube inmediatamente)
                          const formData = new FormData();
                          formData.append("file", file);
                          formData.append("upload_preset", "ml_default");

                          try {
                            const res = await fetch(
                              "https://api.cloudinary.com/v1_1/dqesszxgv/upload",
                              { method: "POST", body: formData }
                            );
                            const data = await res.json();
                            if (data.secure_url) {
                              // Reemplazamos la URL local con la de Cloudinary
                              nuevasImgs = nuevasImgs.map((img) =>
                                img === localUrl ? data.secure_url : img
                              );
                            }
                          } catch (err) {
                            console.error("Error subiendo archivo:", err);
                          }
                        }
                        setNuevoProducto((prev) => ({ ...prev, imagenes: nuevasImgs }));
                      }
                    }}
                  />
                </div>



                {/* Botón Agregar */}
                <div className="col-md-4 d-grid">
                  <button onClick={crearProducto} className="btn btn-success">
                    ➕ Agregar Producto
                  </button>
                </div>
              </div>


              <h3 className="text-dark">Modificar Productos</h3>
              {/* Buscador */}
              <input
                type="text"
                className="form-control mb-3"
                placeholder="Buscar producto..."
                value={busqueda}
                onChange={(e) => setBusqueda(e.target.value)}
              />

              {/* Tabla Productos */}
              <div
                className="table-responsive"
                style={{
                  overflowX: "scroll",   // ✅ SIEMPRE visible
                  whiteSpace: "nowrap", // ✅ Evita que las columnas se partan
                  borderRadius: "10px",
                  border: "1px solid #dee2e6",
                }}
              >                <table className="table table-bordered table-striped" style={{
                minWidth: "1200px", // ✅ Fuerza ancho mínimo
              }}>
                  <thead>
                    <tr>
                      <th style={{ minWidth: "180px", textAlign: "center" }}>Nombre</th>
                      <th style={{ minWidth: "120px", textAlign: "center" }}>Precio</th>
                      <th style={{ minWidth: "250px", textAlign: "center" }}>Imagen</th>
                      <th style={{ minWidth: "120px", textAlign: "center" }}>Marca</th>
                      <th style={{ minWidth: "100px", textAlign: "center" }}>Stock</th>
                      {categoriaSeleccionada === "Bebidasid" && (
                        <th style={{ minWidth: "140px", textAlign: "center" }}>Contenido</th>
                      )}
                      <th style={{ minWidth: "200px", textAlign: "center" }}>Caract.</th>
                      <th style={{ minWidth: "250px", textAlign: "center" }}>Descrip.</th>
                      <th style={{ minWidth: "80px", textAlign: "center" }}>(%)3</th>
                      <th style={{ minWidth: "80px", textAlign: "center" }}>(%)6</th>
                      <th style={{ minWidth: "150px", textAlign: "center" }}>Total 3</th>
                      <th style={{ minWidth: "150px", textAlign: "center" }}>Total 6</th>
                      <th style={{ minWidth: "100px", textAlign: "center" }}>Estado</th>
                      <th style={{ minWidth: "120px", textAlign: "center" }}>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos.filter(p => p.nombre.toLowerCase().includes(busqueda.toLowerCase())).map(producto => (
                      <tr key={producto.id}>
                        <td><input className="form-control" value={producto.nombre} onChange={e => actualizarProducto(producto.id, "nombre", e.target.value)} /></td>
                        <td className="text-center">
                          <div className="input-group">
                            <input
                              type="text"
                              className="form-control text-end"
                              value={new Intl.NumberFormat("es-AR", {
                                minimumFractionDigits: 2,
                                maximumFractionDigits: 2,
                              }).format(producto.precio)}
                              onChange={e => {
                                // Eliminamos puntos y reemplazamos coma por punto para guardar como número
                                const rawValue = e.target.value.replace(/\./g, "").replace(",", ".");
                                actualizarProducto(producto.id, "precio", rawValue);
                              }}
                            />
                          </div>
                        </td>
                        <td>
                          <div className="d-flex flex-wrap align-items-center gap-2">
                            {/* Mostrar miniaturas de imágenes o videos */}
                            {(producto.imagenes || []).map((item, index) => (
                              <div key={index} className="position-relative">
                                {item.endsWith(".mp4") || item.includes("video") ? (
                                  <video
                                    src={item}
                                    controls
                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                                  />
                                ) : (
                                  <img
                                    src={item}
                                    alt={`producto-${index}`}
                                    style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "4px" }}
                                  />
                                )}

                                {/* Botón para eliminar */}
                                <button
                                  type="button"
                                  className="btn-close position-absolute top-0 end-0"
                                  style={{ transform: "scale(0.7)" }}
                                  onClick={() => {
                                    const nuevasImgs = (producto.imagenes || []).filter((_, i) => i !== index);
                                    actualizarProducto(producto.id, "imagenes", nuevasImgs);
                                  }}
                                />
                              </div>
                            ))}

                            {/* Input URL */}
                            <input
                              type="text"
                              className="form-control"
                              placeholder="Agregar URL de imagen o video y presionar Enter"
                              onKeyDown={(e) => {
                                if (e.key === "Enter" && e.target.value.trim()) {
                                  const nuevasImgs = [...(producto.imagenes || []), e.target.value.trim()];
                                  actualizarProducto(producto.id, "imagenes", nuevasImgs);
                                  e.target.value = "";
                                }
                              }}
                              style={{ minWidth: "150px" }}
                            />

                            {/* Input archivo */}
                            <label htmlFor={`file-upload-${producto.id}`} className="btn btn-primary btn-sm">
                              Subir
                            </label>
                            <input
                              id={`file-upload-${producto.id}`}
                              type="file"
                              accept="image/*,video/*"
                              multiple
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                if (e.target.files) {
                                  let nuevasImgs = [...(producto.imagenes || [])];
                                  for (let i = 0; i < e.target.files.length; i++) {
                                    const file = e.target.files[i];

                                    // Subir a Cloudinary
                                    const formData = new FormData();
                                    formData.append("file", file);
                                    formData.append("upload_preset", "ml_default");

                                    try {
                                      const res = await fetch(
                                        "https://api.cloudinary.com/v1_1/dqesszxgv/upload",
                                        { method: "POST", body: formData }
                                      );
                                      const data = await res.json();
                                      if (data.secure_url) nuevasImgs.push(data.secure_url);
                                    } catch (err) {
                                      console.error("Error subiendo archivo:", err);
                                    }
                                  }
                                  actualizarProducto(producto.id, "imagenes", nuevasImgs);
                                }
                              }}
                            />
                          </div>
                        </td>



                        <td><input className="form-control" value={producto.marca} onChange={e => actualizarProducto(producto.id, "marca", e.target.value)} /></td>
                        <td><input type="number" className="form-control" value={producto.stock} onChange={e => actualizarProducto(producto.id, "stock", e.target.value)} /></td>
                        {categoriaSeleccionada === "Bebidasid" && <td><select className="form-control" value={producto.contenido || "sin alcohol"} onChange={e => actualizarProducto(producto.id, "contenido", e.target.value)}><option value="sin alcohol">Sin alcohol</option><option value="con alcohol">Con alcohol</option></select></td>}
                        <td><input type="text" className="form-control" value={producto.caracteristicas ? producto.caracteristicas.join(", ") : ""} onChange={e => actualizarProducto(producto.id, "caracteristicas", e.target.value.split(",").map(c => c.trim()))} /></td>
                        <td><textarea className="form-control" value={producto.descripcion || ""} onChange={e => actualizarProducto(producto.id, "descripcion", e.target.value)} /></td>
                        <td>
                          <input
                            type="number"
                            className="form-control mb-1"
                            value={producto.interes3 ?? 15} // valor por defecto 15
                            onChange={(e) => actualizarProducto(producto.id, "interes3", e.target.value)}
                            disabled={!producto.activo3} // deshabilitado si no está activo
                          />
                          <div className="form-check mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={producto.activo3 ?? true} // por defecto true
                              onChange={(e) => actualizarProducto(producto.id, "activo3", e.target.checked)}
                              id={`activo3-${producto.id}`}
                            />
                            <label className="form-check-label" htmlFor={`activo3-${producto.id}`}>
                              Activo
                            </label>
                          </div>
                        </td>

                        <td>
                          <input
                            type="number"
                            className="form-control mb-1"
                            value={producto.interes6 ?? 30} // valor por defecto 30
                            onChange={(e) => actualizarProducto(producto.id, "interes6", e.target.value)}
                            disabled={!producto.activo6} // deshabilitado si no está activo
                          />
                          <div className="form-check mt-1">
                            <input
                              className="form-check-input"
                              type="checkbox"
                              checked={producto.activo6 ?? true} // por defecto true
                              onChange={(e) => actualizarProducto(producto.id, "activo6", e.target.checked)}
                              id={`activo6-${producto.id}`}
                            />
                            <label className="form-check-label" htmlFor={`activo6-${producto.id}`}>
                              Activo
                            </label>
                          </div>
                        </td>

                        <td className="text-center">
                          <input
                            type="text"
                            className="form-control text-start"
                            value={new Intl.NumberFormat("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(producto.precio3Cuotas || 0)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\./g, "").replace(",", ".");
                              actualizarProducto(producto.id, "precio3Cuotas", rawValue);
                            }}
                          />
                        </td>

                        <td className="text-center">
                          <input
                            type="text"
                            className="form-control text-start"
                            value={new Intl.NumberFormat("es-AR", {
                              minimumFractionDigits: 2,
                              maximumFractionDigits: 2,
                            }).format(producto.precio6Cuotas || 0)}
                            onChange={(e) => {
                              const rawValue = e.target.value.replace(/\./g, "").replace(",", ".");
                              actualizarProducto(producto.id, "precio6Cuotas", rawValue);
                            }}
                          />
                        </td>

                        <td><button className={`btn btn-sm ${producto.activo ? "btn-success" : "btn-secondary"}`} onClick={() => actualizarProducto(producto.id, "activo", !producto.activo)}>{producto.activo ? "Activo" : "Inactivo"}</button></td>
                        <td><button className="btn btn-danger btn-sm" onClick={() => eliminarProducto(producto.id)}>Eliminar</button></td>
                      </tr>
                    ))}
                  </tbody>
                </table>

              </div>
            </div>
          </article>
        </section>

        <section className="row mb-5 mt-5">
          <article className="col-12">
            <AdminPresupuesto />
          </article>
        </section>


        <section className="row mb-5 mx-lg-4">
        <PagosCuotas />



        </section>

        <section className="row mx-lg-4">
          <article className="col-12 mt-5">
            <AdminUsers />
          </article>
        </section>

        <section className="row mb-4 mx-lg-3">
          <article className="col-12">
            <AjustarInflacion />
          </article>
        </section>

        <section className="row py-5 mb-5">
          <article className="col-12">
            <EstadisticasAdm />


          </article>
        </section>

      </div>
    </section>
  );
};

export default AdminDashboard;
