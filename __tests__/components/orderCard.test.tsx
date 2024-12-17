import { render, screen, fireEvent } from "@testing-library/react";
import OrderCard from "@/components/orderCard";
import { useUserOrderContext } from "@/context/UserOrderContext";
import { Order } from "@/type";
import axios from "axios";

// Mock axios
jest.mock("axios", () => ({
  patch: jest.fn(),
  delete: jest.fn(),
}));

// Mock context
jest.mock("@/context/UserOrderContext", () => ({
  useUserOrderContext: jest.fn(),
}));

describe("OrderCard Component", () => {
  const mockOrder: Order = {
    _id: "1",
    status: "Pending",
    totalPrice: 100000,
    items: [
      {
        product: {
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
        },
        quantity: 2,
      },
    ],
    customer: "",
    orderDate: new Date()
  };

  const mockSetRefresh = jest.fn();
  const mockSetShowMessage = jest.fn(); // Thêm mock function này

  beforeEach(() => {
    (useUserOrderContext as jest.Mock).mockReturnValue({
      setRefresh: mockSetRefresh,
    });
  });

  it("renders order information correctly", () => {
    render(
      <OrderCard 
        order={mockOrder} 
        setShowMessage={mockSetShowMessage} // Truyền mock function
      />
    );

    expect(screen.getByText("Product Test")).toBeInTheDocument();
    expect(screen.getByText("Tổng cộng: 100.000 đ")).toBeInTheDocument();
    expect(screen.getByText("Số lượng: 2 pcs")).toBeInTheDocument();
    expect(screen.getByText("Thanh toán")).toBeInTheDocument();
  });

  it("displays 'Đã thanh toán' when order status is not Pending", () => {
    const paidOrder = { ...mockOrder, status: "Paid" };
    render(
      <OrderCard 
        order={paidOrder} 
        setShowMessage={mockSetShowMessage} // Truyền mock function
      />
    );

    expect(screen.getByText("Đã thanh toán")).toBeInTheDocument();
  });
});
