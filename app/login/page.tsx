'use client'

import { useState } from "react"
import Link from "next/link";
import { loginValid } from "../../validation";
import axios from "axios";
import { useRouter } from "next/navigation";
import { User } from "@/type";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { faLock } from "@fortawesome/free-solid-svg-icons/faLock";
import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons/faCircleExclamation";

export default function Login() {
    const router = useRouter();
    const [showPass, setShowPass] = useState<boolean>(false);
    const [data, setData] = useState<{
        email: string,
        password: string,
    }>({
        email: '',
        password: '',
    });
    const [error, setError] = useState<{
        email: string,
        password: string,
    }>({
        email: '',
        password: '',
    });
    const [edited, setEdited] = useState<boolean>(false);

    const handleChange = (e: any) => {
        if (!edited) {
            setEdited(true);
        } else {
            setError(loginValid(data));
        }
        setData({...data, [e.target.name]: e.target.value });
    }

    const handleSubmit = async() => {
        if (data.email != "" && data.password != "") {
            try {
               const res = await axios.post(
                `${process.env.NEXT_PUBLIC_API_HEAD}/user/login`,
                {
                    email: data.email,
                    password: data.password,
                  },
               )

               if (res.status == 200) {
                const user: User = res.data.user;
                sessionStorage.setItem("user", JSON.stringify(user));
                sessionStorage.setItem("token", res.data.token);
                router.push('/');
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
            <title>Login</title>
            <div className="w-[80%] h-[80%] rounded-lg shadow-2xl bg-white flex p-6">
                <div className="relative flex-1 ">
                    <img src="/lg-3.png" alt="" className="absolute w-[40%] top-3 left-6"/>                    
                    <img src="/lg-5.png" alt="" className="absolute w-[60%] bottom-0 right-4"/>                    
                </div>
                <div className="flex-1 flex flex-col items-center">
                    <h1 className="text-[48px] font-bold mt-6">Đăng nhập</h1>
                    <div className="mt-12 w-full flex flex-col items-center">
                        <div className="w-[70%]">
                            <label htmlFor="email" className="">Email</label>
                            <div className={`w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.email && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faEnvelope} className="text-red-400 text-lg"/>
                                <input id="email" name="email" onChange={handleChange} type="email" placeholder="Nhập email của bạn" className="w-[80%] outline-none" autoComplete="nope" required />
                            </div>
                            {error.email && <div className="flex gap-2 mt-2">
                                <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                <p className="text-sm text-red-400">{error.email}</p>
                            </div>}
                        </div>

                        <div className="w-[70%] mt-6">
                            <label htmlFor="password" className="">Mật khẩu</label>
                            <div className={`relative w-full h-[60px] mt-2 rounded-md flex items-center border border-slate-200 p-4 gap-3 focus-within:border-black ${error.password && "border-red-400"}`}>
                                <FontAwesomeIcon icon={faLock} className="text-lg"/>
                                <input id="password" name="password" onChange={handleChange} type={showPass ? "text" : "password"} placeholder="Nhập mật khẩu của bạn" className="w-[80%] outline-none" autoComplete="new-password" required/>
                                {!showPass ? 
                                    <i onClick={()=>setShowPass(!showPass)} className="fa-solid fa-eye text-lg absolute right-4 cursor-pointer"></i>
                                    :
                                    <i onClick={()=>setShowPass(!showPass)} className="fa-solid fa-eye-slash text-lg absolute right-4 cursor-pointer"></i>
                                }
                            </div>
                            {error.password && <div className="flex gap-2 mt-2">
                                <FontAwesomeIcon icon={faCircleExclamation} className="text-red-400 text-sm"/>
                                <p className="text-sm text-red-400">{error.password}</p>
                            </div>}
                        </div>

                        <button onClick={handleSubmit} className="w-[70%] mt-12 bg-gray-700 rounded-lg h-[60px] text-white hover:scale-[1.02] duration-150">
                            Đăng nhập
                        </button>
                        <p className="text-gray-400 mt-4">Bạn chưa có tài khoản ? <Link href="/signup" className="font-semibold hover:underline duration-100">Đăng ký</Link></p>      
                    </div>
                </div>
            </div>
        </main>
    )
}