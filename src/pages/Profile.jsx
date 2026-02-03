import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

export default function Profile() {
  const { user, profile, refreshProfile, updateProfileDoc, logout, deleteAccountAndData } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      await refreshProfile();
    })();
  }, [refreshProfile]);

  useEffect(() => {
    setName(profile?.name || "");
    setAddress(profile?.address || "");
  }, [profile]);

  async function onSave(e) {
    e.preventDefault();
    setError(null);
    setStatus(null);
    try {
      await updateProfileDoc({ name, address });
      setStatus("✅ Profile updated");
      setTimeout(() => setStatus(null), 2000);
    } catch (err) {
      setError(String(err?.message || err));
    }
  }

  async function onLogout() {
    await logout();
    nav("/");
  }

  async function onDeleteAccount() {
    setError(null);
    setStatus(null);
    try {
      await deleteAccountAndData();
      setStatus("Account deleted.");
      nav("/");
    } catch (err) {
      setError(
        String(
          err?.message ||
            err ||
            "Failed to delete account. You may need to re-login and try again.",
        ),
      );
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Your Profile</h1>
          <p className="sub">Stored in Firestore <code>users</code>.</p>
        </div>

        <div style={{ display: "flex", gap: 10 }}>
          <button className="btn" onClick={onLogout}>
            Logout
          </button>
          <button className="btn btn-danger" onClick={onDeleteAccount}>
            Delete account
          </button>
        </div>
      </div>

      {status && <div className="toast">{status}</div>}
      {error && <div className="toast">⚠️ {error}</div>}

      <form className="panel" onSubmit={onSave} style={{ maxWidth: 620 }}>
        <div style={{ color: "var(--muted)", marginBottom: 10 }}>
          Signed in as <b>{user?.email}</b>
        </div>

        <label className="field">
          <span className="badge">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="field">
          <span className="badge">Address</span>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <button className="btn btn-primary" type="submit">
            Save
          </button>
        </div>
      </form>
    </div>
  );
}
