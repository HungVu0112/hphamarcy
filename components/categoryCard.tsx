import { Category } from "@/type";
import { useRouter } from "next/navigation";

export default function CategoryCard({ category } : { category: Category }) {
    const router = useRouter();

    return (
        <div onClick={(()=>router.push(`/products/category/${category.id}`))} className="flex items-center gap-4 p-6 shadow-md rounded-md hover:scale-[1.03] duration-150 cursor-pointer bg-white">
            <img src={category.image} alt="" className="w-[60px]"/>
            <div className="">
                <h3 className="font-semibold">{category.name}</h3>
                <p className="text-gray-500 text-sm">{category.quantity} Sản phẩm</p>
            </div>
        </div>
    )
}