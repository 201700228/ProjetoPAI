import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css"; // Importe o arquivo CSS
import logoImage from "../../assets/logo.png";

const Navbar = () => {
  return (
    <nav className="navbar">
      <img src={logoImage} alt="RetroReunion Logo" className="logo" />{" "}
      <ul className="nav-list">
        <li>
          <Link to="/" className="link">
            Home
          </Link>{" "}
        </li>
        <li>
          <Link to="/login" className="link">
            Login
          </Link>
        </li>
        <li>
          <Link to="/register" className="link">
            Register
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
