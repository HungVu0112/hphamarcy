import { Product } from "@/type";
import { useRouter } from "next/navigation";

export default function ProductSearchCard({ product } : { product: Product }) {
    const router = useRouter();

    const handleClick = () => {
        router.push(`/products/${product._id}`);
    }

    return (
        <div onClick={handleClick} className="w-[99%] p-4 rounded-md hover:bg-slate-100 cursor-pointer duration-150 flex items-center gap-2">
            <img src={product.image} alt="Image" className="w-[60px]"/>
            <div className="w-[70%]">
                <p className="text-sm font-semibold overflow-hidden text-ellipsis text-nowrap">{product.name}</p>
            </div>
        </div>
    )
}