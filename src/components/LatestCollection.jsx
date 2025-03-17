import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext";
import Title from "./Title";
import ProductItem from "./ProductItem";

const LatestCollection = () => {
  const { products } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  // useEffect là một Hook trong React, được dùng để chạy một đoạn code khi
  // component được render hoặc khi có sự thay đổi ở dependencies.
  // [] là dependency array (mảng phụ thuộc). Ở đây, nó rỗng ([]),
  // nghĩa là useEffect chỉ chạy
  // một lần duy nhất khi component được mount (lần đầu xuất hiện trên UI).
  useEffect(() => {
    // Hàm này lấy 10 sản phẩm đầu tiên từ products và lưu vào state latestProducts.
    //products.slice(0,10) tạo một mảng mới gồm 10 phần tử đầu tiên của products.
    setLatestProducts(products.slice(0, 10));
  }, []);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"}></Title>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </p>
      </div>

      {/* Rendering producs */}

      <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
        {
          latestProducts.map((item, index) =>(
            <ProductItem key ={index} id={item._id} image={item.image} name={item.name} price={item.price} />
          ))
        }
      </div>
    </div>
  );
};

export default LatestCollection;
