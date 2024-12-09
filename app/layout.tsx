import { ProductListProvider } from "@/context/ProductListContext";
import "./globals.css";
import { UserOrderProvider } from "@/context/UserOrderContext";
import Script from "next/script";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ProductListProvider>
          <UserOrderProvider>
            {children}
          </UserOrderProvider>
        </ProductListProvider>
      </body>
    </html>
  );
}
