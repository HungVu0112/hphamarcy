'use client'

import { useState } from "react"
import Link from "next/link";
import { signupValid } from "../../validation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";
import { faEnvelope, faSignsPost, faUser } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faPhoneVolume } from "@fortawesome/free-solid-svg-icons/faPhoneVolume";

export default function Login() {
    const router = useRouter();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [data, setData] = useState<{
        username: string,
        email: string,
        password: string,
        phoneNumber: number | null,
        address: string,
    }>({
        username: '',
        email: '',
        password: '',
        phoneNumber: null,
        address: '',
    });
    const [error, setError] = useState<{
        username: string,
        email: string,
        password: string,
        phoneNumber: string,
        address: string,
    }>({
        username: '',
        email: '',
        password: '',
        phoneNumber: '',
        address: '',
    });

    const handleChange = (e: any) => {
        setData({...data, [e.target.name]: e.target.value });
        setError(signupValid(data));
    }

    const handleSubmit = async() => {
        if (data.email != "" && data.password != "" && data.username != "" && data.address != "" && data.phoneNumber != null) {
            try {
               const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_HEAD}/user/register`,
                {
                    username: data.username,
                    email: data.email,
                    password: data.password,
                    phone: data.phoneNumber,
                    address: data.address,
                  },
               )

               if (res.status == 201) {
                const user = res.data.user;
                sessionStorage.setItem('user', JSON.stringify(user));
                router.push('/login');
               } else {
                alert(res.data.message);
               }
            } catch (error) {
                console.error(error);
            }
        }
    }

    return (
        <main className="w-full h-[100vh] flex items-center justify-center bg-slate-200">
            <title>Signup</title>
            <div className="w-[85%] h-[85%] rounded-lg shadow-2xl bg-white flex p-6">
                <div className="relative flex-1 ">
                    <img src="/lg-2.png" alt="" className="absolute w-[40%] top-3 right-6"/>                    
                    <img src="/lg-1.png" alt="" className="absolute w-[60%] bottom-0 left-6"/>                    
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-[48px] font-bold">Đăng ký</h1>
                    <div className="mt-2 w-full flex flex-col items-center">
                        <div className="w-[70%]">
                            <div className="flex gap-2 items-center">
                                <label htmlFor="username" className="">Họ và tên</label>
                                {error.username && <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                    <p className="text-sm text-red-400">{error.username}</p>
                                </div>}
                            </div>
                            <div className={`w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.username && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faUser} className="text-lg text-orange-400"/>
                                <input id="username" type="text" name="username" onChange={handleChange} placeholder="Nhập họ và tên của bạn" className="w-[80%] outline-none" required />
                            </div>
                        </div>

                        <div className="w-[70%] mt-4">
                            <div className="flex gap-2 items-center">
                                <label htmlFor="email" className="">Email</label>
                                {error.email && <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                    <p className="text-sm text-red-400">{error.email}</p>
                                </div>}
                            </div>
                            <div className={`w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.email && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faEnvelope} className="text-red-400 text-lg"/>
                                <input id="email" type="email" placeholder="Nhập email của bạn" name="email" onChange={handleChange} className="w-[80%] outline-none" autoComplete="nope" required/>
                            </div>
                        </div>

                        <div className="w-[70%] mt-4">
                            <div className="flex gap-2 items-center">
                                <label htmlFor="password" className="">Mật khẩu</label>
                                {error.password && <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                    <p className="text-sm text-red-400">{error.password}</p>
                                </div>}
                            </div>
                            <div className={`relative w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.password && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faLock} className="text-lg"/>
                                <input id="password" type={showPass ? "text" : "password"} name="password" onChange={handleChange} placeholder="Nhập mật khẩu của bạn" className="w-[80%] outline-none"  autoComplete="new-password" required/>
                                {!showPass ? 
                                    <i onClick={()=>setShowPass(!showPass)} className="fa-solid fa-eye text-lg absolute right-4 cursor-pointer"></i>
                                    :
                                    <i onClick={()=>setShowPass(!showPass)} className="fa-solid fa-eye-slash text-lg absolute right-4 cursor-pointer"></i>
                                }
                            </div>
                        </div>

                        <div className="w-[70%] mt-4">
                            <div className="flex gap-2 items-center">
                                <label htmlFor="phonenumber" className="">Số điện thoại</label>
                                {error.phoneNumber && <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                    <p className="text-sm text-red-400">{error.phoneNumber}</p>
                                </div>}
                            </div>
                            <div className={`w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.phoneNumber && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faPhoneVolume} className="text-lg text-green-400"/>
                                <input id="phonenumber" type="number" name="phoneNumber" onChange={handleChange} placeholder="Nhập số điện thoại của bạn" className="w-[80%] outline-none phone" required />
                            </div>
                        </div>

                        <div className="w-[70%] mt-4">
                            <div className="flex gap-2 items-center">
                                <label htmlFor="address" className="">Địa chị</label>
                                {error.address && <div className="flex gap-2 items-center">
                                    <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                    <p className="text-sm text-red-400">{error.address}</p>
                                </div>}
                            </div>
                            <div className={`w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.address && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faSignsPost} className="text-lg text-blue-500"/>
                                <input id="address" type="text" name="address" onChange={handleChange} placeholder="Nhập địa chỉ của bạn" className="w-[80%] outline-none" required />
                            </div>
                        </div>

                        <button onClick={handleSubmit} className="w-[70%] mt-6 bg-gray-700 rounded-lg h-[60px] text-white hover:scale-[1.02] duration-150">
                            Đăng ký
                        </button>
                        <p className="text-gray-400 mt-4">Bạn đã có tài khoản ? <Link href="/login" className="font-semibold hover:underline duration-100">Đăng nhập</Link></p>      
                    </div>
                </div>
            </div>
        </main>
    )
}