'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCard from "@/components/productCard";
import { ProductCategories } from "@/constants";
import { useProductListContext } from "@/context/ProductListContext";
import { Product, User } from "@/type";

export default function CategoryPage({ params } : { params: { categoryId: string } }) {
    const { productCategory1, productCategory2, productCategory3, productCategory4, productCategory5, productCategory6 } = useProductListContext();
    const { categoryId } = params;
    var productList: Product[] = [];
    switch (categoryId) {
        case "1":
            productList = [...productCategory1];
            break;
        case "2":
            productList = [...productCategory2];
            break;
        case "3":
            productList = [...productCategory3];
            break;
        case "4":
            productList = [...productCategory4];
            break;
        case "5":
            productList = [...productCategory5];
        case "6":
            productList = [...productCategory6];
            break;
    }
    const userString = sessionStorage.getItem("user");
    const user: User = userString ? JSON.parse(userString) : {};
    
    return (
        <main className="w-full">
            <title>{ProductCategories[Number(categoryId) - 1].name}</title>
            <Header user={user}/>
            <div className="w-full mt-[80px] bg-slate-200 min-h-[800px] flex justify-center p-6">
                <div className="w-[70%] mt-12">
                    <div className="flex gap-4 items-center">
                        <img src={ProductCategories[Number(categoryId) - 1].image} alt="Image" className="w-[60px] rounded-md shadow-lg"/>
                        <h1 className="text-[24px] font-semibold">{ProductCategories[Number(categoryId) - 1].name}</h1>
                    </div>
                    <div className="mt-10 grid grid-cols-5 grid-flow-row gap- w-full gap-4 mb-12">
                        {productList.map((product: Product) => {
                            return <ProductCard key={product.name} product={product}/>
                        })}
                    </div>
                </div>
            </div>
            <Footer/>
        </main>
    )
}