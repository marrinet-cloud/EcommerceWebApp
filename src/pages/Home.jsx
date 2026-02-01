import React, { useMemo, useState, useEffect, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  getAllProducts,
  getCategories,
  getProductsByCategory,
} from "../api/fakestore";
import ProductCard from "../components/ProductCard";
import { useDispatch } from "react-redux";
import { addToCart } from "../features/cart/cartSlice";

export default function Home() {
  const dispatch = useDispatch();

  // Category filter
  const [category, setCategory] = useState("all");

  // Sort option
  const [sortBy, setSortBy] = useState("none"); // none | price-asc | price-desc | rating-desc

  // Toast state
  const [toast, setToast] = useState(null);
  const toastTimerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    };
  }, []);

  const categoriesQuery = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const productsQuery = useQuery({
    queryKey: ["products", category],
    queryFn: () =>
      category === "all" ? getAllProducts() : getProductsByCategory(category),
  });

  const categories = useMemo(
    () => categoriesQuery.data ?? [],
    [categoriesQuery.data],
  );
  const rawProducts = useMemo(
    () => productsQuery.data ?? [],
    [productsQuery.data],
  );

  // Sorted products (IMPORTANT: copy array to avoid mutating React Query cache)
  const products = useMemo(() => {
    const list = [...rawProducts];

    if (sortBy === "price-asc") {
      list.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === "price-desc") {
      list.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === "rating-desc") {
      list.sort(
        (a, b) => Number(b?.rating?.rate ?? 0) - Number(a?.rating?.rate ?? 0),
      );
    }

    return list;
  }, [rawProducts, sortBy]);

  function showToast(message) {
    setToast(message);
    if (toastTimerRef.current) clearTimeout(toastTimerRef.current);
    toastTimerRef.current = setTimeout(() => setToast(null), 1600);
  }

  function handleAdd(product) {
    dispatch(addToCart(product));
    // ✅ toast shows product title
    showToast(`✅ Added: ${product.title}`);
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Product Catalog</h1>
          <p className="sub">
            Powered by FakeStoreAPI • React Query for fetching • Redux Toolkit
            cart
          </p>
        </div>

        <div className="controls-row">
          {/* Category dropdown */}
          <div className="control">
            <span className="badge">Category</span>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              disabled={categoriesQuery.isLoading}
            >
              <option value="all">All</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Sort dropdown */}
          <div className="control">
            <span className="badge">Sort</span>
            <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="none">None</option>
              <option value="price-asc">Price: Low → High</option>
              <option value="price-desc">Price: High → Low</option>
              <option value="rating-desc">Rating: High → Low</option>
            </select>
          </div>

          {/* ✅ Clear sort button */}
          {sortBy !== "none" && (
            <button
              className="btn"
              onClick={() => setSortBy("none")}
              style={{ height: 42 }}
            >
              Clear sort
            </button>
          )}
        </div>
      </div>

      {categoriesQuery.isError && (
        <div className="panel">
          Failed to load categories:{" "}
          {String(categoriesQuery.error?.message || categoriesQuery.error)}
        </div>
      )}

      {productsQuery.isLoading && (
        <div className="panel">Loading products...</div>
      )}
      {productsQuery.isError && (
        <div className="panel">
          Failed to load products:{" "}
          {String(productsQuery.error?.message || productsQuery.error)}
        </div>
      )}

      {!productsQuery.isLoading && !productsQuery.isError && (
        <div className="grid">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={handleAdd} />
          ))}
        </div>
      )}

      {/* Floating toast */}
      {toast && <div className="toast-floating">{toast}</div>}
    </div>
  );
}
