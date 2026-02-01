const BASE_URL = "https://fakestoreapi.com";

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Request failed: ${res.status}`);
  return res.json();
}

export const getAllProducts = () => fetchJson(`${BASE_URL}/products`);
export const getCategories = () => fetchJson(`${BASE_URL}/products/categories`);
export const getProductsByCategory = (category) =>
  fetchJson(`${BASE_URL}/products/category/${encodeURIComponent(category)}`);
