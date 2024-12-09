'use client'

import { Product } from "@/type";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface ProductListContextType {
    products: Product[],
    productCategory1: Product[],
    productCategory2: Product[],
    productCategory3: Product[],
    productCategory4: Product[],
    productCategory5: Product[],
    productCategory6: Product[],
    setProducts: React.Dispatch<React.SetStateAction<Product[]>>,
    setRenew:React.Dispatch<React.SetStateAction<number>>
}

const ProductListContext = createContext<ProductListContextType | undefined>(undefined);

export const useProductListContext = () => {
    const context = useContext(ProductListContext);
    if(!context) {
        throw new Error('useChatroomContext must be used within a ProductListProvider');
    }
    return context;
}

export const ProductListProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
}>) => {
    const [products, setProducts] = useState<Product[]>([]);
    const [renew, setRenew] = useState<number>(0);
    const [productCategory1, setCategory1] = useState<Product[]>([]);
    const [productCategory2, setCategory2] = useState<Product[]>([]);
    const [productCategory3, setCategory3] = useState<Product[]>([]);
    const [productCategory4, setCategory4] = useState<Product[]>([]);
    const [productCategory5, setCategory5] = useState<Product[]>([]);
    const [productCategory6, setCategory6] = useState<Product[]>([]);

    useEffect(() => {
        const getProducts = async() => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_HEAD}/product`
                )

                if (res.status == 201) {
                    const allProducts = res.data;

                    // Set all products
                    setProducts(allProducts);
          
                    // Filter and set products for each category
                    setCategory1(allProducts.filter((product: Product) => product.category === "Miếng dán, cao xoa, dầu"));
                    setCategory2(allProducts.filter((product: Product) => product.category === "Thuốc giảm đau, hạ sốt, kháng viêm"));
                    setCategory3(allProducts.filter((product: Product) => product.category === "Thuốc Mắt, Tai, Mũi, Họng"));
                    setCategory4(allProducts.filter((product: Product) => product.category === "Thuốc hô hấp"));
                    setCategory5(allProducts.filter((product: Product) => product.category === "Thuốc tiêu hoá & gan mật"));
                    setCategory6(allProducts.filter((product: Product) => product.category === "Thuốc thông dụng"));
                }
            } catch (error) {
                console.error(error);
            }
        }   
        getProducts();
    }, [renew])

    return (
        <ProductListContext.Provider value={{ products, setProducts, setRenew, productCategory1, productCategory2, productCategory3, productCategory4, productCategory5, productCategory6 }}>
            {children}
        </ProductListContext.Provider>
    )
}