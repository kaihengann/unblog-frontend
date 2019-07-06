import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ onLogout, onHome }) => {
  return (
    <nav>
      <button>
        <Link to="/" onClick={() => onHome()}>
          Home
        </Link>
      </button>
      <button>
        <Link to="/newPost">New Post</Link>
      </button>
      <button>
        <Link to="/login" onClick={() => onLogout()}>
          Logout
        </Link>
      </button>
    </nav>
  );
};

export default NavBar;
