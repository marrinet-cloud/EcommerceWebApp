import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  serverTimestamp,
  where,
} from "firebase/firestore";
import { db } from "../firebase/firebase";

const ordersCol = collection(db, "orders");

function mapDoc(d) {
  return { id: d.id, ...d.data() };
}

export async function createOrder({ uid, email, items, totalPrice }) {
  const payload = {
    uid,
    email,
    items,
    totalPrice: Number(totalPrice || 0),
    createdAt: serverTimestamp(),
  };
  const ref = await addDoc(ordersCol, payload);
  return { id: ref.id, ...payload };
}

export async function listOrdersByUser(uid) {
  const q = query(ordersCol, where("uid", "==", uid), orderBy("createdAt", "desc"));
  const snap = await getDocs(q);
  return snap.docs.map(mapDoc);
}

export async function getOrderById(id) {
  const snap = await getDoc(doc(db, "orders", id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}
