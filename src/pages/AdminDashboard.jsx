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
      });
    } catch (err) {
      console.error("Error creando producto:", err);
    }
  };

  // ✅ Actualizar producto
  const actualizarProducto = async (id, campo, valor) => {
    const productoDoc = doc(
      db,
      `categorias/${categoriaSeleccionada}/Productosid`,
      id
    );
    try {
      await updateDoc(productoDoc, {
        [campo]: campo === "precio" || campo === "stock" ? Number(valor) : valor,
      });

      setProductos((prev) =>
        prev.map((p) =>
          p.id === id
            ? { ...p, [campo]: campo === "precio" || campo === "stock" ? Number(valor) : valor }
            : p
        )
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
      <div className="container-fluid px-4 px-md-5">
        <header className="text-center mb-5">
          <h1 className="fw-bold display-5 text-black mt-3">Panel de Administración</h1>
          <p className="text-black fs-5 ">Gestiona categorías y productos fácilmente.</p>
        </header>

        {/* CRUD Categorías */}
        <section className="row mb-5">
          <article className="col-12">
            <CrearCategoriaProducto />
          </article>
        </section>

        {/* CRUD Productos */}
        <section className="row">
          <article className="col-12">
            <div className="cards shadow-sm rounded-4 p-4 bg-light">
              <h2 className="text-center mb-4 text-black">Gestión de Productos</h2>

              {/* Selección de Categoría */}
              <div className="mb-4">
                <h5 className="mb-2">Selecciona una categoría:</h5>
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
                {["nombre", "precio", "marca", "stock"].map((campo) => (
                  <div className="col-md-4" key={campo}>
                    <input
                      className="form-control"
                      placeholder={campo}
                      value={nuevoProducto[campo]}
                      onChange={(e) =>
                        setNuevoProducto({ ...nuevoProducto, [campo]: e.target.value })
                      }
                    />
                  </div>
                ))}

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

                <div className="col-md-4 d-grid">
                  <button onClick={crearProducto} className="btn btn-success">
                    ➕ Agregar Producto
                  </button>
                </div>
              </div>

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
                            <button
                              className={`btn btn-sm ${
                                producto.activo ? "btn-success" : "btn-secondary"
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
      </div>
    </section>
  );
};

export default AdminDashboard;
