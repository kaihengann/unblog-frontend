import React from "react";
import { Link } from "react-router-dom";
import "./NavBar.css";

const NavBar = ({ onLogout, onHome,onNewPost }) => {
  return (
    <nav className="navBar">
      <Link to="/" onClick={() => onHome()}>
        <button>
          Home
        </button>
      </Link>
      <Link onClick={onNewPost}to="/newPost">
        <button>
          New Post
        </button>
      </Link>
      <Link to="/login" onClick={() => onLogout()}>
        <button id="logoutButton">
          Logout
        </button>
      </Link>
    </nav>
  );
};

export default NavBar;
