import React, { useEffect, useState, useContext } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";
import { CartContext } from "../context/CartContext";
import FiltrosResponsive from "../components/FiltrosResponsive";

import "./CategoriasPage.css";

export default function CategoriasPage() {
  const { categoriaId } = useParams();
  const navigate = useNavigate();
  const { agregarAlCarrito } = useContext(CartContext);

  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get("search") || "";
  const marcaQuery = searchParams.get("marca") || "";
  const precioMinQuery = searchParams.get("min") || "";
  const precioMaxQuery = searchParams.get("max") || "";
  const filtroAlcoholQuery = searchParams.get("alcohol") || "todos";

  const [categorias, setCategorias] = useState([]);
  const [productos, setProductos] = useState([]);
  const [cargando, setCargando] = useState(true);
  const [drawerAbierto, setDrawerAbierto] = useState(false);

  const toggleDrawer = () => setDrawerAbierto(!drawerAbierto);

  const [busqueda, setBusqueda] = useState(searchQuery);
  const [filtroStock, setFiltroStock] = useState("todos");
  const [ordenPrecio, setOrdenPrecio] = useState("ninguno");
  const [precioMin, setPrecioMin] = useState(precioMinQuery);
  const [precioMax, setPrecioMax] = useState(precioMaxQuery);
  const [marcaSeleccionada, setMarcaSeleccionada] = useState(marcaQuery);
  const [filtroAlcohol, setFiltroAlcohol] = useState(filtroAlcoholQuery);

  // Traer categorías
  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasRef = collection(db, "categorias");
        const q = query(categoriasRef, orderBy("orden"));
        const snapshot = await getDocs(q);
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          nombre: doc.data().nombre || "Sin Nombre",
        }));
        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategorias();
  }, []);

  // Traer productos
  useEffect(() => {
    const fetchProductos = async () => {
      if (!categoriaId) return;
      setCargando(true);
      try {
        const productosRef = collection(db, "categorias", categoriaId, "Productosid");
        const snapshot = await getDocs(productosRef);
        const productosData = snapshot.docs
          .filter((doc) => doc.data().activo)
          .map((doc) => ({ id: doc.id, categoria: categoriaId, ...doc.data() }));
        setProductos(productosData);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setCargando(false);
      }
    };
    fetchProductos();
  }, [categoriaId]);

  const marcasDisponibles = Array.from(new Set(productos.map((p) => p.marca))).sort();

  let productosFiltrados = productos
    .filter((p) =>
      p.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
      p.marca.toLowerCase().includes(busqueda.toLowerCase())
    )
    .filter((p) => {
      if (filtroStock === "disponible") return p.stock > 0;
      if (filtroStock === "agotado") return p.stock === 0;
      return true;
    })
    .filter((p) => {
      if (precioMin && p.precio < parseFloat(precioMin)) return false;
      if (precioMax && p.precio > parseFloat(precioMax)) return false;
      return true;
    })
    .filter((p) => {
      if (marcaSeleccionada && p.marca !== marcaSeleccionada) return false;
      return true;
    })
    .filter((p) => {
      if (filtroAlcohol === "con") return p.contenido?.toLowerCase() !== "sin alcohol";
      if (filtroAlcohol === "sin") return p.contenido?.toLowerCase() === "sin alcohol";
      return true;
    });

  if (ordenPrecio === "menor") productosFiltrados.sort((a, b) => a.precio - b.precio);
  else if (ordenPrecio === "mayor") productosFiltrados.sort((a, b) => b.precio - a.precio);

  const categoriaSeleccionada = categorias.find((cat) => cat.id === categoriaId);

  return (
    <div className="categoriaspage-container pb-5 d-flex flex-column flex-md-row ">

      {/* Sidebar desktop */}
      <div className="d-none d-md-block col-md-2 pe-3 mt-5">
        <nav className="categoriaspage-sidebar mt-3" aria-label="Filtros y categorías">
          <h2 className="categoriaspage-sidebar-title mt-4">Categorías</h2>
          <ul className="categoriaspage-sidebar-list">
            {categorias.map((cat) => (
              <li
                key={cat.id}
                className={`categoriaspage-sidebar-item ${cat.id === categoriaId ? "active" : ""}`}
                onClick={() => navigate(`/categorias/${cat.id}`)}
              >
                {cat.nombre}
              </li>
            ))}
          </ul>

          <h2 className="categoriaspage-sidebar-title mt-4">Filtros</h2>
          <label className="form-label mt-2">Precio:</label>
          <div className="d-flex gap-2 mb-2">
            <input
              type="number"
              className="form-control"
              placeholder="Mín"
              value={precioMin}
              onChange={(e) => setPrecioMin(e.target.value)}
            />
            <input
              type="number"
              className="form-control"
              placeholder="Máx"
              value={precioMax}
              onChange={(e) => setPrecioMax(e.target.value)}
            />
          </div>

          <label className="form-label">Marca:</label>
          <select
            className="form-select mb-3"
            value={marcaSeleccionada}
            onChange={(e) => setMarcaSeleccionada(e.target.value)}
          >
            <option value="">Todas</option>
            {marcasDisponibles.map((m) => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>

          {categoriaSeleccionada?.nombre.toLowerCase() === "bebidas" && (
            <>
              <label className="form-label">Alcohol</label>
              <select className="form-select mb-3" value={filtroAlcohol} onChange={(e) => setFiltroAlcohol(e.target.value)}>
                <option value="todos">Todos</option>
                <option value="con">Con Alcohol</option>
                <option value="sin">Sin Alcohol</option>
              </select>
            </>
          )}

          <label className="form-label">Ordenar por:</label>
          <select className="form-select mb-4" value={ordenPrecio} onChange={(e) => setOrdenPrecio(e.target.value)}>
            <option value="ninguno">Relevancia</option>
            <option value="menor">Precio: Menor a mayor</option>
            <option value="mayor">Precio: Mayor a menor</option>
          </select>
        </nav>
      </div>

      {/* Main */}
      <main className="categoriaspage-main flex-grow-1 mt-3">



{/* Drawer responsive */}
<FiltrosResponsive mostrar={drawerAbierto} toggleMostrar={toggleDrawer}>
  <nav className="categoriaspage-sidebar" aria-label="Filtros y categorías">
    {/* Categorías */}
    <h2 className="categoriaspage-sidebar-title mt-4">Categorías</h2>
    <ul className="categoriaspage-sidebar-list">
      {categorias.map((cat) => (
        <li
          key={cat.id}
          className={`categoriaspage-sidebar-item ${cat.id === categoriaId ? "active" : ""}`}
          onClick={() => { navigate(`/categorias/${cat.id}`); toggleDrawer(); }}
        >
          {cat.nombre}
        </li>
      ))}
    </ul>

    {/* Filtros */}
    <h2 className="categoriaspage-sidebar-title mt-4">Filtros</h2>

    {/* Precio */}
    <label className="form-label mt-2">Precio:</label>
    <div className="d-flex gap-2 mb-2">
      <input
        type="number"
        className="form-control"
        placeholder="Mín"
        value={precioMin}
        onChange={(e) => setPrecioMin(e.target.value)}
      />
      <input
        type="number"
        className="form-control"
        placeholder="Máx"
        value={precioMax}
        onChange={(e) => setPrecioMax(e.target.value)}
      />
    </div>

    {/* Marca */}
    <label className="form-label">Marca:</label>
    <select
      className="form-select mb-3"
      value={marcaSeleccionada}
      onChange={(e) => setMarcaSeleccionada(e.target.value)}
    >
      <option value="">Todas</option>
      {marcasDisponibles.map((m) => (
        <option key={m} value={m}>{m}</option>
      ))}
    </select>

    {/* Alcohol (solo si categoría bebidas) */}
    {categoriaSeleccionada?.nombre.toLowerCase() === "bebidas" && (
      <>
        <label className="form-label">Alcohol:</label>
        <select
          className="form-select mb-3"
          value={filtroAlcohol}
          onChange={(e) => setFiltroAlcohol(e.target.value)}
        >
          <option value="todos">Todos</option>
          <option value="con">Con Alcohol</option>
          <option value="sin">Sin Alcohol</option>
        </select>
      </>
    )}

    {/* Ordenar por */}
    <label className="form-label">Ordenar por:</label>
    <select
      className="form-select mb-4"
      value={ordenPrecio}
      onChange={(e) => setOrdenPrecio(e.target.value)}
    >
      <option value="ninguno">Relevancia</option>
      <option value="menor">Precio: Menor a mayor</option>
      <option value="mayor">Precio: Mayor a menor</option>
    </select>
  </nav>
</FiltrosResponsive>




{/* Buscador */}
<div className="mb-4 mt-1 mx-lg-4">
  {/* Desktop: título arriba, input abajo */}
  <h1 className="categoriaspage-title mb-3 text-center">
  {categoriaSeleccionada?.nombre || "Productos"}
</h1>
  <input
    type="text"
    className="form-control d-none d-md-block"
    placeholder="Buscar producto por nombre o marca..."
    value={busqueda}
    onChange={(e) => setBusqueda(e.target.value)}
  />

  {/* Móvil: input + botón filtros */}
  <div className="d-flex gap-2 flex-wrap mb-3 d-md-none">
    <input
      type="text"
      className="form-control"
      placeholder="Buscar producto por nombre o marca..."
      aria-label="Buscar producto"
      value={busqueda}
      onChange={(e) => setBusqueda(e.target.value)}
      style={{ minWidth: "200px", flex: "1 1 0%" }}
    />
    <button className="btn btn-outline-secondary d-flex align-items-center" onClick={toggleDrawer}>
      <span>Filtrar</span>
      <svg
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        className="ms-2"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path d="M3 4H21M6 12H18M10 20H14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </button>
  </div>
</div>



        {/* Productos */}
        <div className="categoriaspage-productos row g-3 mx-lg-4">
          {cargando ? (
            <div className="text-center my-5 w-100">
              <div className="spinner-border text-warning" role="status"></div>
            </div>
          ) : productosFiltrados.length === 0 ? (
            <p>No hay productos para mostrar.</p>
          ) : (
            productosFiltrados.map((p) => (
              <article
                key={p.id}
                className="categoriaspage-product col-12 col-sm-6 col-md-4 col-lg-3"
              >
                <div className="card h-100 shadow-sm hover-shadow">
                  <div
                    className="categoriaspage-img-container"
                    role="link"
                    tabIndex={0}
                    aria-label={`Ver detalles de ${p.nombre}`}
                    onClick={() => navigate(`/categorias/${categoriaId}/producto/${p.id}`)}
                    style={{ cursor: "pointer" }}
                  >
                    <img
                      src={p.imagen || "https://via.placeholder.com/200"}
                      className="categoriaspage-img card-img-top"
                      alt={p.nombre}
                      loading="lazy"
                      style={{ height: "220px", objectFit: "cover" }}
                    />
                  </div>
                  <div className="card-body d-flex flex-column">
                    <h5 className="card-title text-dark">{p.nombre}</h5>
                    <p className="text-muted mb-2">Marca: {p.marca}</p>
                    <p className="mb-3">
                      Precio: <span className="fw-bold">${p.precio?.toFixed(2)}</span>
                    </p>
                    <button
                      className="btn btn-warning-custom mt-auto"
                      disabled={p.stock === 0}
                      onClick={(e) => { e.stopPropagation(); agregarAlCarrito(p, categoriaId); }}
                    >
                      {p.stock === 0 ? "Agotado" : "Agregar al carrito"}
                    </button>
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
