import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";


export const ShopContext = createContext();

const ShopContextProvider = (props) => {
  const currency = "$";
  const delivery_fee = 10;
  const backendUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:4001";
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

const getProductsData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const apiUrl = `${backendUrl}/api/product/list`;
    console.log("Đang gọi API với URL:", apiUrl);
    
    const response = await axios.get(apiUrl);
    console.log("Response đầy đủ:", response);
    
    if (!response || !response.data) {
      console.error("Phản hồi không có dữ liệu:", response);
      setError("Không nhận được dữ liệu từ server");
      toast.error("Không nhận được dữ liệu từ server");
      return;
    }
    
    console.log("Dữ liệu từ API:", response.data);
    
    if (response.data.success === true) {
      if (Array.isArray(response.data.products)) {
        console.log("Danh sách sản phẩm:", response.data.products);
        setProducts(response.data.products);
      } else {
        console.error("products không phải là mảng:", response.data.products);
        setError("Dữ liệu sản phẩm không hợp lệ");
        toast.error("Dữ liệu sản phẩm không hợp lệ");
      }
    } else {
      console.error("API trả về lỗi:", response.data);
      setError(response.data.message || "Không thể lấy dữ liệu sản phẩm");
      toast.error(response.data.message || "Không thể lấy dữ liệu sản phẩm");
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    
    if (error.response) {
      // Lỗi từ server với mã status
      console.error("Lỗi phản hồi:", error.response.data);
      console.error("Mã trạng thái:", error.response.status);
      setError(`Lỗi server: ${error.response.status} - ${error.response.data.message || "Lỗi không xác định"}`);
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      console.error("Không nhận được phản hồi:", error.request);
      setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối của bạn.");
    } else {
      // Lỗi khi thiết lập yêu cầu
      console.error("Lỗi:", error.message);
      setError(`Lỗi: ${error.message}`);
    }
    
    toast.error(error.message || "Lỗi kết nối đến server");
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  getProductsData();
}, []);

  const value = {
    products,
    currency,
    delivery_fee,
    search, 
    setSearch,
    showSearch,
    setShowSearch, 
    backendUrl,
    loading,
    error,
    refreshProducts: getProductsData
  };
  
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
