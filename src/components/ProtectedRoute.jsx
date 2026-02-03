import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../firebase/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="container"><div className="panel">Checking session...</div></div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
