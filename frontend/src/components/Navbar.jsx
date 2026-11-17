import React from "react";
import { Link } from "react-router-dom";
import "./navbar.css";
import logo from "../assets/github-mark-white.svg";
import { useAuth } from "../authContext";

const Navbar = () => {
  const isLoggedIn = !!localStorage.getItem("userId");
  const { setCurrentUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/";
  };

  return (
    <nav>
      <Link to="/" className="nav-brand">
        <img src={logo} alt="GitBase" />
        <h3>GitBase</h3>
      </Link>
      {isLoggedIn ? (
        <div className="nav-links">
          <Link to="/create" className="nav-create-btn">+ New</Link>
          <Link to="/">Dashboard</Link>
          <Link to="/profile">Profile</Link>
          <Link to="/settings">Settings</Link>
          <span className="nav-logout" onClick={handleLogout}>Logout</span>
        </div>
      ) : (
        <div className="nav-links">
          <Link to="/auth">Sign in</Link>
          <Link to="/signup" className="nav-create-btn">Sign up</Link>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
