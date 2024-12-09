'use client'

import { Order } from "@/type";
import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";

interface UserOrderContextType {
    orders: Order[],
    setOrders: React.Dispatch<React.SetStateAction<Order[]>>,
    setRefresh:React.Dispatch<React.SetStateAction<number>>
}

const UserOrderContext = createContext<UserOrderContextType | undefined>(undefined);

export const useUserOrderContext = () => {
    const context = useContext(UserOrderContext);
    if(!context) {
        throw new Error('useChatroomContext must be used within a UserOrderProvider');
    }
    return context;
}

export const UserOrderProvider = ({
    children,
  }: Readonly<{
    children: React.ReactNode;
}>) => {
    const userString = sessionStorage.getItem("user");
    const user = userString ? JSON.parse(userString) : {};
    const [orders, setOrders] = useState<Order[]>([]);
    const [refresh, setRefresh] = useState<number>(0);

    useEffect(() => {
        if (user.id) {
            const getOrders = async() => {
                try {
                    const res = await axios.get(
                        `${process.env.NEXT_PUBLIC_API_HEAD}/order/user/${user.id}`
                    )
    
                    if (res.status == 200) {
                        setOrders(res.data);
                    }
                } catch (error) {
                    console.error(error);
                }
            }   
            getOrders();
        }
    }, [refresh])

    return (
        <UserOrderContext.Provider value={{ orders, setOrders, setRefresh }}>
            {children}
        </UserOrderContext.Provider>
    )
}