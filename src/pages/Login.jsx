import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

export default function Login() {
  const { login } = useAuth();
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await login({ email, password });
      nav("/");
    } catch (err) {
      setError(String(err?.message || err));
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Sign in</h1>
          <p className="sub">Email/password authentication with Firebase.</p>
        </div>
      </div>

      {error && <div className="toast">⚠️ {error}</div>}

      <form className="panel" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <label className="field">
          <span className="badge">Email</span>
          <input value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>

        <label className="field">
          <span className="badge">Password</span>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <div style={{ display: "flex", gap: 10, justifyContent: "flex-end" }}>
          <button className="btn btn-primary" type="submit">
            Sign in
          </button>
        </div>

        <div style={{ marginTop: 12, color: "var(--muted)" }}>
          No account? <Link to="/register">Create one</Link>
        </div>
      </form>
    </div>
  );
}
