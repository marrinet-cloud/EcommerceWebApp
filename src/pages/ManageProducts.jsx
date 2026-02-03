import React, { useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProduct,
  deleteProduct,
  getAllProducts,
  updateProduct,
} from "../api/firestoreProducts";

const blank = {
  title: "",
  price: "",
  description: "",
  category: "",
  image: "",
};

export default function ManageProducts() {
  const qc = useQueryClient();
  const listQ = useQuery({ queryKey: ["products"], queryFn: getAllProducts });
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(blank);
  const [msg, setMsg] = useState(null);
  const [error, setError] = useState(null);

  const products = useMemo(() => listQ.data ?? [], [listQ.data]);

  const createM = useMutation({
    mutationFn: createProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      setForm(blank);
      setMsg("✅ Product created");
      setTimeout(() => setMsg(null), 1600);
    },
    onError: (e) => setError(String(e?.message || e)),
  });

  const updateM = useMutation({
    mutationFn: ({ id, updates }) => updateProduct(id, updates),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      setEditingId(null);
      setForm(blank);
      setMsg("✅ Product updated");
      setTimeout(() => setMsg(null), 1600);
    },
    onError: (e) => setError(String(e?.message || e)),
  });

  const deleteM = useMutation({
    mutationFn: deleteProduct,
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["products"] });
      setMsg("🗑️ Product deleted");
      setTimeout(() => setMsg(null), 1600);
    },
    onError: (e) => setError(String(e?.message || e)),
  });

  function startEdit(p) {
    setEditingId(p.id);
    setForm({
      title: p.title ?? "",
      price: String(p.price ?? ""),
      description: p.description ?? "",
      category: p.category ?? "",
      image: p.image ?? "",
    });
  }

  function cancelEdit() {
    setEditingId(null);
    setForm(blank);
  }

  async function submit(e) {
    e.preventDefault();
    setError(null);
    const payload = {
      ...form,
      price: Number(form.price || 0),
    };

    if (!payload.title.trim()) {
      setError("Title is required");
      return;
    }

    if (editingId) {
      await updateM.mutateAsync({ id: editingId, updates: payload });
    } else {
      await createM.mutateAsync(payload);
    }
  }

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Manage Products</h1>
          <p className="sub">
            CRUD backed by Firestore <code>products</code>.
          </p>
        </div>
      </div>

      {msg && <div className="toast">{msg}</div>}
      {error && <div className="toast">⚠️ {error}</div>}

      <form className="panel" onSubmit={submit} style={{ maxWidth: 900 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 180px", gap: 12 }}>
          <label className="field">
            <span className="badge">Title</span>
            <input
              value={form.title}
              onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
            />
          </label>

          <label className="field">
            <span className="badge">Price</span>
            <input
              inputMode="decimal"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
            />
          </label>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: 12 }}>
          <label className="field">
            <span className="badge">Category</span>
            <input
              value={form.category}
              onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
            />
          </label>

          <label className="field">
            <span className="badge">Image URL</span>
            <input
              value={form.image}
              onChange={(e) => setForm((f) => ({ ...f, image: e.target.value }))}
            />
          </label>
        </div>

        <label className="field">
          <span className="badge">Description</span>
          <textarea
            rows={3}
            value={form.description}
            onChange={(e) =>
              setForm((f) => ({ ...f, description: e.target.value }))
            }
          />
        </label>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 10 }}>
          {editingId && (
            <button type="button" className="btn" onClick={cancelEdit}>
              Cancel
            </button>
          )}
          <button className="btn btn-primary" type="submit">
            {editingId ? "Update product" : "Create product"}
          </button>
        </div>
      </form>

      <div style={{ height: 14 }} />

      {listQ.isLoading && <div className="panel">Loading products...</div>}
      {listQ.isError && (
        <div className="panel">
          Failed to load products: {String(listQ.error?.message || listQ.error)}
        </div>
      )}

      {!listQ.isLoading && !listQ.isError && (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {products.map((p) => (
            <div key={p.id} className="row">
              <div style={{ minWidth: 220 }}>
                <div style={{ fontWeight: 900 }}>{p.title}</div>
                <div style={{ color: "var(--muted)", fontSize: 13 }}>
                  {p.category || "(no category)"}
                </div>
              </div>

              <div style={{ fontWeight: 900 }}>${Number(p.price || 0).toFixed(2)}</div>

              <div style={{ marginLeft: "auto", display: "flex", gap: 10 }}>
                <button className="btn" onClick={() => startEdit(p)}>
                  Edit
                </button>
                <button
                  className="danger"
                  onClick={() => deleteM.mutate(p.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
