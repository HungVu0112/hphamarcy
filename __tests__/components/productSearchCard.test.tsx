import { render, screen } from "@testing-library/react";
import ProductSearchCard from "@/components/productSearchCard";
import { Product } from "@/type";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProductSearchCard Component", () => {
  const mockProduct: Product = {
    _id: "1",
    name: "Test Product",
    description: "A test product",
    price: 10000,
    quantity: 10,
    category: "Category 1",
    image: "test-image.jpg",
    ingredients: "Test ingredients",
    factory: "Test factory",
    country: "Test country",
    unit: "Test unit",
  };

  it("renders product name", () => {
    render(<ProductSearchCard product={mockProduct} />);
    expect(screen.getByText("Test Product")).toBeInTheDocument();
  });

  it("navigates on click", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<ProductSearchCard product={mockProduct} />);
    screen.getByText("Test Product").click();

    expect(pushMock).toHaveBeenCalledWith("/products/1");
  });
});
