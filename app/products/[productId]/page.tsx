'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCard from "@/components/productCard";
import ToastMessage from "@/components/toastMessage";
import { useProductListContext } from "@/context/ProductListContext";
import { useUserOrderContext } from "@/context/UserOrderContext";
import { Product, User } from "@/type"
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useEffect, useState } from "react"

export default function ProductDetailPage({ params } : { params: { productId: string } }) {
    const { productCategory1, productCategory2, productCategory3, productCategory4, productCategory5, productCategory6 } = useProductListContext();
    const userString = sessionStorage.getItem("user");
    const user: User = userString ? JSON.parse(userString) : {};
    const { setRefresh } = useUserOrderContext();
    const { productId } = params;
    const [product, setProduct] = useState<Product>();
    const [quantity, setQuantity] = useState<number>(1);
    const [isFetching, setIsFetching] = useState<boolean>(false);
    const [similarProduct, setSimilarProduct] = useState<Product[]>([]);
    const [showMessage, setShowMessage] = useState<boolean>(false);

    const formatNumber = (num: number | undefined) => {
        if (num === undefined) return;
        return num.toLocaleString('vi-VN');
    }

    const handleAddToCart = async() => {
        try {
            setIsFetching(true);
            const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_HEAD}/order`,
                {
                    customer: user.id,
                    items: {
                        product: product?._id,
                        quantity: quantity
                    },
                    totalPrice: product?.price && product.price * quantity
                }
            )

            if (res.status == 201) {
                setIsFetching(false);
                setRefresh(n=>n+1);
                setShowMessage(true);
                setTimeout(() => {
                    setShowMessage(false);
                }, 1500)
            }
        } catch (error) {
            console.error(error);
        }
    }

    useEffect(() => {
        const getProduct = async() => {
            try {
                const res = await axios.get(
                    `${process.env.NEXT_PUBLIC_API_HEAD}/product/${productId}`
                )
                if (res.status == 200) {
                    const fetchedProduct = res.data;
                    setProduct(fetchedProduct);
    
                    let categoryProducts: Product[] = [];
                    switch(fetchedProduct.category) {
                        case "Miếng dán, cao xoa, dầu":
                            categoryProducts = productCategory1;
                            break;
                        case "Thuốc giảm đau, hạ sốt, kháng viêm":
                            categoryProducts = productCategory2;
                            break;
                        case "Thuốc Mắt, Tai, Mũi, Họng":
                            categoryProducts = productCategory3;
                            break;
                        case "Thuốc hô hấp":
                            categoryProducts = productCategory4;
                            break;
                        case "Thuốc tiêu hóa & gan mật":
                            categoryProducts = productCategory5;
                            break;
                        case "Thuốc thông dụng":
                            categoryProducts = productCategory6.slice(0,6);
                            break;
                        default:
                            categoryProducts = [];
                    }
    
                    const similarProductsList = categoryProducts.filter(
                        (p: Product) => p._id !== fetchedProduct._id
                    );
                    
                    setSimilarProduct(similarProductsList);
                }
            } catch (error) {
                console.error(error);
            }
        }
        getProduct();
    },[productId, productCategory1, productCategory2, productCategory3, productCategory4, productCategory5, productCategory6])

    return (
        <main className="w-full">
            <title>{product ? product.name : "H Phamarcy"}</title>
            <Header user={user}/>
            <div className="w-full mt-[80px] bg-slate-200 min-h-[100vh] flex flex-col justify-center items-center">
                <div className="w-[80%] min-h-[90%] bg-white rounded-lg flex items-center gap-14 p-10 shadow-xl mt-10">
                    <img src={product?.image} alt="" className="w-[40%] rounded-lg"/>
                    <div className="w-[50%]">
                        <div className="flex font-semibold gap-1">
                            <p className="">Thương hiệu:</p>
                            <p className="text-blue-500">{product?.factory}</p>
                        </div>
                        <h1 className="break-words text-2xl font-bold">{product?.name}</h1>
                        <div className="flex gap-1 text-blue-500 items-end">
                            <h3 className="text-3xl font-bold  mt-6">{formatNumber(product?.price)} đ</h3>
                            <h3 className="text-xl"> / {product?.unit}</h3>
                        </div>
                        <div className="mt-10 w-full flex flex-col gap-8">
                            <div className="flex gap-2">
                                <div className="w-[150px] text-slate-500 font-semibold">
                                    <p>Thành phần</p>
                                </div>
                                <div className="w-[80%] break-words">
                                    <p>{product?.ingredients}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="w-[150px] text-slate-500 font-semibold">
                                    <p>Nhà sản xuất</p>
                                </div>
                                <div className="w-[80%] break-words">
                                    <p>{product?.factory}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="w-[150px] text-slate-500 font-semibold">
                                    <p>Nước sản xuất</p>
                                </div>
                                <div className="w-[80%] break-words">
                                    <p>{product?.country}</p>
                                </div>
                            </div>

                            <div className="flex gap-2">
                                <div className="w-[150px] text-slate-500 font-semibold">
                                    <p>Mô tả</p>
                                </div>
                                <div className="w-[80%] break-words">
                                    <p>{product?.description}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex gap-2 items-center mt-8">
                            <div className="w-[150px]">
                                <p className="text-slate-500 font-semibold">Chọn số lượng</p>
                            </div>
                            <input type="number" value={quantity} onChange={(e)=>{
                                const value = Number(e.target.value);
                                if (value > 0) {
                                  setQuantity(value);
                                }
                            }} className="w-[80px] h-[40px] p-4 border border-slate-200 rounded-md"/>
                        </div>

                        <div className="flex gap-2 items-center mt-8">
                            <div className="w-[150px]">
                                <p className="text-slate-500 font-semibold">Tổng tiền</p>
                            </div>
                            <p className="text-2xl font-bold text-blue-500">{product?.price && formatNumber(product.price * quantity)} đ</p>
                        </div>

                        <div onClick={product?.quantity == 0 ? ()=>{} : isFetching ? ()=>{} : handleAddToCart} className={`mt-10 w-[300px] p-4 flex items-center justify-center gap-2 rounded-lg ${product?.quantity == 0 ? "bg-slate-500" : "bg-red-400"} ${product?.quantity != 0 && !isFetching && "cursor-pointer hover:scale-[1.03] duration-150"} text-white `}>
                            <p>{product?.quantity != 0 ? "Thêm vào giỏ hàng" : "Hiện đang hết hàng"}</p>
                            <FontAwesomeIcon icon={faCartShopping} className=""/>
                        </div>
                    </div>
                </div>

                <div className="w-[80%] mt-20">
                    <h1 className="text-2xl font-bold">Các sản phẩm tương tự</h1>
                    <div className="mb-10 grid w-full grid-cols-5 gap-4 grid-flow-row mt-8">
                        {similarProduct?.map((product: Product) => {
                            return <ProductCard product={product}/>
                        })}
                    </div>
                </div>
            </div>
            <Footer />
            {showMessage && <ToastMessage message="Tạo đơn hàng thành công !"/>}
        </main>
    )
}