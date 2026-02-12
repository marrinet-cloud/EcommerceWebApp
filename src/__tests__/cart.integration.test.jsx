import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider, useSelector } from "react-redux";
import { store } from "../app/store";
import ProductCard from "../components/ProductCard";
import { addToCart, clearCart } from "../features/cart/cartSlice";

function CartCountBadge() {
  const count = useSelector((s) =>
    s.cart.items.reduce((sum, p) => sum + p.count, 0)
  );
  return <div aria-label="cart-count">{count}</div>;
}

function TestShop({ product }) {
  return (
    <div>
      <CartCountBadge />
      <ProductCard product={product} onAdd={(p) => store.dispatch(addToCart(p))} />
    </div>
  );
}

test("integration: cart count updates when adding a product", async () => {
  const user = userEvent.setup();

  store.dispatch(clearCart());

  const product = {
    id: 42,
    title: "Integration Product",
    price: 10,
    rating: { rate: 5 },
    category: "integration",
    description: "Used in integration test",
    image: "https://example.com/img.jpg",
  };

  render(
    <Provider store={store}>
      <TestShop product={product} />
    </Provider>
  );

  expect(screen.getByLabelText("cart-count")).toHaveTextContent("0");

  await user.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(screen.getByLabelText("cart-count")).toHaveTextContent("1");

  await user.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(screen.getByLabelText("cart-count")).toHaveTextContent("2");
});
