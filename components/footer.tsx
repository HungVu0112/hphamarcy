import { faFacebook } from "@fortawesome/free-brands-svg-icons";
import { faEnvelope, faSquarePhone } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export default function Footer() {
    return (
        <footer className="w-full h-[300px] bg-blue-300 text-white p-10 flex items-center justify-evenly">
            <div className="w-[600px]">
                <h1 className="text-4xl font-semibold">H Phamarcy</h1>
                <p className="mt-4">Chào mừng bạn đến với H Phamarcy, nơi cung cấp các sản phẩm thuốc chất lượng cao và dịch vụ tư vấn tận tình. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm an toàn, hiệu quả và được chứng nhận bởi các cơ quan y tế. Với giao diện thân thiện và dễ sử dụng, H Phamarcy giúp bạn dễ dàng tìm kiếm và mua sắm các sản phẩm thuốc mọi lúc, mọi nơi. Hãy để chúng tôi đồng hành cùng bạn trong hành trình chăm sóc sức khỏe</p>
            </div>
            <div className="">
                <h1 className="text-3xl font-bold">Đường dẫn</h1>
                <div className="mt-4 flex flex-col gap-2">
                    <p className="hover:underline cursor-pointer">Trang chủ</p>
                    <p className="hover:underline cursor-pointer">Sản phẩm</p>
                    <p className="hover:underline cursor-pointer">Giỏ hàng</p>
                </div>
            </div>
            <div className="">
                <h1 className="text-3xl font-bold">Liên lạc</h1>
                <div className="flex gap-2 items-center mt-4">
                    <FontAwesomeIcon icon={faFacebook} className="text-lg"/>
                    <p>Facebook.com</p>
                </div>
                <div className="flex gap-2 items-center mt-2">
                    <FontAwesomeIcon icon={faEnvelope} className="text-lg"/>
                    <p>pcsolaggy123@gmail.com</p>
                </div>
                <div className="flex gap-2 items-center mt-2">
                    <FontAwesomeIcon icon={faSquarePhone} className="text-lg"/>
                    <p>0989123456</p>
                </div>
            </div>
        </footer>
    )
}