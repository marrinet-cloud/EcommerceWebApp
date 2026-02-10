# Advanced E-commerce (Firebase Edition)

**Live Demo:** _ADD_YOUR_VERCEL_URL_HERE_

This project replaces the previous FakeStore API with **Firebase Authentication** + **Cloud Firestore**.

## 1) Firebase setup

1. Create a project in the Firebase console.
2. Add a Web App.
3. Enable:
   - **Authentication** → Sign-in method → Email/Password
   - **Firestore Database** (start in test mode for local development)
4. Copy your web app config values into a Vite env file.

Create a file named `.env.local` in the project root:

```
VITE_FIREBASE_API_KEY=...
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_MESSAGING_SENDER_ID=...
VITE_FIREBASE_APP_ID=...
```

> The Firebase initialization lives in `src/firebase/firebase.js`.

## 2) Data model (Firestore)

### `users` collection
Document id: `uid` (same as Firebase Auth UID)

Example fields:
- `uid`
- `email`
- `name`
- `address`
- `createdAt`

### `products` collection
Document id: auto-generated

Example fields:
- `title` (string)
- `price` (number)
- `description` (string)
- `category` (string)
- `image` (string URL)
- `rating` (optional: `{ rate, count }` to keep existing sorting UI compatible)

### `orders` collection
Document id: auto-generated

Example fields:
- `uid` (string)
- `email` (string)
- `items` (array of `{ id, title, price, image, count }`)
- `totalPrice` (number)
- `createdAt`

## 3) App features (what was implemented)

### Authentication
- Register (Email/Password) → creates a matching Firestore user doc (`users/{uid}`)
- Login / Logout

### User management (Firestore)
- Read profile (from `users/{uid}`)
- Update profile fields (name, address)
- Delete account (deletes Firestore profile doc + Firebase Auth user)

### Products (Firestore)
- Product catalog reads from Firestore (`products`)
- Filter by category + sort (same UI)
- In-app CRUD: **Manage Products** page (`/manage-products`)

### Orders (Firestore)
- Checkout writes an order doc to `orders` and clears the cart
- Order history (`/orders`) lists the signed-in user's orders
- Order details view (`/orders/:id`)

## 4) Run locally

```bash
npm install
npm run dev
```

## 5) Firestore security rules (starter)

For development you can start in test mode. When you lock it down, a common baseline is:

- Users can read/update their own `users/{uid}` doc.
- Authenticated users can read products.
- Only admins can write products.
- Users can write orders for themselves and read their own orders.

Implementing admin roles is app-specific (e.g., `users/{uid}.role == 'admin'`).
>>>>>>> cbcb1bb (final)
---

## CI/CD (GitHub Actions → Vercel)

This repo includes a GitHub Actions workflow at `.github/workflows/main.yml` that:

1. Runs **CI** on every push to `main`:
   - `npm ci`
   - `npm test -- --ci`
   - `npm run build`
2. Runs **CD** only if CI passes:
   - Deploys to **Vercel (Production)** using the Vercel CLI.

### Required GitHub Secrets (Repository → Settings → Secrets and variables → Actions)

- `VERCEL_TOKEN` — Vercel Personal Token
- (Recommended) Set these in Vercel project settings as well:
  - `VITE_FIREBASE_API_KEY`
  - `VITE_FIREBASE_AUTH_DOMAIN`
  - `VITE_FIREBASE_PROJECT_ID`
  - `VITE_FIREBASE_STORAGE_BUCKET`
  - `VITE_FIREBASE_MESSAGING_SENDER_ID`
  - `VITE_FIREBASE_APP_ID`

> Note: Vercel **Environment Variables** are the right place for `VITE_*` keys (they become available at build time).

---

## Testing (TDD)

Run tests locally:

```bash
npm test
```

### What’s covered

- **Unit tests**
  - `ProductCard` rendering + interaction
  - `ProtectedRoute` behavior (loading, redirect, authenticated)
- **Integration test**
  - “Add to cart” updates the cart count (Redux store + UI)

Tests live in `src/__tests__/`.
