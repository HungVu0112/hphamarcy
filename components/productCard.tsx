import { Product } from "@/type";
import { useRouter } from "next/navigation";

export default function ProductCard({ product } : { product: Product }) {
    const router = useRouter();
    const formatNumber = (num: number) => {
        return num.toLocaleString('vi-VN');
    }

    const handleClick = () => {
        router.push(`/products/${product._id}`);
    }

    return (
        <div onClick={handleClick} className="p-4 rounded-xl shadow-xl cursor-pointer hover:scale-[1.02] duration-150 bg-white">
            <img src={product.image} alt="Image" className="w-full"/>
            <div className="mt-6">
                <h3 className="font-semibold line-clamp-2">{product.name}</h3>
                <p className="text-blue-500 mt-2 text-base">{formatNumber(product.price)} / {product.unit}</p>
            </div>
            <button className="w-full p-2 bg-blue-600 mt-4 text-white rounded-full">
                Chọn mua
            </button>
        </div>
    )
}