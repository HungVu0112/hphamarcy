import { render, screen } from "@testing-library/react";
import CategoryCard from "@/components/categoryCard";
import { Category } from "@/type";
import { useRouter } from "next/navigation";

jest.mock("next/navigation", () => ({
  useRouter: jest.fn(),
}));

describe("CategoryCard Component", () => {
  const mockCategory: Category = {
    id: 1,
    name: "Test Category",
    quantity: 5,
    image: "test-image.jpg",
  };

  it("renders category name and quantity", () => {
    render(<CategoryCard category={mockCategory} />);
    
    expect(screen.getByText("Test Category")).toBeInTheDocument();

    expect(screen.getByText("5 Sản phẩm")).toBeInTheDocument();
  });

  it("navigates on click", () => {
    const pushMock = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push: pushMock });

    render(<CategoryCard category={mockCategory} />);
    screen.getByText("Test Category").click();

    expect(pushMock).toHaveBeenCalledWith("/products/category/1");
  });
});
