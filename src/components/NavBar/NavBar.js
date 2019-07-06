import React from "react";
import { Link } from "react-router-dom";

const NavBar = ({ onLogout }) => {
  return (
    <nav>
      <button>
        <Link to="/">Home</Link>
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
