import React, { useState, useContext, useEffect, useRef } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { CartContext } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { signOut } from "firebase/auth";
import { auth } from "../config/firebase";
import { FaShoppingCart, FaSearch } from "react-icons/fa";
import useProductos from "../hooks/useProductos";
import FloatingCart from "./FloatingCart";
import CategoriasDropdown from "./CategoriasDropdown";
import logo from "../assets/navbarlogo.png";
import logito from "../assets/logoss.png";

import "./navbar.css";

const adminEmail = ["faculez07@gmail.com", "tripdrusgtore@gmail.com", "rodolfo@gmail.com"];
const empleadosEmails = ["faculez1@gmail.com", "faculez2@gmail.com"];

const Navbar = ({ busqueda, setBusqueda }) => {
  const { totalItems } = useContext(CartContext);
  const { usuario } = useAuth();
  const { productos, loading } = useProductos();
  const [sugerencias, setSugerencias] = useState([]);
  const [scrollingUp, setScrollingUp] = useState(false);
  const [scrollingDown, setScrollingDown] = useState(false);
  const navbarRef = useRef(null);
  const navigate = useNavigate();
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  

  const toggleMenu = () => setMenuAbierto(!menuAbierto);
  const cerrarMenu = () => setMenuAbierto(false);

  const navbarHeight = 80;
  const thresholdUp = 10;
  const thresholdDown = 40;

  const handleBusqueda = (e) => {
    const query = e.target.value;
    setBusqueda(query);
    if (query) {
      const filtrados = productos.filter((p) =>
        p.nombre?.toLowerCase().includes(query.toLowerCase())
      );
      setSugerencias(filtrados);
    } else setSugerencias([]);
  };


  useEffect(() => {
    const handleClickFuera = (e) => {
      const navbar = document.getElementById("navbarNav");
      const toggler = document.querySelector(".navbar-toggler");
      if (
        menuAbierto &&
        navbar &&
        !navbar.contains(e.target) &&
        !toggler.contains(e.target)
      ) {
        cerrarMenu();
      }
    };

    document.addEventListener("mousedown", handleClickFuera);
    return () => document.removeEventListener("mousedown", handleClickFuera);
  }, [menuAbierto]);



  const ejecutarBusqueda = () => {
    if (busqueda) {
      const filtrados = productos.filter((p) =>
        p.nombre?.toLowerCase().includes(busqueda.toLowerCase())
      );
      setSugerencias(filtrados);
    } else setSugerencias([]);
  };

  const cerrarSesion = () => {
    signOut(auth)
      .then(() => navigate("/"))
      .catch((err) => console.error("Error al cerrar sesión:", err));
  };



  useEffect(() => {
    let lastScrollY = window.scrollY;
    let accumulatedScrollUp = 0;
    let accumulatedScrollDown = 0;

    const isMobile = window.innerWidth <= 768; // ≤768px → móvil
    if (isMobile) return; // ❌ NO activar efecto en móvil

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY) {
        accumulatedScrollUp = 0;
        accumulatedScrollDown += currentScrollY - lastScrollY;
        if (accumulatedScrollDown >= thresholdDown) {
          setScrollingDown(true);
          setScrollingUp(false);
        }
      } else {
        accumulatedScrollDown = 0;
        accumulatedScrollUp += lastScrollY - currentScrollY;
        if (accumulatedScrollUp >= thresholdUp) {
          setScrollingUp(true);
          setScrollingDown(false);
        }
      }

      lastScrollY = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []); // solo se ejecuta al montar


  return (
    <nav
      className={`navbar fixed-top navbar-expand-lg navbar-dark shadow ${scrollingDown ? "navbar-hidden" : ""} ${scrollingUp ? "navbar-visible" : ""}`}
      style={{ top: scrollingDown ? `-${navbarHeight}px` : "0px" }}
    >
      <div className="container d-flex flex-column align-items-start justify-content-between">

        {/* FILA SUPERIOR */}
        <div className="d-flex w-100 align-items-center justify-content-between">

          {/* LOGO */}
          <div className="d-flex align-items-center">
            <Link
              className="navbar-brand d-none d-md-block"
              to="/home"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={logo} alt="Locus Store" height="63" />
            </Link>
            <Link
              className="navbar-brand d-md-none"
              to="/home"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            >
              <img src={logito} alt="Locus Store" width="65" height="65" />
            </Link>
          </div>

          <div className="position-relative flex-grow-1 d-flex justify-content-center">
            <div className="input-group">
              <input
                type="text"
                className="form-control"
                placeholder="¿Qué estás buscando?"
                value={busqueda}
                onChange={handleBusqueda}
                style={{ width: "100%" }} // input ocupa todo el ancho del input-group
              />
              <button
                className="btn btn-outline-secondary"
                type="button"
                onClick={ejecutarBusqueda}
              >
                <FaSearch />
              </button>
            </div>

            {busqueda && (
              loading ? (
                <div
                  className="position-absolute shadow bg-dark text-center text-white py-2 "
                  style={{
                    width: "100%",
                    top: "100%",
                    left: 0,
                    marginTop: "4px",
                    borderRadius: "4px",
                    zIndex: 10
                  }}
                >
                  Cargando productos...
                </div>
              ) : sugerencias.length > 0 ? (
<ul
  className="list-mobile-small position-absolute shadow px-lg-2 py-lg-2 border py-0 px-0"
  style={{
    width: "100%",
    top: "100%",
    left: window.innerWidth < 768 ? "0px" : "20px",
    marginTop: "2px",
    borderRadius: "4px",
    zIndex: 11,
    backgroundColor: "#261731",
  }}
>

                  {sugerencias.slice(0, 7).map((producto) => (
                    <li
                      key={producto.id}
                      className="list-group-item text-white border-0 px-1 py-1 "
                      style={{ cursor: "pointer", backgroundColor: "#261731" }}
                      onClick={() => {
                        // Limpiar estado local de búsqueda
                        setBusqueda("");
                        setSugerencias([]);
                        
                        // Actualizar el input en CategoriasPage vía query params
                        searchParams.set("search", producto.nombre);
                        setSearchParams(searchParams);
                    
                        // Navegar a la categoría (opcional si ya estás en la misma página)
                        navigate(`/categorias/${producto.categoria}?search=${encodeURIComponent(producto.nombre)}`);
                      }}
                    >
                      <div className="d-flex align-items-center">
                        <FaSearch size={16} className="me-3" />
                        <span>{producto.nombre}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              ) : (
                <div
                  className="position-absolute shadow  text-center text-white border border-light rounded py-2 ms-lg-3 me-lg-5"
                  style={{
                    width: "95%",
                    top: "100%",
                    left: 0,
                    marginTop: "4px",
                    zIndex: 12,
                    backgroundColor: "#261731"

                  }}
                >
                  No se encontraron resultados.
                </div>
              )
            )}
          </div>



          {/* ADMIN/EMPLEADO + LOGIN/AVATAR - DESKTOP */}
          <div className="d-none d-md-flex align-items-center">
            {usuario && adminEmail.includes(usuario.email) && (
              <Link className="nav-link text-white me-3" to="/admin">Admin</Link>
            )}
            {usuario && empleadosEmails.includes(usuario.email) && (
              <Link className="nav-link text-white me-3" to="/empleado">Empleado</Link>
            )}
            {usuario ? (
              <>
                <Link className="nav-link d-flex align-items-center text-white" to="/perfil">
                  <img
                    src={usuario.photoURL || "https://via.placeholder.com/40"}
                    alt="Avatar"
                    className="avatar-img rounded-circle me-2"
                    style={{ width: "40px", height: "40px", objectFit: "cover" }}
                  />
                  {usuario.displayName || usuario.email}
                </Link>
                <button
                  className="nav-link text-white ms-2"
                  style={{ background: "none", border: "none" }}
                  onClick={cerrarSesion}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link className="nav-link text-white" to="/login">Iniciar Sesión</Link>
            )}
          </div>


          {/* CARRITO + FLOATINGCART */}
          <div className="d-flex align-items-center">
            <Link to="/carrito" className="text-white position-relative me-3 ms-3">
              <FaShoppingCart size={24} />
              <span className="position-absolute top-0 start-100 translate-middle badge rounded-circle bg-danger ms-1 ms-lg-0" style={{ padding: "0.2rem 0.5rem", fontSize: "0.8rem" }}>
                {totalItems}
              </span>
            </Link>
            <FloatingCart />
          </div>

          {/* TOGGLE MÓVIL */}
          <button
            className="navbar-toggler border border-light ms-2"
            type="button"
            aria-controls="navbarNav"
            aria-expanded={menuAbierto}
            aria-label="Toggle navigation"
            onClick={toggleMenu}
          >
            <span className="navbar-toggler-icon"></span>
          </button>


        </div>

        {/* FILA INFERIOR: LINKS + ADMIN/EMPLEADO + LOGIN/AVATAR MÓVIL */}
        <div
          className={`collapse navbar-collapse w-100 ${menuAbierto ? "show" : ""}`}
          id="navbarNav"
          ref={navbarRef}
        >
          <ul className="navbar-nav mx-auto d-flex flex-wrap justify-content-center align-items-start">

            {/* Links normales */}
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/home" onClick={cerrarMenu}>
                Inicio
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/ProyectosFuturos" onClick={cerrarMenu}>
                Proyectos Futuros
              </Link>
            </li>
            <ul className="navbar-nav mx-2 mx-lg-0">
              <CategoriasDropdown onCloseNavbar={cerrarMenu} />
              {/* otros <li> aquí */}
            </ul>


            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/SobreNosotros" onClick={cerrarMenu}>
                Sobre Nosotros
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/Lotes" onClick={cerrarMenu}>
                Lotes
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/Esparcimiento" onClick={cerrarMenu}>
                Esparcimiento
              </Link>
            </li>
            <li className="nav-item mx-2">
              <Link className="nav-link text-white" to="/contacto" onClick={cerrarMenu}>
                Contacto
              </Link>
            </li>

            {/* ADMIN / EMPLEADO + LOGIN/AVATAR MÓVIL */}
            <div className="d-flex d-md-none flex-column mt-2 w-100">
              {usuario && adminEmail.includes(usuario.email) && (
                <Link className="nav-link text-white mx-2" to="/admin" onClick={cerrarMenu}>
                  Admin
                </Link>
              )}
              {usuario && empleadosEmails.includes(usuario.email) && (
                <Link className="nav-link text-white" to="/empleado" onClick={cerrarMenu}>
                  Empleado
                </Link>
              )}
              {usuario ? (
                <>
                  <Link className="nav-link d-flex align-items-center text-white" to="/perfil" onClick={cerrarMenu}>
                    <img
                      src={usuario.photoURL || "https://via.placeholder.com/40"}
                      alt="Avatar"
                      className="avatar-img rounded-circle me-2"
                      style={{ width: "40px", height: "40px", objectFit: "cover" }}
                    />
                    {usuario.displayName || usuario.email}
                  </Link>
                  <button className="btn btn-link nav-link text-white p-0" onClick={() => { cerrarSesion(); cerrarMenu(); }}>
                    Cerrar sesión
                  </button>
                </>
              ) : (
                <Link className="nav-link text-white" to="/login" onClick={cerrarMenu}>
                  Iniciar Sesión
                </Link>
              )}
            </div>

          </ul>
        </div>


      </div>
    </nav>
  );
};

export default Navbar;
