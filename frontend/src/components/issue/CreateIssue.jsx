import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "../repo/repo.css";

const CreateIssue = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!title.trim()) {
      setError("Issue title is required.");
      return;
    }

    if (!description.trim()) {
      setError("Issue description is required.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/issue/create/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title.trim(),
          description: description.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create issue.");
        setLoading(false);
        return;
      }

      navigate(`/repo/${id}`);
    } catch (err) {
      console.error("Error creating issue:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-issue-wrapper">
        <div className="create-issue-container">
          <h2>New Issue</h2>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="issue-title">Title *</label>
              <input
                id="issue-title"
                type="text"
                className="repo-input"
                placeholder="Issue title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="issue-desc">Description *</label>
              <textarea
                id="issue-desc"
                className="issue-textarea"
                placeholder="Describe the issue in detail..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            <div style={{ display: "flex", gap: "10px" }}>
              <button
                type="submit"
                className="create-issue-btn"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit new issue"}
              </button>
              <button
                type="button"
                className="repo-action-btn"
                onClick={() => navigate(`/repo/${id}`)}
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateIssue;

