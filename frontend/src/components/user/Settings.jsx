import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar";
import { useAuth } from "../../authContext";
import "../repo/repo.css";

const Settings = () => {
  const navigate = useNavigate();
  const { setCurrentUser } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchUser = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const response = await fetch(
          `http://localhost:3000/userProfile/${userId}`
        );
        const data = await response.json();
        if (data.email) {
          setEmail(data.email);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (password && password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      setLoading(true);
      const body = { email };
      if (password) {
        body.password = password;
      }

      const response = await fetch(
        `http://localhost:3000/updateProfile/${userId}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        }
      );

      if (response.ok) {
        setSuccess("Profile updated successfully!");
        setPassword("");
        setConfirmPassword("");
      } else {
        setError("Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setError("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (
      !window.confirm(
        "Are you sure? This will permanently delete your account and all your data."
      )
    ) {
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) return;

    try {
      await fetch(`http://localhost:3000/deleteProfile/${userId}`, {
        method: "DELETE",
      });

      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      setCurrentUser(null);
      window.location.href = "/auth";
    } catch (err) {
      console.error("Error deleting account:", err);
    }
  };

  return (
    <>
      <Navbar />
      <div className="settings-wrapper">
        <div className="settings-container">
          <h2>Account settings</h2>

          {error && <div className="error-banner">{error}</div>}
          {success && <div className="success-banner">{success}</div>}

          <div className="settings-section">
            <h3>Update email</h3>
            <form onSubmit={handleSave}>
              <div className="form-group">
                <label htmlFor="settings-email">Email address</label>
                <input
                  id="settings-email"
                  type="email"
                  className="settings-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="off"
                />
              </div>

              <div className="form-group">
                <label htmlFor="settings-password">
                  Change password{" "}
                  <span className="optional">(leave blank to keep current)</span>
                </label>
                <input
                  id="settings-password"
                  type="password"
                  className="settings-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="New password"
                  autoComplete="new-password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="settings-confirm-password">
                  Confirm password
                </label>
                <input
                  id="settings-confirm-password"
                  type="password"
                  className="settings-input"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  autoComplete="new-password"
                />
              </div>

              <button
                type="submit"
                className="settings-save-btn"
                disabled={loading}
              >
                {loading ? "Saving..." : "Update profile"}
              </button>
            </form>
          </div>

          <div className="settings-section settings-delete-section">
            <p>
              Want to delete your account?{" "}
              <span
                className="delete-link"
                onClick={handleDeleteAccount}
              >
                Delete account
              </span>
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;
