<<<<<<< HEAD
This project is a modern e-commerce web application built with React, Vite, React Query, and Redux Toolkit, using the FakeStoreAPI to simulate real-world product data and asynchronous requests.
The application follows a clear separation of concerns:
React + Vite for fast development and component-based UI
React Query for all API data fetching and caching
Redux Toolkit for global shopping cart state
sessionStorage for cart persistence across page refreshes
React Router for page navigation
All product and category data is fetched using React Query:
GET /products → all products
GET /products/categories → category list
GET /products/category/{category} → filtered products
React Query handles:
Loading and error states
Caching and refetching
Preventing unnecessary network requests
Sorting (price/rating) is done client-side only, without utating cached data.
The shopping cart is managed globally using Redux Toolkit:
Add products to cart
Increment/decrement quantities
Remove products
Clear cart on checkout
Each cart item stores:
Product data
Quantity (count)
Cart data is saved to sessionStorage on every update and loaded when the app initializes.
This ensures the cart persists across page refreshes during a session.
Dynamic category dropdown (not hard-coded)
Image fallback for broken API image URLs
“Added to cart” toast notifications
Sort by price or rating, with a clear sort option
Responsive modern CSS layout
Because FakeStoreAPI does not support real orders:
Checkout clears Redux state
sessionStorage is cleared
User receives visual confirmation
React (Hooks)
Vite
React Query
Redux Toolkit
React Router
FakeStoreAPI
Project Goals Met
Asynchronous data fetching
Global state management
Persistent cart behavior
Clean folder structure
User-friendly UI
Graceful error handling
This project reinforced the importance of selecting the right tools for the right responsibilities within a React application. By using React Query for server-state management and Redux Toolkit for client-side cart state, the application maintains a clean separation between asynchronous data fetching and global UI state. This approach resulted in simpler components and more predictable behavior.
One of the key lessons learned was the value of non-mutating data patterns, especially when working with cached data from React Query. Client-side sorting was implemented carefully to avoid mutating cached arrays, preserving data integrity and preventing subtle bugs.
Handling real-world API imperfections—such as broken image URLs—highlighted the importance of defensive UI programming. Implementing graceful fallbacks ensured the application remained usable and visually consistent despite external data issues.
Persisting cart data using sessionStorage demonstrated how browser storage can be leveraged to improve user experience without adding unnecessary complexity. Additionally, implementing a simulated checkout process helped clarify how state resets and side effects should be handled cleanly within Redux.
Overall, this project strengthened my understanding of modern React architecture, reinforced best practices for state management and data fetching, and emphasized the importance of user-focused design and error handling in frontend applications.
=======
# Advanced E-commerce (Firebase Edition)

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
