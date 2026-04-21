import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

export default function EsparcimientoDropdown({ onCloseNavbar }) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // cerrar al hacer click afuera
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
  };

  // ✅ ESTE ES EL QUE TE FALTABA
  const handleScrollTop = () => {
    setIsOpen(false);
    if (onCloseNavbar) onCloseNavbar();

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <li className={`nav-item dropdown ${isOpen ? "show" : ""}`} ref={dropdownRef}>
      <button
        className="nav-link dropdown-toggle btn btn-link text-white"
        onClick={toggleDropdown}
        aria-expanded={isOpen}
        style={{ textDecoration: "none" }}
      >
        Esparcimiento
      </button>

      <ul
        className={`dropdown-menu ${isOpen ? "show" : ""}`}
        style={{ minWidth: "200px", backgroundColor: "#261731" }}
      >
        {/* 🔥 Chaperío → SIEMPRE arriba */}
        <li>
          <Link
            className="dropdown-item"
            to="/Esparcimiento"
            onClick={handleScrollTop}
          >
            El Chaperío de Mamerto
          </Link>
        </li>

        {/* 🔥 La Guarda → sección */}
        <li>
          <Link
            className="dropdown-item"
            to="/Esparcimiento#laguarda"
            onClick={handleItemClick}
          >
            La Guarda
          </Link>
        </li>
      </ul>
    </li>
  );
}