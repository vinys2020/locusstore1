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
    descripcion: "",           // ✅ NUEVO
    caracteristicas: [],       // ✅ NUEVO
    precio3Cuotas: "",         // ✅ NUEVO
    precio6Cuotas: "",         // ✅ NUEVO
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
  const subirImagenCloudinary = async (file, productoId) => {
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
        if (productoId) {
          await actualizarProducto(productoId, "imagen", data.secure_url);
        } else {
          setNuevoProducto((prev) => ({ ...prev, imagen: data.secure_url }));
        }
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
        imagen: "",
        marca: "",
        stock: "",
        contenido: "",
        descripcion: "",           // ✅ NUEVO
        caracteristicas: [],       // ✅ NUEVO
        precio3Cuotas: "",         // ✅ NUEVO
        precio6Cuotas: "",
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
          <h1 className="fw-bold display-5 text-black mt-3">Panel de Administración</h1>
          <p className="text-black fs-5 ">Gestiona categorías y productos fácilmente.</p>
        </header>

        {/* CRUD Categorías */}
        <section className="row mb-5 ">
          <article className="col-12">
            <CrearCategoriaProducto />
          </article>
        </section>

        {/* CRUD Productos */}
        <section className="row">
          <article className="col-12">
            <div className="cards shadow-sm rounded-4 p-3 bg-white">
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
                        caracteristicas: e.target.value.split(",").map((c) => c.trim()),
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

                {/* Imagen */}
                <div className="col-md-4">
                  <input
                    className="form-control mb-2"
                    placeholder="Imagen URL"
                    value={nuevoProducto.imagen}
                    readOnly
                  />
                  <input
                    type="file"
                    accept="image/*"
                    className="form-control"
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        await subirImagenCloudinary(e.target.files[0]);
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
              <div className="table-responsive">
                <table className="table table-bordered table-striped mb-5">
                  <thead>
                    <tr>
                      <th>Nombre</th>
                      <th>Precio</th>
                      <th>Imagen</th>
                      <th>Marca</th>
                      <th>Stock</th>
                      {categoriaSeleccionada === "Bebidasid" && <th>Contenido</th>}
                      <th>Caract.</th>
                      <th>Descrip.</th>
                      <th>(%)3</th> {/* Nueva columna */}
                      <th>(%)6</th> {/* Nueva columna */}
                      <th>Total 3</th>
                      <th>Total 6</th>
                      <th>Estado</th>
                      <th>Acciones</th>
                    </tr>
                  </thead>
                  <tbody>
                    {productos
                      .filter((p) =>
                        p.nombre.toLowerCase().includes(busqueda.toLowerCase())
                      )
                      .map((producto) => (
                        <tr key={producto.id}>
                          <td>
                            <input
                              className="form-control"
                              value={producto.nombre}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "nombre", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={producto.precio}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "precio", e.target.value)
                              }
                            />
                          </td>
                          <td style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                            <input
                              type="text"
                              className="form-control"
                              value={producto.imagen || ""}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "imagen", e.target.value)
                              }
                            />
                            {producto.imagen && (
                              <img
                                src={producto.imagen}
                                alt={producto.nombre}
                                style={{
                                  width: "60px",
                                  height: "60px",
                                  objectFit: "cover",
                                  borderRadius: "4px",
                                }}
                              />
                            )}
                            <label
                              htmlFor={`file-upload-${producto.id}`}
                              className="btn btn-primary btn-sm"
                            >
                              Subir
                            </label>
                            <input
                              id={`file-upload-${producto.id}`}
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={async (e) => {
                                if (e.target.files && e.target.files[0]) {
                                  await subirImagenCloudinary(e.target.files[0], producto.id);
                                }
                              }}
                            />
                          </td>
                          <td>
                            <input
                              className="form-control"
                              value={producto.marca}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "marca", e.target.value)
                              }
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={producto.stock}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "stock", e.target.value)
                              }
                            />
                          </td>
                          {categoriaSeleccionada === "Bebidasid" && (
                            <td>
                              <select
                                className="form-control"
                                value={producto.contenido || "sin alcohol"}
                                onChange={(e) =>
                                  actualizarProducto(
                                    producto.id,
                                    "contenido",
                                    e.target.value
                                  )
                                }
                              >
                                <option value="sin alcohol">Sin alcohol</option>
                                <option value="con alcohol">Con alcohol</option>
                              </select>
                            </td>
                          )}
                          <td>

                            <input
                              type="text"
                              className="form-control"
                              value={producto.caracteristicas ? producto.caracteristicas.join(", ") : ""}
                              onChange={(e) =>
                                actualizarProducto(
                                  producto.id,
                                  "caracteristicas",
                                  e.target.value.split(",").map((c) => c.trim())
                                )
                              }
                            />
                          </td>

                          <td>
                            <textarea
                              className="form-control"
                              value={producto.descripcion || ""}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "descripcion", e.target.value)
                              }
                            />
                          </td>
{/* Interés 3 cuotas */}
<td>
  {producto.activo3 && (
    <input
      type="number"
      className="form-control mb-1"
      value={producto.interes3 || 15}
      onChange={(e) =>
        actualizarProducto(producto.id, "interes3", e.target.value)
      }
    />
  )}
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      checked={producto.activo3 || false}
      onChange={(e) =>
        actualizarProducto(producto.id, "activo3", e.target.checked)
      }
      id={`activo3-${producto.id}`}
    />
    <label className="form-check-label" htmlFor={`activo3-${producto.id}`}>
      Activo
    </label>
  </div>
</td>

{/* Interés 6 cuotas */}
<td>
  {producto.activo6 && (
    <input
      type="number"
      className="form-control mb-1"
      value={producto.interes6 || 30}
      onChange={(e) =>
        actualizarProducto(producto.id, "interes6", e.target.value)
      }
    />
  )}
  <div className="form-check">
    <input
      className="form-check-input"
      type="checkbox"
      checked={producto.activo6 || false}
      onChange={(e) =>
        actualizarProducto(producto.id, "activo6", e.target.checked)
      }
      id={`activo6-${producto.id}`}
    />
    <label className="form-check-label" htmlFor={`activo6-${producto.id}`}>
      Activo
    </label>
  </div>
</td>



                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={producto.precio3Cuotas || ""}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "precio3Cuotas", e.target.value)
                              }
                            />
                          </td>


                          <td>
                            <input
                              type="number"
                              className="form-control"
                              value={producto.precio6Cuotas || ""}
                              onChange={(e) =>
                                actualizarProducto(producto.id, "precio6Cuotas", e.target.value)
                              }
                            />
                          </td>



                          <td>
                            <button
                              className={`btn btn-sm ${producto.activo ? "btn-success" : "btn-secondary"
                                }`}
                              onClick={() =>
                                actualizarProducto(producto.id, "activo", !producto.activo)
                              }
                            >
                              {producto.activo ? "Activo" : "Inactivo"}
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => eliminarProducto(producto.id)}
                            >
                              Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              </div>
            </div>
          </article>
        </section>
        {/* Ajustar Precios por Inflación */}
        <AjustarInflacion />
      </div>
    </section>
  );
};

export default AdminDashboard;
