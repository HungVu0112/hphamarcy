'use client'

import { useProductListContext } from "@/context/ProductListContext";
import { Product } from "@/type";
import { faBox } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function WareHouse() {
    const { products } = useProductListContext();

    return (
        <main className="w-full">
            <title>Kho hàng</title>
            <header className="fixed top-0 left-0 h-[80px] w-full shadow-lg flex items-center px-4 bg-white z-[100] gap-2">
                <div className="w-[15px]">
                    <FontAwesomeIcon icon={faBox} className="text-lg text-blue-500" />
                </div>
                <h2 className="font-bold">Kho hàng</h2>
            </header>
            <div className="w-full flex justify-center mt-[80px] p-10">
                <div className="w-[70%]">
                    <div className="p-6 w-[30%] rounded-lg bg-slate-400 text-white flex items-center justify-center shadow-xl">
                        <h1 className="text-xl font-semibold">Tổng {products.length} sản phẩm</h1>
                    </div>
                    <div className="flex flex-col gap-4 mt-8">
                        {products.map((product: Product) => {
                            return <div key={product._id} className="w-full flex justify-between items-center border border-slate-200 rounded-lg p-6 shadow-xl">
                                <div className="flex gap-6 items-center">
                                    <img src={product.image} alt="Image" className="w-[100px] rounded-md"/>
                                    <p className="w-[600px] overflow-hidden text-ellipsis text-nowrap">{product.name}</p>
                                </div>
                                <div className="flex gap-2">
                                    <FontAwesomeIcon icon={faBox} className="text-lg text-slate-400"/>
                                    <div className="w-[150px]">
                                        <p className="text-sm text-slate-400 font-semibold">{product.quantity} sản phẩm</p>
                                    </div>
                                </div>
                            </div>
                        })}
                    </div>
                </div>
            </div>
        </main>
    )
}