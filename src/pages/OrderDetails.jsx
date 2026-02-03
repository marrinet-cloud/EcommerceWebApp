import React, { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link, useParams } from "react-router-dom";
import { getOrderById } from "../api/firestoreOrders";

const PLACEHOLDER = "https://via.placeholder.com/200?text=No+Image";

function fmtDate(ts) {
  if (!ts) return "";
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : null);
  if (!d) return "";
  return d.toLocaleString();
}

export default function OrderDetails() {
  const { id } = useParams();

  const q = useQuery({
    queryKey: ["order", id],
    queryFn: () => getOrderById(id),
    enabled: !!id,
  });

  const total = useMemo(() => {
    const items = q.data?.items ?? [];
    return items.reduce(
      (sum, p) => sum + Number(p.price || 0) * Number(p.count || 1),
      0,
    );
  }, [q.data]);

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Order Details</h1>
          <p className="sub">
            <Link to="/orders">← Back to orders</Link>
          </p>
        </div>
      </div>

      {q.isLoading && <div className="panel">Loading order...</div>}
      {q.isError && (
        <div className="panel">
          Failed to load order: {String(q.error?.message || q.error)}
        </div>
      )}

      {!q.isLoading && !q.isError && !q.data && (
        <div className="panel">Order not found.</div>
      )}

      {!q.isLoading && !q.isError && q.data && (
        <>
          <div className="panel" style={{ marginBottom: 14 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 900 }}>Order: {q.data.id}</div>
                <div style={{ color: "var(--muted)", marginTop: 6 }}>
                  {fmtDate(q.data.createdAt)}
                </div>
              </div>

              <div style={{ textAlign: "right" }}>
                <div className="badge">Total</div>
                <div style={{ fontWeight: 900, marginTop: 6 }}>
                  ${Number(q.data.totalPrice ?? total).toFixed(2)}
                </div>
              </div>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {(q.data.items ?? []).map((p, idx) => (
              <div key={`${p.id}-${idx}`} className="row">
                <img
                  className="thumb"
                  src={p.image || PLACEHOLDER}
                  alt={p.title}
                  onError={(e) => {
                    e.currentTarget.src = PLACEHOLDER;
                  }}
                />

                <div>
                  <div style={{ fontWeight: 800, marginBottom: 4 }}>{p.title}</div>
                  <div style={{ color: "var(--muted)", fontSize: 13 }}>
                    ${Number(p.price || 0).toFixed(2)} • Qty: {p.count}
                  </div>
                </div>

                <div style={{ marginLeft: "auto", fontWeight: 900 }}>
                  ${(Number(p.price || 0) * Number(p.count || 1)).toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
