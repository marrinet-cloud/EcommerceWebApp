import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { listOrdersByUser } from "../api/firestoreOrders";
import { useAuth } from "../firebase/AuthContext";

function fmtDate(ts) {
  if (!ts) return "";
  // Firestore Timestamp -> Date
  const d = ts?.toDate ? ts.toDate() : (ts instanceof Date ? ts : null);
  if (!d) return "";
  return d.toLocaleString();
}

export default function Orders() {
  const { user } = useAuth();

  const q = useQuery({
    queryKey: ["orders", user?.uid],
    queryFn: () => listOrdersByUser(user.uid),
    enabled: !!user,
  });

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Order History</h1>
          <p className="sub">
            Orders are stored in Firestore <code>orders</code> and filtered by
            your user id.
          </p>
        </div>
      </div>

      {q.isLoading && <div className="panel">Loading orders...</div>}
      {q.isError && (
        <div className="panel">
          Failed to load orders: {String(q.error?.message || q.error)}
        </div>
      )}

      {!q.isLoading && !q.isError && (q.data?.length ?? 0) === 0 && (
        <div className="panel">No orders yet.</div>
      )}

      {!q.isLoading && !q.isError && (q.data?.length ?? 0) > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {q.data.map((o) => (
            <Link key={o.id} to={`/orders/${o.id}`} className="panel" style={{ textDecoration: "none" }}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: 10 }}>
                <div>
                  <div style={{ fontWeight: 900 }}>Order: {o.id}</div>
                  <div style={{ color: "var(--muted)", marginTop: 6 }}>
                    {fmtDate(o.createdAt)}
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <div className="badge">Total</div>
                  <div style={{ fontWeight: 900, marginTop: 6 }}>
                    ${Number(o.totalPrice || 0).toFixed(2)}
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
