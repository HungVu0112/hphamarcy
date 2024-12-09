'use client'

import CategoryCard from "@/components/categoryCard";
import Footer from "@/components/footer";
import Header from "@/components/header";
import { ProductCategories } from "@/constants";
import { Category, User } from "@/type";

export default function ProductPage() {
    const userString = sessionStorage.getItem("user");
    const user: User = userString ? JSON.parse(userString) : {};

    return (
        <main className="w-full">
            <title>Danh sách sản phẩm</title>
            <Header user={user}/>
            <div className="h-[600px] mt-[80px] bg-slate-200 flex flex-col items-center">
                <div className="w-[70%] mt-10">
                    <h1 className="text-[32px] font-bold">Thuốc theo nhóm trị liệu</h1>
                    <div className="mt-10 grid grid-cols-3 grid-flow-row gap-4 w-full">
                        {ProductCategories.map((category: Category, index: number) => {
                            return <CategoryCard key={index} category={category}/>
                        })}
                    </div>
                </div>
            </div>
            <Footer />
        </main>
    )
}