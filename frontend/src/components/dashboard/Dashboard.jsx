import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./dashboard.css";
import Navbar from "../Navbar";

const sampleRepositories = [
  {
    _id: "sample-user-repo-1",
    name: "react-todo-app",
    description: "A minimal todo application built with React and localStorage for persistence. Features drag-and-drop reordering.",
    visibility: true,
    language: "JavaScript",
    updatedAt: "2 days ago",
  },
  {
    _id: "sample-user-repo-2",
    name: "express-auth-starter",
    description: "Boilerplate for Express.js apps with JWT auth, bcrypt password hashing, and MongoDB integration.",
    visibility: false,
    language: "JavaScript",
    updatedAt: "5 days ago",
  },
  {
    _id: "sample-user-repo-3",
    name: "portfolio-v2",
    description: "Personal portfolio site with dark mode, project showcase, and contact form.",
    visibility: true,
    language: "CSS",
    updatedAt: "1 week ago",
  },
  {
    _id: "sample-user-repo-4",
    name: "markdown-previewer",
    description: "Live markdown editor and preview tool. Supports GFM tables, code highlighting, and export to HTML.",
    visibility: true,
    language: "TypeScript",
    updatedAt: "2 weeks ago",
  },
];

const sampleSuggestedRepositories = [
  {
    _id: "sample-suggested-repo-1",
    name: "node-rate-limiter",
    owner: { username: "devtools" },
    description: "Express middleware for API rate limiting with Redis support.",
    language: "JavaScript",
    stars: 142,
  },
  {
    _id: "sample-suggested-repo-2",
    name: "css-grid-generator",
    owner: { username: "webutils" },
    description: "Visual tool for generating CSS Grid layouts.",
    language: "TypeScript",
    stars: 89,
  },
  {
    _id: "sample-suggested-repo-3",
    name: "mongo-seeder",
    owner: { username: "dbtools" },
    description: "CLI tool to seed MongoDB with fake data for development.",
    language: "JavaScript",
    stars: 67,
  },
  {
    _id: "sample-suggested-repo-4",
    name: "react-form-hooks",
    owner: { username: "formlib" },
    description: "Lightweight form validation hooks for React apps.",
    language: "TypeScript",
    stars: 231,
  },
];

const sampleActivity = [
  { id: 1, type: "push", repo: "react-todo-app", message: "Pushed 3 commits to main", time: "2 hours ago" },
  { id: 2, type: "create", repo: "markdown-previewer", message: "Created repository", time: "3 days ago" },
  { id: 3, type: "issue", repo: "express-auth-starter", message: "Opened issue: Fix token expiry bug", time: "5 days ago" },
  { id: 4, type: "push", repo: "portfolio-v2", message: "Pushed 1 commit to main", time: "1 week ago" },
];

const langColors = {
  JavaScript: "#f1e05a",
  TypeScript: "#3178c6",
  CSS: "#563d7c",
  HTML: "#e34c26",
  Python: "#3572A5",
};

const Dashboard = () => {
  const [repositories, setRepositories] = useState(sampleRepositories);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestedRepositories, setSuggestedRepositories] = useState(
    sampleSuggestedRepositories
  );
  const [searchResults, setSearchResults] = useState([]);

  useEffect(() => {
    const userId = localStorage.getItem("userId");

    const fetchRepositories = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/repo/user/${userId}`
        );
        const data = await response.json();
        if (data.repositories && data.repositories.length > 0) {
          setRepositories(data.repositories);
        }
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    const fetchSuggestedRepositories = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/all`);
        const data = await response.json();
        if (data && data.length > 0) {
          setSuggestedRepositories(data);
        }
      } catch (err) {
        console.error("Error while fetching repositories: ", err);
      }
    };

    fetchRepositories();
    fetchSuggestedRepositories();
  }, []);

  useEffect(() => {
    if (searchQuery === "") {
      setSearchResults(repositories);
    } else {
      const filteredRepo = repositories.filter((repo) =>
        repo.name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setSearchResults(filteredRepo);
    }
  }, [searchQuery, repositories]);

  return (
    <>
      <Navbar />
      <div className="dash-layout">
        {/* Left sidebar — suggested repos */}
        <aside className="dash-sidebar-left">
          <h4 className="sidebar-title">Explore repositories</h4>
          <div className="suggested-list">
            {suggestedRepositories.map((repo) => (
              <Link
                to={`/repo/${repo._id}`}
                key={repo._id}
                className="suggested-item"
              >
                <div className="suggested-item-name">
                  {repo.owner?.username && (
                    <span className="suggested-owner">
                      {repo.owner.username} /
                    </span>
                  )}
                  <span>{repo.name}</span>
                </div>
                <p className="suggested-desc">{repo.description}</p>
                <div className="suggested-meta">
                  {repo.language && (
                    <span className="lang-tag">
                      <span
                        className="lang-dot"
                        style={{
                          background: langColors[repo.language] || "#8b949e",
                        }}
                      ></span>
                      {repo.language}
                    </span>
                  )}
                  {repo.stars && (
                    <span className="star-count">★ {repo.stars}</span>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </aside>

        {/* Center — your repos */}
        <main className="dash-main">
          <div className="repos-header">
            <h3>Your Repositories</h3>
            <Link to="/create" className="new-repo-link">
              + New
            </Link>
          </div>

          <div className="search-bar">
            <input
              type="text"
              value={searchQuery}
              placeholder="Find a repository..."
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="repo-list">
            {searchResults.map((repo) => (
              <div key={repo._id} className="repo-row">
                <div className="repo-row-main">
                  <div className="repo-row-top">
                    <Link to={`/repo/${repo._id}`} className="repo-name-link">
                      {repo.name}
                    </Link>
                    <span className="visibility-label">
                      {repo.visibility === false ? "Private" : "Public"}
                    </span>
                  </div>
                  {repo.description && (
                    <p className="repo-row-desc">{repo.description}</p>
                  )}
                  <div className="repo-row-meta">
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
                      <span className="updated-text">
                        Updated {repo.updatedAt}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
            {searchResults.length === 0 && searchQuery && (
              <div className="empty-state">
                No repositories match <strong>"{searchQuery}"</strong>
              </div>
            )}
          </div>
        </main>

        {/* Right sidebar — activity feed */}
        <aside className="dash-sidebar-right">
          <h4 className="sidebar-title">Recent activity</h4>
          <div className="activity-feed">
            {sampleActivity.map((item) => (
              <div key={item.id} className="activity-item">
                <div className="activity-icon">
                  {item.type === "push" && "⬆"}
                  {item.type === "create" && "✦"}
                  {item.type === "issue" && "◉"}
                </div>
                <div className="activity-content">
                  <p className="activity-msg">
                    {item.message}
                  </p>
                  <span className="activity-repo">{item.repo}</span>
                  <span className="activity-time">{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </aside>
      </div>
    </>
  );
};

export default Dashboard;
