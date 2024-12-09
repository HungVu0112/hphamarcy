'use client'

import Header from "@/components/header";
import { useProductListContext } from "@/context/ProductListContext";
import { Product, User } from "@/type";
import { faPaperPlane, faUserDoctor } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface MesType {
    content: string,
    author: string,
    product?: {
        image: string,
        name: string,
        id: string
    }
}

export default function QAPage() {
    const { products } = useProductListContext();
    const userString = sessionStorage.getItem("user");
    const user: User = userString ? JSON.parse(userString) : {};
    const router = useRouter();
    const [mes, setMes] = useState<MesType>({
        content: "",
        author: "",
    });
    const [mesList, setMesList] = useState<MesType[]>([]);

    const handleSendMes = async() => {
        if (mes.content != "") {
            try {
                const res = await axios.post(
                    `${process.env.NEXT_PUBLIC_AI_API}`,
                    {
                        input: mes.content
                    }
                )
                if (res.data) {
                    var guide: string = res.data.predicted_disease != "" ? "Bạn đã bị " + res.data.predicted_disease + ". Bạn nên mua các loại thuốc có thành phần " + res.data.recommended_medicine +". Chúc bạn sớm khỏe mạnh!" 
                                                                            : "Không có thông tin về bệnh tình dựa theo triệu chứng của bạn. Hãy tham khảo ý kiến từ bác sĩ để đảm bảo cho sức khỏe của bạn.";
                    
                    var product: {
                        image: string,
                        name: string,
                        id: string
                    } = {
                        image: "",
                        name: "",
                        id: ""
                    }

                    if (res.data.recommended_medicine) {
                        console.log(products);
                        
                        const recommendedProduct = products.find((product: Product) =>
                            product.ingredients.toLowerCase().includes(res.data.recommended_medicine.toLowerCase())
                        );
                        console.log(recommendedProduct);
                        
                        product.id = recommendedProduct?._id ? recommendedProduct?._id : "";
                        product.name = recommendedProduct?._id? recommendedProduct.name : "";
                        product.image = recommendedProduct?._id? recommendedProduct.image : "";
                        guide += " Bạn có thể tham khảo sản phẩm dưới đây:"
                    }
                    const chatList: MesType[] = [...mesList];
                    chatList.push(mes);
                    chatList.push({
                        content: guide,
                        author: "doctor",
                        product: product
                    })
                    setMes({
                        content: "",
                        author: ""
                    })
                    setMesList(chatList);
                }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <main className="w-full flex justify-center bg-slate-200 min-h-[100vh]">
            <title>Hỗ trợ</title>
            <Header user={user}/>
            <div className="w-[50%] h-[800px] bg-white rounded-lg overflow-hidden shadow-xl mt-[110px]">
                <div className="flex gap-2 items-center h-[100px] justify-center">
                    <FontAwesomeIcon icon={faUserDoctor} className="text-xl text-slate-500"/>
                    <p className="text-slate-500 font-bold text-lg">Xin chào, bạn có thể hỏi tôi về bất kì triệu chứng nào bạn đang gặp phải ...</p>
                </div>
                <div className="h-[620px] w-full flex flex-col overflow-y-scroll custom-scrollbar gap-4 p-4">
                    {mesList.map((chat: MesType, index: number) => {
                        if (chat.author != "doctor") {
                            return (
                                <div key={index} className="w-full flex justify-end">
                                    <div className="max-w-[50%] p-3 rounded-full bg-blue-500 text-white flex items-center justify-center break-words text-sm">
                                        <p>{chat.content}</p>
                                    </div>
                                </div>
                            )
                        }
                        return (
                            <div key={index}>
                                <div className="w-full flex justify-start gap-3">
                                    <div className="w-[30px] h-[30px] rounded-full bg-blue-500 text-white flex items-center justify-center">
                                        <FontAwesomeIcon icon={faUserDoctor} className=""/>
                                    </div>
                                    <div className="max-w-[50%] p-4 rounded-xl bg-slate-200 text-slate-600 flex items-center justify-center break-words text-sm">
                                        <p>{chat.content}</p>
                                    </div>
                                </div>
                                {chat.product?.id != "" && 
                                    <div className="w-[50%] rounded-lg overflow-hidden ml-[42px] shadow-xl mt-4 border border-slate-200">
                                       <img src={chat.product?.image} alt="Image" className="w-full"/>
                                       <div className="w-full bg-slate-200 text-slate-600 h-[40px] flex items-center justify-center p-6">
                                            <p onClick={()=>router.push(`/products/${chat.product?.id}`)} className="overflow-hidden text-ellipsis text-nowrap hover:underline cursor-pointer">{chat.product?.name}</p>
                                       </div>
                                    </div>
                                }
                            </div>
                        )
                    })}
                </div>
                <div className="h-[80px] w-full bg-slate-300 flex items-center justify-center px-4 gap-6">
                    <div className="relative w-[85%] h-[40px] rounded-full bg-white flex items-center gap-2 px-4">
                        <input type="text" value={mes.content} onChange={(e) => setMes({
                            content: e.target.value,
                            author: user.username,
                        })} placeholder="Triệu chứng của bạn ..." className="outline-none bg-white w-full" />
                    </div>
                    <FontAwesomeIcon onClick={handleSendMes} icon={faPaperPlane} className="text-3xl text-blue-500 cursor-pointer hover:scale-[1.03] duration-150"/>
                </div>
            </div>
        </main>
    )
}