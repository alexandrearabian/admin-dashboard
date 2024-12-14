import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "/Users/alex/Documents/MisProyectos/TadronWeb/tadron-web/src/assets/LOGUITO.jpg";
import { useNavigate } from "react-router-dom";
import { auth } from "../firebase/FirebaseConfig";
import { signOut } from "firebase/auth";
import { faSignOut } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState(null); // Track active link

  const toggleMenu = () => setMenuOpen(!menuOpen);
  const closeMenu = () => setMenuOpen(false);
  const navigate = useNavigate();

  const handleLinkClick = (link) => {
    setActiveLink(link); // Set the clicked link as active
    closeMenu(); // Close the menu after selection
  };

  const handleLogout = async () => {
    await signOut(auth);
    navigate("/login");
    closeMenu();
  };

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/" onClick={() => handleLinkClick("/")}>
            <img src={logo} alt="Logo" style={{ width: "70px" }} />
          </Link>
        </div>

        <div
          className={`burger-menu ${menuOpen ? "open" : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>

        <ul className={`navbar-links ${menuOpen ? "show" : ""}`}>
          <li>
            <Link
              to="/tadron-es-teatro"
              onClick={() => handleLinkClick("/tadron-es-teatro")}
              className={activeLink === "/tadron-es-teatro" ? "active" : ""}
            >
              TADRON ES TEATRO
            </Link>
          </li>
          <li>
            <Link
              to="/espectaculos"
              onClick={() => handleLinkClick("/espectaculos")}
              className={activeLink === "/espectaculos" ? "active" : ""}
            >
              ESPECTÁCULOS
            </Link>
          </li>
          <li>
            <Link
              to="/cursosytalleres"
              onClick={() => handleLinkClick("/cursosytalleres")}
              className={activeLink === "/cursosytalleres" ? "active" : ""}
            >
              CURSOS Y TALLERES
            </Link>
          </li>
          <li>
            <Link
              to="/programa-tu-espectaculo"
              onClick={() => handleLinkClick("/programa-tu-espectaculo")}
              className={
                activeLink === "/programa-tu-espectaculo" ? "active" : ""
              }
            >
              PROGRAMÁ TU ESPECTÁCULO
            </Link>
          </li>
          <li>
            <Link
              to="/nuestro-espacio"
              onClick={() => handleLinkClick("/nuestro-espacio")}
              className={activeLink === "/nuestro-espacio" ? "active" : ""}
            >
              NUESTRO ESPACIO
            </Link>
          </li>
          <li>
            <Link
              to="/ciclo-teatro-justicia"
              onClick={() => handleLinkClick("/ciclo-teatro-justicia")}
              className={
                activeLink === "/ciclo-teatro-justicia" ? "active" : ""
              }
            >
              CICLO TEATRO X LA JUSTICIA
            </Link>
          </li>
          <li>
            <Link
              to="/gaston-breyer"
              onClick={() => handleLinkClick("/gaston-breyer")}
              className={activeLink === "/gaston-breyer" ? "active" : ""}
            >
              GASTÓN BREYER
            </Link>
          </li>
          <li>
            <Link
              to="/contacto"
              onClick={() => handleLinkClick("/contacto")}
              className={activeLink === "/contacto" ? "active" : ""}
            >
              CONTÁCTO
            </Link>
          </li>
          <li>
            <Link
              to="/login"
              onClick={handleLogout}
              style={{
                display: "flex",
                gap: "0.5em",
                alignItems: "center",
              }}
            >
              <FontAwesomeIcon icon={faSignOut} />
              CERRAR SESIÓN
            </Link>
          </li>
        </ul>
      </nav>
    </>
  );
}
