import React, { useContext, useEffect, useState } from "react";
import { ShopContext } from "./../context/ShopContext";
import ProductItem from "./ProductItem";
import Title from "./Title";

const LatestCollection = () => {
  const { products, loading, error, refreshProducts } = useContext(ShopContext);
  const [latestProducts, setLatestProducts] = useState([]);

  // useEffect là một Hook trong React, được dùng để chạy một đoạn code khi
  // component được render hoặc khi có sự thay đổi ở dependencies.
  // Thêm products vào dependency array để cập nhật khi products thay đổi
  useEffect(() => {
    // Hàm này lấy 10 sản phẩm đầu tiên từ products và lưu vào state latestProducts.
    //products.slice(0,10) tạo một mảng mới gồm 10 phần tử đầu tiên của products.
    if (products && products.length > 0) {
      setLatestProducts(products.slice(0, 10));
    }
  }, [products]);

  return (
    <div className="my-10">
      <div className="text-center py-8 text-3xl">
        <Title text1={"LATEST"} text2={"COLLECTION"}></Title>
        <p className="w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600">
        Discover our latest collection with exclusive and trendsetting designs.
        </p>
      </div>

      {/* Hiển thị trạng thái loading */}
      {loading && (
        <div className="text-center py-10">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
            <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải sản phẩm...</p>
        </div>
      )}

      {/* Hiển thị lỗi nếu có */}
      {error && !loading && (
        <div className="text-center py-10 text-red-500">
          <p className="mb-2">Có lỗi xảy ra khi tải sản phẩm:</p>
          <p>{error}</p>
          <button 
            onClick={refreshProducts}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* Rendering products */}
      {!loading && !error && latestProducts.length === 0 && (
        <div className="text-center py-10">
          <p>Không có sản phẩm nào trong bộ sưu tập mới nhất.</p>
        </div>
      )}

      {!loading && !error && latestProducts.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-col-3 md:grid-cols-4 lg:grid-cols-5 gap-4 gap-y-6">
          {latestProducts.map((item, index) => (
            <ProductItem 
              key={index} 
              id={item._id} 
              image={item.image} 
              name={item.name} 
              price={item.price} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default LatestCollection;
