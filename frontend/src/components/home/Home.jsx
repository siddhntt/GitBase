import React from "react";
import { Link } from "react-router-dom";
import "./home.css";
import logo from "../../assets/github-mark-white.svg";

const Home = () => {
  return (
    <div className="home-wrapper">
      <nav className="home-nav">
        <Link to="/" className="home-nav-brand">
          <img src={logo} alt="GitBase" />
          <span>GitBase</span>
        </Link>
        <div className="home-nav-links">
          <Link to="/auth" className="home-signin-link">Sign in</Link>
          <Link to="/signup" className="home-signup-btn">Sign up</Link>
        </div>
      </nav>

      <main className="home-hero">
        <div className="home-hero-content">
          <h1 className="home-title">
            Build and ship<br />
            <span className="home-title-accent">your code</span> together.
          </h1>
          <p className="home-subtitle">
            GitBase is where developers store their projects, track issues, 
            and collaborate on code — all in one place.
          </p>
          <div className="home-cta">
            <Link to="/signup" className="home-cta-primary">
              Get started — it's free
            </Link>
            <Link to="/auth" className="home-cta-secondary">
              Sign in →
            </Link>
          </div>
        </div>
      </main>

      <section className="home-features">
        <div className="feature-card">
          <div className="feature-icon">📦</div>
          <h3>Repositories</h3>
          <p>Create public or private repos, manage files, and track your project history.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">📋</div>
          <h3>Issue Tracking</h3>
          <p>Open issues, track bugs, and close them when they're fixed. Simple and fast.</p>
        </div>
        <div className="feature-card">
          <div className="feature-icon">👤</div>
          <h3>Profiles</h3>
          <p>Your contribution heatmap, pinned repos, and activity — all on your profile page.</p>
        </div>
      </section>

      <footer className="home-footer">
        <p>GitBase — Built by Siddhant</p>
      </footer>
    </div>
  );
};

export default Home;
