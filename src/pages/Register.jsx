import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

export default function Register() {
  const { register } = useAuth();
  const nav = useNavigate();
  const [name, setName] = useState("");
  const [address, setAddress] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  async function onSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      await register({ email, password, name, address });
      nav("/");
    } catch (err) {
      setError(String(err?.message || err));
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Create account</h1>
          <p className="sub">
            Registers the user in Firebase Auth and creates a matching Firestore
            document in <code>users</code>.
          </p>
        </div>
      </div>

      {error && <div className="toast">⚠️ {error}</div>}

      <form className="panel" onSubmit={onSubmit} style={{ maxWidth: 520 }}>
        <label className="field">
          <span className="badge">Name</span>
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>

        <label className="field">
          <span className="badge">Address</span>
          <input value={address} onChange={(e) => setAddress(e.target.value)} />
        </label>

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
            Create account
          </button>
        </div>

        <div style={{ marginTop: 12, color: "var(--muted)" }}>
          Have an account? <Link to="/login">Sign in</Link>
        </div>
      </form>
    </div>
  );
}
