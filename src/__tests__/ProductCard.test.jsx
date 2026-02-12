import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductCard from "../components/ProductCard";

const sampleProduct = {
  id: 1,
  title: "Test Product",
  price: 19.99,
  rating: { rate: 4.2 },
  category: "test-category",
  description: "A product used for testing.",
  image: "https://example.com/broken.jpg",
};

test("ProductCard renders key product details", () => {
  render(<ProductCard product={sampleProduct} onAdd={() => {}} />);

  expect(screen.getByRole("heading", { name: /test product/i })).toBeInTheDocument();
  expect(screen.getByText("$19.99")).toBeInTheDocument();
  expect(screen.getByText(/test-category/i)).toBeInTheDocument();
  expect(screen.getByText(/a product used for testing/i)).toBeInTheDocument();
});

test("ProductCard calls onAdd with the product when user clicks Add to cart", async () => {
  const user = userEvent.setup();
  const onAdd = jest.fn();

  render(<ProductCard product={sampleProduct} onAdd={onAdd} />);

  await user.click(screen.getByRole("button", { name: /add to cart/i }));
  expect(onAdd).toHaveBeenCalledTimes(1);
  expect(onAdd).toHaveBeenCalledWith(sampleProduct);
});

test("ProductCard swaps to placeholder image if product image fails to load", () => {
  render(<ProductCard product={sampleProduct} onAdd={() => {}} />);

  const img = screen.getByRole("img", { name: /test product/i });
  fireEvent.error(img);

  expect(img).toHaveAttribute(
    "src",
    "https://via.placeholder.com/400x300?text=No+Image"
  );
});
