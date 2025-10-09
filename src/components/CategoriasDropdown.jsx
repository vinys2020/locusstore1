import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../config/firebase";
import { useAuth } from "../context/AuthContext";

export default function CategoriasDropdown({ onCloseNavbar }) {
  const { usuario } = useAuth();
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      try {
        const categoriasRef = collection(db, "categorias");
        const snapshot = await getDocs(categoriasRef);

        const data = snapshot.docs
          .map((doc) => ({
            id: doc.id,
            nombre: doc.data().nombre || "Sin Nombre",
            orden: doc.data().orden || 0,
          }))
          .sort((a, b) => a.orden - b.orden);

        setCategorias(data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategorias();
  }, []); // ahora carga siempre, no depende de usuario ni loading

  // Cerrar dropdown al hacer click fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => setIsOpen((prev) => !prev);

  const handleItemClick = () => {
    setIsOpen(false);
    if (onCloseNavbar) onCloseNavbar();
    window.scrollTo(0, 0);
  };

  return (
    <li className={`nav-item dropdown ${isOpen ? "show" : ""}`} ref={dropdownRef}>
      <button
        className="nav-link dropdown-toggle btn btn-link"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        style={{ textDecoration: "none" }}
      >
        Categorías
      </button>

      <ul
        className={`dropdown-menu ${isOpen ? "show" : ""}`}
        style={{ minWidth: "220px", backgroundColor: "#261731" }} // <-- 🔧 Ajusta el ancho aquí
      >        {categorias.length > 0 ? (
        categorias.map((cat) => (
          <li key={cat.id}>
            <Link
              className="dropdown-item"
              to={`/categorias/${cat.id}`}
              onClick={handleItemClick}
            >
              {cat.nombre}
            </Link>
          </li>
        ))
      ) : (
        <li className="dropdown-item">Cargando...</li>
      )}
      </ul>
    </li>
  );
}
