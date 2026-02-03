import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  orderBy,
  query,
  updateDoc,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const productsCol = collection(db, "products");

function mapDoc(d) {
  return { id: d.id, ...d.data() };
}

export async function getAllProducts() {
  const q = query(productsCol, orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function getProductsByCategory(category) {
  const q = query(productsCol, where("category", "==", category), orderBy("title"));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function getCategories() {
  const snap = await getDocs(productsCol);
  const set = new Set();
  for (const d of snap.docs) {
    const c = d.data()?.category;
    if (c) set.add(c);
  }
  return Array.from(set).sort();
}

export async function createProduct(product) {
  const payload = {
    title: String(product.title || "").trim(),
    price: Number(product.price || 0),
    description: String(product.description || ""),
    category: String(product.category || "").trim(),
    image: String(product.image || "").trim(),
    rating: product.rating ?? { rate: 0, count: 0 },
  };
  const ref = await addDoc(productsCol, payload);
  return { id: ref.id, ...payload };
}

export async function updateProduct(id, updates) {
  const ref = doc(db, "products", id);
  const payload = { ...updates };
  if (payload.price !== undefined) payload.price = Number(payload.price || 0);
  await updateDoc(ref, payload);
}

export async function deleteProduct(id) {
  await deleteDoc(doc(db, "products", id));
}
