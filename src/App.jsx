import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import Orders from "./pages/Orders";
import OrderDetails from "./pages/OrderDetails";
import ManageProducts from "./pages/ManageProducts";
import ProtectedRoute from "./components/ProtectedRoute";
import { useAuth } from "./firebase/AuthContext";

export default function App() {
  const { user } = useAuth();
  const count = useSelector((s) =>
    s.cart.items.reduce((sum, p) => sum + p.count, 0),
  );

  return (
    <>
      <header className="nav">
        <div className="nav-inner">
          <div className="brand">
            <span>⚡</span>
            <span>Advanced Shop</span>
            <span className="badge">Vite</span>
          </div>

          <div className="nav-links">
            <NavLink className="nav-link" to="/">
              Home
            </NavLink>
            {user && (
              <NavLink className="nav-link" to="/orders">
                Orders
              </NavLink>
            )}
            {user && (
              <NavLink className="nav-link" to="/manage-products">
                Manage Products
              </NavLink>
            )}
            {user ? (
              <NavLink className="nav-link" to="/profile">
                Profile
              </NavLink>
            ) : (
              <NavLink className="nav-link" to="/login">
                Login
              </NavLink>
            )}
            <NavLink className="nav-link pill" to="/cart">
              Cart{" "}
              <span className="badge" style={{ marginLeft: 8 }}>
                {count}
              </span>
            </NavLink>
          </div>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders/:id"
          element={
            <ProtectedRoute>
              <OrderDetails />
            </ProtectedRoute>
          }
        />
        <Route
          path="/manage-products"
          element={
            <ProtectedRoute>
              <ManageProducts />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
}