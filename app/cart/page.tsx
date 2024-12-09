'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import OrderCard from "@/components/orderCard";
import { useUserOrderContext } from "@/context/UserOrderContext";
import { Order, User } from "@/type";
import { faCartShopping } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function CartPage() {
    const userString = sessionStorage.getItem("user");
    const user: User = userString ? JSON.parse(userString) : {};
    const { orders } = useUserOrderContext();

    return (
        <main className="w-full">
            <title>Giỏ hàng</title>
            <Header user={user}/>
            <div className="w-full mt-[80px] bg-slate-200 min-h-[600px] flex justify-center">
                <div className="mt-10 w-[70%]">
                    <div className="flex gap-3 items-center">
                        <FontAwesomeIcon icon={faCartShopping} className="text-2xl"/>
                        <h1 className="text-3xl font-bold">Giỏ hàng</h1>
                    </div>
                    <p className="mt-2 text-slate-500 font-semibold">Tổng cộng:   {orders.length} đơn hàng</p>
                    <div className="mt-10 flex flex-col gap-6">
                        {orders.length == 0 ?
                            <p className="text-center text-slate-500 font-bold text-lg">Hiện chưa có đơn hàng nào !</p>
                            :
                            <>
                                {orders.map((order: Order) => {
                                    return <OrderCard key={order._id} order={order}/>
                                })}
                            </>
                        }
                    </div>    
                </div>
            </div>
            <Footer/>
        </main>
    )
}