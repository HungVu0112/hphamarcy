import { useUserOrderContext } from "@/context/UserOrderContext";
import { Order } from "@/type";
import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";

export default function OrderCard({ order } : { order: Order }) {
    const { setRefresh } = useUserOrderContext();

    const handlePurchase = async() => {
        try {
            const res = await axios.patch(
                `${process.env.NEXT_PUBLIC_API_HEAD}/order/purchase/${order._id}`
            )

            if (res.status == 200) {
                setRefresh(n=>n+1);
            }
        } catch (error) {
            console.error(error);   
        }
    }

    const handleDeleteOrder = async() => {
        try {
            const res = await axios.delete(
                `${process.env.NEXT_PUBLIC_API_HEAD}/order/${order._id}`
            )            
            
            if (res.status == 200) {
                setRefresh(n=>n+1);
            }
        } catch (error) {
            console.error(error);
        }
    }

    const formatNumber = (num: number | undefined) => {
        if (num === undefined) return;
        return num.toLocaleString('vi-VN');
    }

    return (
        <div className="w-full p-4 bg-white shadow-lg rounded-lg items-center justify-between flex">
            <div className="flex gap-4 items-center">
                <img src={order.items[0].product.image} alt="Image" className="w-[80px]"/>
                <div className="w-[70%]">
                    <h3 className="overflow-hidden text-ellipsis text-nowrap text-lg font-semibold">{order.items[0].product.name}</h3>
                    <div className="flex gap-6 mt-1">
                        <p className="text-sm font-semibold text-slate-500">Tổng cộng: {formatNumber(order.totalPrice)} đ</p>
                        <p className="text-sm font-semibold text-slate-500">Số lượng: {order.items[0].quantity} {order.items[0].product.unit}</p>
                    </div>
                </div>
            </div>
            <div className="flex gap-6">
                {order.status == "Pending" ? 
                    <div onClick={handlePurchase} className="w-[120px] rounded-lg p-4 h-[40px] flex items-center justify-center hover:scale-[1.03] cursor-pointer duration-150 bg-blue-500 text-white">
                        <p>Thanh toán</p>
                    </div>
                    :
                    <div className="w-[150px] rounded-lg p-4 h-[40px] flex items-center justify-center bg-green-500 text-white">
                        <p>Đã thanh toán</p>
                    </div>
                }
                <div onClick={handleDeleteOrder} className="w-[40px] h-[40px] rounded-lg flex items-center justify-center text-white bg-red-500 hover:scale-[1.03] cursor-pointer duration-150">
                    <FontAwesomeIcon icon={faTrash} />
                </div>
            </div>
        </div>
    )
}