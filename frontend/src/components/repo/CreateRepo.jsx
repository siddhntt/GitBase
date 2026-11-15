import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import "./repo.css";

const CreateRepo = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [visibility, setVisibility] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Repository name is required.");
      return;
    }

    const owner = localStorage.getItem("userId");
    if (!owner) {
      setError("You must be logged in.");
      return;
    }

    try {
      setLoading(true);
      const response = await fetch("http://localhost:3000/repo/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          visibility,
          owner,
          content: [],
          issues: [],
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Failed to create repository.");
        setLoading(false);
        return;
      }

      navigate(`/repo/${data.repositoryID}`);
    } catch (err) {
      console.error("Error creating repository:", err);
      setError("Server error. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="create-repo-wrapper">
        <div className="create-repo-container">
          <h2>Create a new repository</h2>
          <p className="create-repo-subtitle">
            A repository contains all project files, including the revision
            history.
          </p>

          {error && <div className="error-banner">{error}</div>}

          <form onSubmit={handleCreate}>
            <div className="form-group">
              <label htmlFor="repo-name">Repository name *</label>
              <input
                id="repo-name"
                type="text"
                className="repo-input"
                placeholder="my-awesome-project"
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group">
              <label htmlFor="repo-desc">
                Description <span className="optional">(optional)</span>
              </label>
              <input
                id="repo-desc"
                type="text"
                className="repo-input"
                placeholder="Short description of your repository"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                autoComplete="off"
              />
            </div>

            <div className="form-group visibility-group">
              <div
                className={`visibility-option ${visibility ? "selected" : ""}`}
                onClick={() => setVisibility(true)}
              >
                <div className="visibility-icon">🔓</div>
                <div>
                  <strong>Public</strong>
                  <p>Anyone can see this repository.</p>
                </div>
              </div>
              <div
                className={`visibility-option ${!visibility ? "selected" : ""}`}
                onClick={() => setVisibility(false)}
              >
                <div className="visibility-icon">🔒</div>
                <div>
                  <strong>Private</strong>
                  <p>You choose who can see this repository.</p>
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="create-repo-btn"
              disabled={loading}
            >
              {loading ? "Creating..." : "Create repository"}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default CreateRepo;

