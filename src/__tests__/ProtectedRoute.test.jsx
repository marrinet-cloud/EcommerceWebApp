import { render, screen } from "@testing-library/react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import ProtectedRoute from "../components/ProtectedRoute";

jest.mock("../firebase/AuthContext", () => ({
  useAuth: jest.fn(),
}));

import { useAuth } from "../firebase/AuthContext";

function renderWithRoutes(ui, { initialEntry = "/private" } = {}) {
  return render(
    <MemoryRouter initialEntries={[initialEntry]}>
      <Routes>
        <Route path="/login" element={<div>Login Page</div>} />
        <Route path="/private" element={ui} />
      </Routes>
    </MemoryRouter>
  );
}

test("ProtectedRoute shows a loading message while checking session", () => {
  useAuth.mockReturnValue({ user: null, loading: true });

  renderWithRoutes(
    <ProtectedRoute>
      <div>Private Content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText(/checking session/i)).toBeInTheDocument();
  expect(screen.queryByText(/private content/i)).not.toBeInTheDocument();
});

test("ProtectedRoute redirects unauthenticated users to /login", () => {
  useAuth.mockReturnValue({ user: null, loading: false });

  renderWithRoutes(
    <ProtectedRoute>
      <div>Private Content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText(/login page/i)).toBeInTheDocument();
});

test("ProtectedRoute renders children when user is authenticated", () => {
  useAuth.mockReturnValue({ user: { uid: "abc" }, loading: false });

  renderWithRoutes(
    <ProtectedRoute>
      <div>Private Content</div>
    </ProtectedRoute>
  );

  expect(screen.getByText(/private content/i)).toBeInTheDocument();
});
