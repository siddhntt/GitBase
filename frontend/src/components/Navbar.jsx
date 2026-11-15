import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("userId");

  return (
    <nav>
      <Link to="/" className="nav-brand">
        <img src={logo} alt="GitBase" />
        <h3>GitBase</h3>
      </Link>
      {isLoggedIn && (
        <div className="nav-links">
          <Link to="/create" className="nav-create-btn">+ New</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
