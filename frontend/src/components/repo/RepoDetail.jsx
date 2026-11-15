import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "./repo.css";

const RepoDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [repo, setRepo] = useState(null);
  const [issues, setIssues] = useState([]);
  const [activeTab, setActiveTab] = useState("open");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRepo = async () => {
      try {
        const response = await fetch(`http://localhost:3000/repo/${id}`);
        const data = await response.json();
        if (Array.isArray(data) && data.length > 0) {
          setRepo(data[0]);
        } else if (data && !Array.isArray(data)) {
          setRepo(data);
        }
      } catch (err) {
        console.error("Error fetching repository:", err);
      }
    };

    const fetchIssues = async () => {
      try {
        const response = await fetch(`http://localhost:3000/issue/all/${id}`);
        const data = await response.json();
        if (Array.isArray(data)) {
          setIssues(data);
        }
      } catch (err) {
        console.error("Error fetching issues:", err);
      }
    };

    Promise.all([fetchRepo(), fetchIssues()]).then(() => setLoading(false));
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this repository? This action cannot be undone.")) {
      return;
    }

    try {
      await fetch(`http://localhost:3000/repo/delete/${id}`, {
        method: "DELETE",
      });
      navigate("/");
    } catch (err) {
      console.error("Error deleting repository:", err);
    }
  };

  const handleToggleVisibility = async () => {
    try {
      const response = await fetch(`http://localhost:3000/repo/toggle/${id}`, {
        method: "PATCH",
      });
      const data = await response.json();
      setRepo(data.repository);
    } catch (err) {
      console.error("Error toggling visibility:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-wrapper">Loading repository...</div>
      </>
    );
  }

  if (!repo) {
    return (
      <>
        <Navbar />
        <div className="loading-wrapper">Repository not found.</div>
      </>
    );
  }

  const openIssues = issues.filter((i) => i.status === "open");
  const closedIssues = issues.filter((i) => i.status === "closed");
  const filteredIssues = activeTab === "open" ? openIssues : closedIssues;

  return (
    <>
      <Navbar />
      <div className="repo-detail-wrapper">
        <div className="repo-detail-header">
          <h2>
            {repo.owner && (
              <>
                <span className="repo-owner-link">
                  {repo.owner.username || "unknown"}
                </span>
                <span style={{ color: "#8b949e" }}>/</span>
              </>
            )}
            {repo.name}
            <span className="visibility-badge">
              {repo.visibility ? "Public" : "Private"}
            </span>
          </h2>

          <div className="repo-actions">
            <button
              className="repo-action-btn"
              onClick={handleToggleVisibility}
            >
              {repo.visibility ? "Make Private" : "Make Public"}
            </button>
            <button className="repo-action-btn danger" onClick={handleDelete}>
              Delete
            </button>
          </div>
        </div>

        {repo.description && (
          <p className="repo-description">{repo.description}</p>
        )}

        {/* Files / Content Section */}
        {repo.content && repo.content.length > 0 && (
          <div className="files-section">
            <h3>📁 Files</h3>
            <div className="file-list">
              {repo.content.map((file, index) => (
                <div key={index} className="file-item">
                  <span className="file-icon">📄</span>
                  {file}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Issues Section */}
        <div className="issues-section">
          <div className="issues-header">
            <h3>Issues</h3>
            <Link to={`/repo/${id}/issues/new`} className="new-issue-btn">
              New issue
            </Link>
          </div>

          <div className="issues-tabs">
            <button
              className={`issue-tab ${activeTab === "open" ? "active" : ""}`}
              onClick={() => setActiveTab("open")}
            >
              🟢 {openIssues.length} Open
            </button>
            <button
              className={`issue-tab ${activeTab === "closed" ? "active" : ""}`}
              onClick={() => setActiveTab("closed")}
            >
              ✅ {closedIssues.length} Closed
            </button>
          </div>

          {filteredIssues.length === 0 ? (
            <div className="empty-issues">
              <p>
                {activeTab === "open"
                  ? "No open issues! 🎉"
                  : "No closed issues."}
              </p>
              {activeTab === "open" && (
                <Link to={`/repo/${id}/issues/new`} className="new-issue-btn">
                  Create the first issue
                </Link>
              )}
            </div>
          ) : (
            <div className="issue-list">
              {filteredIssues.map((issue) => (
                <div key={issue._id} className="issue-item">
                  <Link
                    to={`/issue/${issue._id}`}
                    className="issue-title-link"
                  >
                    {issue.title}
                  </Link>
                  <span className={`issue-status-badge ${issue.status}`}>
                    {issue.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default RepoDetail;

