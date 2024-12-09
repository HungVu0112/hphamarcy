import { useProductListContext } from "@/context/ProductListContext";
import { useUserOrderContext } from "@/context/UserOrderContext";
import { Product, User } from "@/type";
import { faCapsules, faCartShopping, faMagnifyingGlass, faRightFromBracket } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import ProductSearchCard from "./productSearchCard";

export default function Header({ user } : { user: User}) {
    const router = useRouter();
    const pathname = usePathname();
    const homeRef = useRef<HTMLDivElement>(null);
    const productRef = useRef<HTMLDivElement>(null);
    const qaRef = useRef<HTMLDivElement>(null);
    const { orders } = useUserOrderContext();
    const [searchText, setSearchText] = useState<string>("");
    const { products } = useProductListContext();
    const [searchResult, setSearchResult] = useState<Product[]>([]);

    const handleLogout = () => {
        sessionStorage.removeItem("user");
        router.push("/login");
    }

    useEffect(() => {
        if (searchText != "") {
            const searchTextLower = searchText.toLowerCase().trim();
            
            const filteredProducts = products.filter(product => 
                product.name.toLowerCase().includes(searchTextLower)
            );
    
            setSearchResult(filteredProducts);
        }
    }, [searchText, products]);


    useEffect(() => {
        homeRef.current?.classList.remove("active");
        productRef.current?.classList.remove("active");
        qaRef.current?.classList.remove("active");

        switch (pathname) {
            case "/":
                homeRef.current?.classList.add("active");
                break;
            case "/products":
                productRef.current?.classList.add("active");
                break;
            case "/qa":
                qaRef.current?.classList.add("active");
                break;
        }
    }, [pathname])
    
    return (
        <header className="fixed top-0 left-0 h-[80px] w-full shadow-lg flex items-center justify-between px-4 bg-white z-[100]">
            <div className="flex gap-2">
                <FontAwesomeIcon icon={faCapsules} className="text-lg text-blue-500" />
                <h2 className="font-bold">H Phamarcy</h2>
            </div>

            <div className="relative w-[400px] h-[40px] rounded-full bg-slate-200 flex items-center gap-2 px-4">
                <FontAwesomeIcon icon={faMagnifyingGlass} className="text-sm"/>
                <input type="text" value={searchText} onChange={(e)=>setSearchText(e.target.value)} placeholder="Tìm kiếm thuốc ..." className="outline-none bg-slate-200 w-[85%]"/>
                {searchText != "" &&
                    <div className="absolute top-[50px] w-[600px] -right-[100px] p-6 rounded-lg border border-slate-200 shadow-xl z-[110] bg-white">
                        <h3 className="text-lg font-bold text-slate-600">Kết quả</h3>
                        <div className="mt-6 max-h-[400px] overflow-y-scroll custom-scrollbar">
                            {searchResult.length == 0 ?
                                <p className="text-sm text-center text-gray-500 font-semibold">Không tìm được loại thuốc mong muốn !</p>
                                :
                                <>
                                    {searchResult.map((product: Product) => {
                                        return <ProductSearchCard key={product._id} product={product}/>
                                    })}
                                </>
                            }
                        </div>
                    </div>
                }
            </div>

            <div className="flex items-center">
                <div onClick={()=>router.push("/")} ref={homeRef} className="w-[100px] h-[80px] flex items-center justify-center hover:bg-slate-200 duration-150 cursor-pointer active">
                    <p className={`${pathname === "/" && "text-blue-500"}`}>Trang chủ</p>
                </div>

                <div onClick={()=>router.push("/products")} ref={productRef} className="w-[100px] h-[80px] flex items-center justify-center hover:bg-slate-200 duration-150 cursor-pointer">
                    <p className={`${pathname === "/products" && "text-blue-500"}`}>Sản phẩm</p>
                </div>

                <div onClick={()=>router.push("/qa")} ref={qaRef} className="w-[100px] h-[80px] flex items-center justify-center hover:bg-slate-200 duration-150 cursor-pointer">
                    <p className={`${pathname === "/qa" && "text-blue-500"}`}>Hỗ trợ</p>
                </div>

                <div className="relative">
                    <FontAwesomeIcon onClick={()=>router.push("/cart")} icon={faCartShopping} className="ml-4 text-lg hover:scale-[1.05] duration-150 cursor-pointer text-blue-500"/>
                    <div className="absolute -top-3 -right-3 w-[20px] h-[20px] rounded-full bg-red-400 text-white flex items-center justify-center">
                        <p className="text-[12px]">{orders.length}</p>
                    </div>
                </div>
                
                <div className="flex gap-2 items-center">
                    <p className="ml-6 font-bold">{user.username}</p>
                    <FontAwesomeIcon onClick={handleLogout} icon={faRightFromBracket} className="text-lg hover:scale-[1.03] cursor-pointer duration-150"/>
                </div>
            </div>
        </header>
    )
}