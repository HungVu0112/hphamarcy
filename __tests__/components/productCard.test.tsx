import { render, screen, fireEvent } from "@testing-library/react";
import ProductCard from "@/components/productCard";
import { Product } from "@/type";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("ProductCard Component", () => {
    const mockProduct: Product = {
        _id: "1",
        description: "test description",
        price: 50000,
        quantity: 100,
        category: "test category",
        ingredients: "test ingredients",
        factory: "test factory",
        country: "test country",
        name: "Product Test",
        image: "test-image.jpg",
        unit: "pcs",
    };

  const mockPush = jest.fn();

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
  });

  it("renders product information correctly", () => {
    render(<ProductCard product={mockProduct} />);

    expect(screen.getByText("Product Test")).toBeInTheDocument();
    expect(screen.getByText("50.000 / pcs")).toBeInTheDocument();
    expect(screen.getByAltText("Image")).toHaveAttribute("src", mockProduct.image);
    expect(screen.getByText("Chọn mua")).toBeInTheDocument();
  });

  it("navigates to product page when clicked", () => {
    render(<ProductCard product={mockProduct} />);

    fireEvent.click(screen.getByRole("button"));
    
    expect(mockPush).toHaveBeenCalledWith(`/products/${mockProduct._id}`);
  });
});
