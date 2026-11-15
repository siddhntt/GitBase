import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../Navbar";
import "../repo/repo.css";

const IssueDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [issue, setIssue] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchIssue = async () => {
      try {
        const response = await fetch(`http://localhost:3000/issue/${id}`);
        const data = await response.json();
        setIssue(data);
      } catch (err) {
        console.error("Error fetching issue:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssue();
  }, [id]);

  const handleToggleStatus = async () => {
    if (!issue) return;

    const newStatus = issue.status === "open" ? "closed" : "open";

    try {
      const response = await fetch(`http://localhost:3000/issue/update/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await response.json();
      setIssue(data.issue || { ...issue, status: newStatus });
    } catch (err) {
      console.error("Error updating issue:", err);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        "Are you sure you want to delete this issue? This cannot be undone."
      )
    ) {
      return;
    }

    try {
      await fetch(`http://localhost:3000/issue/delete/${id}`, {
        method: "DELETE",
      });

      if (issue && issue.repository) {
        navigate(`/repo/${issue.repository}`);
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Error deleting issue:", err);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="loading-wrapper">Loading issue...</div>
      </>
    );
  }

  if (!issue) {
    return (
      <>
        <Navbar />
        <div className="loading-wrapper">Issue not found.</div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="issue-detail-wrapper">
        <div className="issue-detail-header">
          <h2>
            {issue.title}
            <span className="issue-number">#{id.slice(-4)}</span>
          </h2>
          <div className="issue-meta">
            <span className={`issue-status-badge ${issue.status}`}>
              {issue.status === "open" ? "🟢 Open" : "✅ Closed"}
            </span>
            {issue.repository && (
              <Link
                to={`/repo/${issue.repository}`}
                style={{ color: "#58a6ff", textDecoration: "none" }}
              >
                ← Back to repository
              </Link>
            )}
          </div>
        </div>

        <div className="issue-detail-body">
          {issue.description || "No description provided."}
        </div>

        <div className="issue-detail-actions">
          <button className="repo-action-btn" onClick={handleToggleStatus}>
            {issue.status === "open" ? "Close issue" : "Reopen issue"}
          </button>
          <button className="repo-action-btn danger" onClick={handleDelete}>
            Delete issue
          </button>
        </div>
      </div>
    </>
  );
};

export default IssueDetail;

