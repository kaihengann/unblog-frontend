import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ onLogout, onHome }) => {
  return (
    <nav className="navBar">
      <button>
        <Link to="/" onClick={() => onHome()}>
          Home
        </Link>
      </button>
      <button>
        <Link onClick={() => {localStorage.setItem("existingPost", false)}}to="/newPost">New Post</Link>
      </button>
      <button id="logoutButton">
        <Link to="/login" onClick={() => onLogout()}>
          Logout
        </Link>
      </button>
    </nav>
  );
};

export default NavBar;
