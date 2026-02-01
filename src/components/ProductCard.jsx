import React, { useState } from "react";
const PLACEHOLDER = "https://via.placeholder.com/400x300?text=No+Image";

export default function ProductCard({ product, onAdd }) {
  const [imgSrc, setImgSrc] = useState(product.image);

  return (
    <div className="card">
      <div className="card-top">
        <img
          src={imgSrc}
          alt={product.title}
          onError={() => setImgSrc(PLACEHOLDER)}
          loading="lazy"
        />
      </div>

      <div className="card-body">
        <h3 className="title">{product.title}</h3>

        <div className="meta">
          <div>
            <b>Price:</b> ${product.price}
          </div>
          <div>
            <b>Rate:</b> {product?.rating?.rate ?? "N/A"}
          </div>
          <div>
            <b>Category:</b> {product.category}
          </div>
          <div>
            <b>ID:</b> {product.id}
          </div>
        </div>

        <p className="desc">{product.description}</p>

        <button className="btn btn-primary" onClick={() => onAdd(product)}>
          Add to cart
        </button>
      </div>
    </div>
  );
}