import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  clearCart,
  decrement,
  removeFromCart,
  setCount,
} from "../features/cart/cartSlice";

const PLACEHOLDER = "https://via.placeholder.com/200?text=No+Image";

export default function Cart() {
  const dispatch = useDispatch();
  const items = useSelector((s) => s.cart.items);
  const [checkedOut, setCheckedOut] = useState(false);

  const totals = useMemo(() => {
    const totalProducts = items.reduce((sum, p) => sum + p.count, 0);
    const totalPrice = items.reduce(
      (sum, p) => sum + p.count * Number(p.price || 0),
      0,
    );
    return { totalProducts, totalPrice };
  }, [items]);

  const checkout = () => {
    dispatch(clearCart());
    setCheckedOut(true);
    setTimeout(() => setCheckedOut(false), 2500);
  };

  return (
    <div className="container">
      <div className="header">
        <div>
          <h1 className="h1">Your Cart</h1>
          <p className="sub">
            Update quantities, remove items, or checkout to clear the cart.
          </p>
        </div>

        <div className="control">
          <span className="badge">Totals</span>
          <span>
            {totals.totalProducts} items • ${totals.totalPrice.toFixed(2)}
          </span>
        </div>
      </div>

      {checkedOut && (
        <div className="toast">
          ✅ Checkout complete! Your cart has been cleared.
        </div>
      )}

      {items.length === 0 ? (
        <div className="panel">Your cart is empty.</div>
      ) : (
        <>
          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {items.map((p) => (
              <CartRow
                key={p.id}
                item={p}
                onRemove={() => dispatch(removeFromCart(p.id))}
                onDec={() => dispatch(decrement(p.id))}
                onInc={() => dispatch(addToCart(p))}
                onSetCount={(count) => dispatch(setCount({ id: p.id, count }))}
              />
            ))}
          </div>

          <div
            style={{
              display: "flex",
              gap: 10,
              justifyContent: "flex-end",
              marginTop: 14,
            }}
          >
            <button className="btn" onClick={() => dispatch(clearCart())}>
              Clear cart
            </button>
            <button className="btn btn-primary" onClick={checkout}>
              Checkout
            </button>
          </div>
        </>
      )}
    </div>
  );
}

function CartRow({ item, onRemove, onDec, onInc, onSetCount }) {
  const [imgSrc, setImgSrc] = useState(item.image);

  return (
    <div className="row">
      <img
        className="thumb"
        src={imgSrc}
        alt={item.title}
        onError={() => setImgSrc(PLACEHOLDER)}
      />

      <div>
        <div style={{ fontWeight: 800, marginBottom: 4 }}>{item.title}</div>
        <div style={{ color: "var(--muted)", fontSize: 13 }}>${item.price}</div>
        <button className="danger" onClick={onRemove}>
          Remove
        </button>
      </div>

      <div className="qty">
        <button onClick={onDec}>-</button>
        <input
          value={item.count}
          onChange={(e) => onSetCount(e.target.value)}
          inputMode="numeric"
        />
        <button onClick={onInc}>+</button>
      </div>

      <div style={{ textAlign: "right", fontWeight: 800 }}>
        ${(Number(item.price) * item.count).toFixed(2)}
      </div>
    </div>
  );
}
