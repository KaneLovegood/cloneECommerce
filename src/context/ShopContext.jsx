import axios from "axios";
import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
  const [cartItems, setCartItems] = useState({});
  const navigate = useNavigate();

const getProductsData = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const apiUrl = `${backendUrl}/api/products/list`;
    console.log("Đang gọi API với URL:", apiUrl);
    
    const response = await axios.get(apiUrl);
    console.log("Response đầy đủ:", response);
    
    if (!response || !response.data) {
      console.error("Phản hồi không có dữ liệu:", response);
      setError("Không nhận được dữ liệu từ server");
      toast.error("Không nhận được dữ liệu từ server");
      setProducts([]);  // Đặt mảng rỗng để tránh lỗi
      return;
    }
    
    console.log("Dữ liệu từ API:", response.data);
    
    // Nếu API trả về thành công
    if (response.data.success === true) {
      // Kiểm tra xem products có phải là mảng không
      if (Array.isArray(response.data.products)) {
        console.log("Danh sách sản phẩm:", response.data.products);
        
        // Đảm bảo mỗi sản phẩm có thuộc tính _id
        const processedProducts = response.data.products.map(product => {
          if (!product) return null;
          
          // Bỏ qua các sản phẩm null/undefined
          const processedProduct = { ...product };
          
          // Nếu không có _id, sử dụng id
          if (!processedProduct._id && processedProduct.id) {
            processedProduct._id = processedProduct.id;
          }
          
          // Nếu không có id, tạo một id ngẫu nhiên
          if (!processedProduct._id) {
            processedProduct._id = "product-" + Math.random().toString(36).substr(2, 9);
          }
          
          // Đảm bảo có thuộc tính image là mảng
          if (!processedProduct.image) {
            processedProduct.image = [];
          } else if (!Array.isArray(processedProduct.image)) {
            processedProduct.image = [processedProduct.image];
          }
          
          // Đảm bảo có thuộc tính sizes là mảng
          if (!processedProduct.sizes) {
            processedProduct.sizes = ["S", "M", "L", "XL"];
          } else if (!Array.isArray(processedProduct.sizes)) {
            processedProduct.sizes = [processedProduct.sizes];
          }
          
          return processedProduct;
        })
        .filter(product => product !== null); // Loại bỏ sản phẩm null
        
        console.log("Danh sách sản phẩm đã xử lý:", processedProducts);
        setProducts(processedProducts);
      } else {
        console.error("products không phải là mảng:", response.data.products);
        setError("Dữ liệu sản phẩm không hợp lệ");
        toast.error("Dữ liệu sản phẩm không hợp lệ");
        setProducts([]);  // Đặt mảng rỗng để tránh lỗi
      }
    } else {
      console.error("API trả về lỗi:", response.data);
      setError(response.data.message || "Không thể lấy dữ liệu sản phẩm");
      toast.error(response.data.message || "Không thể lấy dữ liệu sản phẩm");
      setProducts([]);  // Đặt mảng rỗng để tránh lỗi
    }
  } catch (error) {
    console.error("Lỗi khi gọi API:", error);
    
    if (error.response) {
      // Lỗi từ server với mã status
      console.error("Lỗi phản hồi:", error.response.data);
      console.error("Mã trạng thái:", error.response.status);
      setError(`Lỗi server: ${error.response.status} - ${error.response.data?.message || "Lỗi không xác định"}`);
    } else if (error.request) {
      // Yêu cầu được gửi nhưng không nhận được phản hồi
      console.error("Không nhận được phản hồi:", error.request);
      setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối của bạn.");
    } else {
      // Lỗi khi thiết lập yêu cầu
      console.error("Lỗi:", error.message);
      setError(`Lỗi: ${error.message}`);
    }
    
    toast.error("Lỗi kết nối đến server");
    setProducts([]);  // Đặt mảng rỗng để tránh lỗi
  } finally {
    setLoading(false);
  }
}

useEffect(() => {
  getProductsData();
  
  // Tải giỏ hàng từ localStorage nếu có
  const savedCart = localStorage.getItem('cartItems');
  if (savedCart) {
    try {
      setCartItems(JSON.parse(savedCart));
      console.log("Đã tải giỏ hàng từ localStorage:", JSON.parse(savedCart));
    } catch (error) {
      console.error("Lỗi khi tải giỏ hàng:", error);
    }
  }
}, []);

// Lưu giỏ hàng vào localStorage mỗi khi nó thay đổi
useEffect(() => {
  if (Object.keys(cartItems).length > 0) {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    console.log("Đã lưu giỏ hàng vào localStorage:", cartItems);
  }
}, [cartItems]);

const addToCart = async(itemId, size) => {
  if(!itemId) {
    console.error("ID sản phẩm không hợp lệ:", itemId);
    toast.error('ID sản phẩm không hợp lệ');
    return;
  }
  
  if(!size){
    toast.error('Vui lòng chọn kích thước');
    return;
  }
  
  // Kiểm tra sản phẩm tồn tại trong danh sách sản phẩm
  const product = products.find(p => p._id === itemId);
  if (!product) {
    console.error("Không tìm thấy sản phẩm với ID:", itemId);
    toast.error('Không tìm thấy sản phẩm');
    return;
  }
  
  console.log("Sản phẩm tìm thấy để thêm vào giỏ hàng:", product);
  
  let cartData = structuredClone(cartItems);
  if(cartData[itemId]){
    if(cartData[itemId][size]){
      cartData[itemId][size] += 1;
    }else{  
      cartData[itemId][size] = 1;
    }
  }
  else{
    cartData[itemId] = {};   
    cartData[itemId][size] = 1;
  }
  
  console.log("Thêm vào giỏ hàng:", itemId, size, cartData);
  setCartItems(cartData);
  toast.success('Đã thêm vào giỏ hàng');
}

const getCartCount = () => {
  let totalCount = 0;
  for(const items in cartItems){
      for(const item in cartItems[items]){
          try{
              if(cartItems[items][item]>0){
                  totalCount += cartItems[items][item];
              }
          }catch(error){
              console.error('Error calculating cart count:', error);
          }
      }
  }
  return totalCount;
}

const updateQuantity = async(itemId, size, quantity) => {
  let cartData = structuredClone(cartItems);
  cartData[itemId][size] = quantity;
  setCartItems(cartData);
}

const getCartAmount = async() => {
  let totalAmount = 0;
  for(const items in cartItems){
      let itemInfo = products.find((product)=>product._id === items);
      if (!itemInfo) continue;
      for(const item in cartItems[items]){
          try{
              if (cartItems[items][item]>0) {
                  totalAmount += itemInfo.price * cartItems[items][item];
              }
          } catch (error) {
              console.error('Error calculating cart amount:', error);
          }
      }
  }
  return totalAmount;
}

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
    refreshProducts: getProductsData,
    cartItems,
    addToCart,
    getCartCount,
    updateQuantity,
    getCartAmount,
    navigate
  };
  
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
