import { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../config/firebase";

export default function CategoriasDropdown({ onCloseNavbar }) {
  const [categorias, setCategorias] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const fetchCategorias = async () => {
      const q = query(collection(db, "Categoriasid"), orderBy("orden"));
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        nombre: doc.data().nombre || doc.id,
      }));
      setCategorias(data);
    };
    fetchCategorias();
  }, []);

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
    <li
      className={`nav-item dropdown ${isOpen ? "show" : ""}`}
      ref={dropdownRef}
    >
      <button
        className="nav-link dropdown-toggle btn btn-link"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        style={{ textDecoration: "none" }}
      >
        Categorías
      </button>

      <ul className={`dropdown-menu ${isOpen ? "show" : ""}`}>
        {categorias.map((cat) => (
          <li key={cat.id}>
            <Link
              className="dropdown-item"
              to={`/categorias/${cat.id}`}
              onClick={handleItemClick}
            >
              {cat.nombre}
            </Link>
          </li>
        ))}
      </ul>
    </li>
  );
}
