import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./profile.css";
import Navbar from "../Navbar";
import HeatMapProfile from "./HeatMap";
import { useAuth } from "../../authContext";

const sampleUserRepos = [
  {
    _id: "s-repo-1",
    name: "react-todo-app",
    description: "A minimal todo application built with React and localStorage for persistence.",
    language: "JavaScript",
    visibility: true,
    updatedAt: "2 days ago",
  },
  {
    _id: "s-repo-2",
    name: "express-auth-starter",
    description: "Boilerplate for Express.js apps with JWT auth and MongoDB.",
    language: "JavaScript",
    visibility: false,
    updatedAt: "5 days ago",
  },
  {
    _id: "s-repo-3",
    name: "portfolio-v2",
    description: "Personal portfolio site with dark mode and project showcase.",
    language: "CSS",
    visibility: true,
    updatedAt: "1 week ago",
  },
  {
    _id: "s-repo-4",
    name: "markdown-previewer",
    description: "Live markdown editor with GFM support and syntax highlighting.",
    language: "TypeScript",
    visibility: true,
    updatedAt: "2 weeks ago",
  },
  {
    _id: "s-repo-5",
    name: "chat-socket-app",
    description: "Real-time chat application using Socket.io and Express.",
    language: "JavaScript",
    visibility: true,
    updatedAt: "3 weeks ago",
  },
  {
    _id: "s-repo-6",
    name: "api-rate-limiter",
    description: "Express middleware for flexible API rate limiting.",
    language: "TypeScript",
    visibility: false,
    updatedAt: "1 month ago",
  },
];

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
};

const Profile = () => {
  const navigate = useNavigate();
  const [userDetails, setUserDetails] = useState({
    username: "siddhant",
    email: "siddhant@example.com",
  });
  const [userRepos, setUserRepos] = useState(sampleUserRepos);
  const [activeTab, setActiveTab] = useState("overview");
  const { setCurrentUser } = useAuth();

  useEffect(() => {
    const fetchUserDetails = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://localhost:3000/userProfile/${userId}`
        );
        const data = await response.json();
        if (data && data.username) {
          setUserDetails(data);
        }
      } catch (err) {
        console.error("Cannot fetch user details: ", err);
      }
    };

    const fetchUserRepos = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        if (data.repositories && data.repositories.length > 0) {
          setUserRepos(data.repositories);
        }
      } catch (err) {
        console.error("Cannot fetch user repos: ", err);
      }
    };

    fetchUserDetails();
    fetchUserRepos();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    setCurrentUser(null);
    window.location.href = "/auth";
  };

  return (
    <>
      <Navbar />

      {/* Profile tabs */}
      <div className="profile-tabs-bar">
        <button
          className={`profile-tab ${activeTab === "overview" ? "active" : ""}`}
          onClick={() => setActiveTab("overview")}
        >
          Overview
        </button>
        <button
          className={`profile-tab ${activeTab === "repos" ? "active" : ""}`}
          onClick={() => setActiveTab("repos")}
        >
          Repositories
          <span className="tab-count">{userRepos.length}</span>
        </button>
      </div>

      <div className="profile-layout">
        {/* Left — user card */}
        <aside className="profile-sidebar">
          <div className="avatar-container">
            <div className="avatar">
              {userDetails.username?.charAt(0).toUpperCase()}
            </div>
          </div>

          <div className="user-info">
            <h2 className="display-name">{userDetails.username}</h2>
            {userDetails.email && (
              <p className="user-email">{userDetails.email}</p>
            )}
          </div>

          <button className="edit-profile-btn" onClick={() => navigate("/settings")}>
            Edit profile
          </button>

          <div className="user-stats">
            <span>
              <strong>12</strong> followers
            </span>
            <span>·</span>
            <span>
              <strong>5</strong> following
            </span>
          </div>

          <button className="logout-btn" onClick={handleLogout}>
            Sign out
          </button>
        </aside>

        {/* Right — content */}
        <main className="profile-content">
          {activeTab === "overview" && (
            <>
              <div className="contribution-section">
                <HeatMapProfile />
              </div>

              <div className="pinned-section">
                <h4 className="section-label">Popular repositories</h4>
                <div className="pinned-grid">
                  {userRepos.slice(0, 6).map((repo) => (
                    <Link
                      to={`/repo/${repo._id}`}
                      key={repo._id}
                      className="pinned-card"
                    >
                      <div className="pinned-card-top">
                        <span className="pinned-repo-icon">📦</span>
                        <span className="pinned-repo-name">{repo.name}</span>
                        <span className="pinned-visibility">
                          {repo.visibility === false ? "Private" : "Public"}
                        </span>
                      </div>
                      {repo.description && (
                        <p className="pinned-desc">{repo.description}</p>
                      )}
                      <div className="pinned-meta">
                        {repo.language && (
                          <span className="lang-tag">
                            <span
                              className="lang-dot"
                              style={{
                                background:
                                  langColors[repo.language] || "#8b949e",
                              }}
                            ></span>
                            {repo.language}
                          </span>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeTab === "repos" && (
            <div className="repos-tab-content">
              {userRepos.map((repo) => (
                <div key={repo._id} className="repo-list-item">
                  <div className="repo-list-item-main">
                    <div className="repo-list-item-top">
                      <Link
                        to={`/repo/${repo._id}`}
                        className="repo-list-item-name"
                      >
                        {repo.name}
                      </Link>
                      <span className="visibility-label">
                        {repo.visibility === false ? "Private" : "Public"}
                      </span>
                    </div>
                    {repo.description && (
                      <p className="repo-list-item-desc">{repo.description}</p>
                    )}
                    <div className="repo-list-item-meta">
                      {repo.language && (
                        <span className="lang-tag">
                          <span
                            className="lang-dot"
                            style={{
                              background:
                                langColors[repo.language] || "#8b949e",
                            }}
                          ></span>
                          {repo.language}
                        </span>
                      )}
                      {repo.updatedAt && (
                        <span className="meta-text">
                          Updated {repo.updatedAt}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Profile;
