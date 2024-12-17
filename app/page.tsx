'use client'

import Footer from "@/components/footer";
import Header from "@/components/header";
import ProductCard from "@/components/productCard";
import ToastMessage from "@/components/toastMessage";
import { ProductCategories } from "@/constants";
import { useProductListContext } from "@/context/ProductListContext";
import { Category, Product, User } from "@/type";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();
  const userString = sessionStorage.getItem("user");
  const user: User = userString ? JSON.parse(userString) : {};
  const { productCategory2, productCategory3 } = useProductListContext();

  return (
    <main className="w-full">
      <title>H Phamarcy</title>
      <Header user={user}/>
      <div className="h-[600px] w-full bg-slate-200 mt-[80px] flex items-center justify-between py-10 px-32">
        <div className="w-[600px] break-words">
          <h1 className="text-[64px] font-semibold text-blue-500">H Phamarcy</h1>
          <p className="mt-4">Chào mừng bạn đến với H Phamarcy, nơi cung cấp các sản phẩm thuốc chất lượng cao và dịch vụ tư vấn tận tình. Chúng tôi cam kết mang đến cho khách hàng những sản phẩm an toàn, hiệu quả và được chứng nhận bởi các cơ quan y tế. Với giao diện thân thiện và dễ sử dụng, H Phamarcy giúp bạn dễ dàng tìm kiếm và mua sắm các sản phẩm thuốc mọi lúc, mọi nơi. Hãy để chúng tôi đồng hành cùng bạn trong hành trình chăm sóc sức khỏe </p>
        </div>
        <img src="/doc.jpeg" alt="Image" className="w-[600px] rounded-xl shadow-lg"/>
      </div>

      <div className="w-full flex gap-24 justify-center mt-12">
        {ProductCategories.map((category: Category) => {
          return <div key={category.name} className="w-[140px] h-[160px] flex flex-col justify-center items-center gap-4">
              <div onClick={(()=>router.push(`/products/category/${category.id}`))} className="w-[100px] h-[100px] rounded-full shadow-lg overflow-hidden border border-slate-200 hover:scale-[1.2] duration-150 hover:border-[3px] hover:border-blue-500 cursor-pointer">
                  <img src={category.image} alt="Image" className="w-full h-full object-cover"/>
              </div>
              <p className="w-full overflow-hidden text-ellipsis text-nowrap text-center text-sm font-bold">{category.name}</p>
          </div>
        })}
      </div>

      <div className="w-full flex flex-col items-center">
        <div className="w-[70%] mt-20">
          <div className="flex gap-4 items-center">
            <img src={ProductCategories[1].image} alt="Image" className="w-[60px] rounded-md shadow-lg" />
            <h1 onClick={()=>router.push('/products/category/2')} className="text-[24px] font-semibold hover:underline cursor-pointer underline-offset-2">{ProductCategories[1].name}</h1>
          </div>
          <div className="mt-10 grid grid-cols-4 grid-flow-row gap- w-full gap-4 mb-12">
            {productCategory2.slice(2).map((product: Product) => {
              return <ProductCard key={product.name} product={product} />
            })}
          </div>
        </div>

        <div className="w-[70%] mt-20">
          <div className="flex gap-4 items-center">
            <img src={ProductCategories[2].image} alt="Image" className="w-[60px] rounded-md shadow-lg" />
            <h1 onClick={()=>router.push('/products/category/3')} className="text-[24px] font-semibold hover:underline cursor-pointer underline-offset-2">{ProductCategories[2].name}</h1>
          </div>
          <div className="mt-10 grid grid-cols-4 grid-flow-row gap- w-full gap-4 mb-12">
            {productCategory3.slice(2).map((product: Product) => {
              return <ProductCard key={product.name} product={product} />
            })}
          </div>
        </div>
      </div>

      <div className="w-full h-[500px] flex items-center justify-center gap-[200px] p-6">
        <div className="w-[400px] break-words">
          <h2 className="font-bold text-3xl">Chất lượng vượt trội</h2>
          <p className="mt-4 text-lg">Sản phẩm của chúng tôi được sản xuất với công nghệ tiên tiến, đảm bảo chất lượng vượt trội và an toàn cho sức khỏe người tiêu dùng.</p>
        </div>
        <img src="/lg-1.png" alt="" className="w-[400px] rounded-md shadow-lg"/>
      </div>

      <div className="w-full h-[500px] flex items-center justify-center gap-[200px] p-6">
        <img src="/lg-2.png" alt="" className="w-[400px] rounded-md shadow-lg"/>
        <div className="w-[400px] break-words">
          <h2 className="font-bold text-3xl">Kiểm định nghiêm ngặt</h2>
          <p className="mt-4 text-lg">Mỗi lô hàng đều trải qua quy trình kiểm định chất lượng nghiêm ngặt, đảm bảo đáp ứng các tiêu chuẩn cao nhất trong ngành.</p>
        </div>
      </div>

      <div className="w-full h-[500px] flex items-center justify-center gap-[200px] p-6">
        <div className="w-[400px] break-words">
          <h2 className="font-bold text-3xl">Nguyên liệu tự nhiên</h2>
          <p className="mt-4 text-lg">Chúng tôi cam kết sử dụng nguyên liệu tự nhiên, không chứa hóa chất độc hại, mang lại hiệu quả tối ưu cho người sử dụng.</p>
        </div>
        <img src="/lg-3.png" alt="" className="w-[400px] rounded-md shadow-lg"/>
      </div>

      <div className="w-full h-[500px] flex items-center justify-center gap-[200px] p-6">
        <img src="/lg-4.png" alt="" className="w-[400px] rounded-md shadow-lg"/>
        <div className="w-[400px] break-words">
          <h2 className="font-bold text-3xl">Phản hồi từ khách hàng</h2>
          <p className="mt-4 text-lg">Chúng tôi tự hào nhận được những phản hồi tích cực từ hàng triệu khách hàng, chứng minh cho chất lượng và sự tin cậy của sản phẩm.</p>
        </div>
      </div>
      <Footer />
    </main>
  );
}
