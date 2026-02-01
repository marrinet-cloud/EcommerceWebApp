import React from "react";
import { Routes, Route, NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import Home from "./pages/Home";
import Cart from "./pages/Cart";

export default function App() {
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
      </Routes>
    </>
  );
}