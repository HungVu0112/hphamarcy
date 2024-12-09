import { render, screen } from "@testing-library/react";
import Footer from "@/components/footer";

describe("Footer Component", () => {

  it("renders footer correctly", () => {
    render(<Footer />);

    expect(screen.getByText("H Phamarcy")).toBeInTheDocument();
    
    expect(screen.getByText(/Chào mừng bạn đến với H Phamarcy/)).toBeInTheDocument();
    
    expect(screen.getByText("Trang chủ")).toBeInTheDocument();
    expect(screen.getByText("Sản phẩm")).toBeInTheDocument();
    expect(screen.getByText("Giỏ hàng")).toBeInTheDocument();

    expect(screen.getByText("Facebook.com")).toBeInTheDocument();
    expect(screen.getByText("pcsolaggy123@gmail.com")).toBeInTheDocument();
    expect(screen.getByText("0989123456")).toBeInTheDocument();
  });

});
