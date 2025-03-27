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
        setProducts([]);
        return;
      }
      
      console.log("Dữ liệu từ API:", response.data);
      
      if (response.data.success === true) {
        if (Array.isArray(response.data.products)) {
          console.log("Danh sách sản phẩm:", response.data.products);
          
          const processedProducts = response.data.products.map(product => {
            if (!product) return null;
            
            const processedProduct = { ...product };
            
            // Nếu không có _id, sử dụng tên sản phẩm làm ID
            if (!processedProduct._id) {
              processedProduct._id = processedProduct.name.toLowerCase().replace(/\s+/g, '-');
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
          .filter(product => product !== null);
          
          console.log("Danh sách sản phẩm đã xử lý:", processedProducts);
          setProducts(processedProducts);
        } else {
          console.error("products không phải là mảng:", response.data.products);
          setError("Dữ liệu sản phẩm không hợp lệ");
          toast.error("Dữ liệu sản phẩm không hợp lệ");
          setProducts([]);
        }
      } else {
        console.error("API trả về lỗi:", response.data);
        setError(response.data.message || "Không thể lấy dữ liệu sản phẩm");
        toast.error(response.data.message || "Không thể lấy dữ liệu sản phẩm");
        setProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi gọi API:", error);
      
      if (error.response) {
        console.error("Lỗi phản hồi:", error.response.data);
        console.error("Mã trạng thái:", error.response.status);
        setError(`Lỗi server: ${error.response.status} - ${error.response.data?.message || "Lỗi không xác định"}`);
      } else if (error.request) {
        console.error("Không nhận được phản hồi:", error.request);
        setError("Không thể kết nối đến server. Vui lòng kiểm tra kết nối của bạn.");
      } else {
        console.error("Lỗi:", error.message);
        setError(`Lỗi: ${error.message}`);
      }
      
      toast.error("Lỗi kết nối đến server");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Hàm mới để lấy ID thực từ database khi tạo đơn hàng
  const getRealProductId = async (productName) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/name/${productName}`);
      if (response.data.success && response.data.product) {
        return response.data.product._id;
      }
      throw new Error("Không tìm thấy sản phẩm");
    } catch (error) {
      console.error("Lỗi khi lấy ID sản phẩm:", error);
      throw error;
    }
  }

  // useEffect để load sản phẩm và giỏ hàng ban đầu
  useEffect(() => {
    getProductsData();
  }, []); // Chỉ chạy 1 lần khi component mount

  // useEffect riêng để xử lý giỏ hàng khi products thay đổi
  useEffect(() => {
    if (products.length > 0) {
      // Tải giỏ hàng từ localStorage nếu có
      const savedCart = localStorage.getItem('cartItems');
      if (savedCart) {
        try {
          const parsedCart = JSON.parse(savedCart);
          
          // Chuyển đổi định dạng cũ sang định dạng mới
          const convertedCart = {};
          for (const [itemId, itemData] of Object.entries(parsedCart)) {
            // Kiểm tra xem itemData có phải là object với thuộc tính sizes không
            if (itemData && typeof itemData === 'object' && 'sizes' in itemData) {
              // Đã ở định dạng mới
              const product = products.find(p => p._id === itemId);
              if (product) {
                convertedCart[itemId] = {
                  ...itemData,
                  product: product // Cập nhật thông tin sản phẩm mới nhất
                };
              }
            } else {
              // Định dạng cũ
              const product = products.find(p => p._id === itemId);
              if (product) {
                convertedCart[itemId] = {
                  product: product,
                  sizes: {}
                };
                // Chuyển đổi size và số lượng
                for (const [size, quantity] of Object.entries(itemData)) {
                  if (quantity > 0) {
                    convertedCart[itemId].sizes[size] = quantity;
                  }
                }
              }
            }
          }
          
          // Chỉ cập nhật cartItems nếu có sự thay đổi
          const currentCartJSON = JSON.stringify(cartItems);
          const newCartJSON = JSON.stringify(convertedCart);
          if (currentCartJSON !== newCartJSON) {
            console.log("Giỏ hàng sau khi chuyển đổi:", convertedCart);
            setCartItems(convertedCart);
          }
        } catch (error) {
          console.error("Lỗi khi tải giỏ hàng:", error);
          // Xóa dữ liệu giỏ hàng không hợp lệ
          localStorage.removeItem('cartItems');
          setCartItems({});
        }
      }
    }
  }, [products]); // Chỉ chạy khi products thay đổi

  // useEffect để lưu giỏ hàng vào localStorage
  useEffect(() => {
    if (Object.keys(cartItems).length > 0) {
      localStorage.setItem('cartItems', JSON.stringify(cartItems));
      console.log("Đã lưu giỏ hàng vào localStorage:", cartItems);
    } else {
      localStorage.removeItem('cartItems');
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
    
    try {
      // Thử tìm sản phẩm trong state hiện tại
      let product = products.find(p => p._id === itemId);
      
      // Nếu không tìm thấy trong state, gọi API để lấy thông tin sản phẩm
      if (!product) {
        console.log("Không tìm thấy sản phẩm trong state, đang gọi API...");
        const response = await axios.get(`${backendUrl}/api/products/${itemId}`);
        if (response.data.success && response.data.product) {
          product = response.data.product;
        } else {
          throw new Error("Không tìm thấy sản phẩm");
        }
      }
      
      console.log("Sản phẩm tìm thấy để thêm vào giỏ hàng:", product);
      
      let cartData = structuredClone(cartItems);
      const cartItemKey = itemId;
      
      if (!cartData[cartItemKey]) {
        cartData[cartItemKey] = {
          product: product, // Lưu toàn bộ thông tin sản phẩm
          sizes: {}
        };
      }
      
      if (!cartData[cartItemKey].sizes[size]) {
        cartData[cartItemKey].sizes[size] = 0;
      }
      
      cartData[cartItemKey].sizes[size] += 1;
      
      console.log("Thêm vào giỏ hàng:", cartItemKey, size, cartData);
      setCartItems(cartData);
      toast.success('Đã thêm vào giỏ hàng');
      
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      toast.error('Không thể thêm sản phẩm vào giỏ hàng');
    }
  }

  const getCartCount = () => {
    let totalCount = 0;
    try {
      for(const itemKey in cartItems){
        const item = cartItems[itemKey];
        if (item && item.sizes) {
          for(const size in item.sizes){
            if(item.sizes[size] > 0){
              totalCount += item.sizes[size];
            }
          }
        }
      }
    } catch(error) {
      console.error('Lỗi khi tính số lượng giỏ hàng:', error);
    }
    return totalCount;
  }

  const updateQuantity = async(itemId, size, quantity) => {
    try {
      let cartData = structuredClone(cartItems);
      
      // Kiểm tra xem item có tồn tại không
      if (!cartData[itemId]) {
        const product = products.find(p => p._id === itemId);
        if (!product) {
          throw new Error("Không tìm thấy sản phẩm");
        }
        cartData[itemId] = {
          product: product,
          sizes: {}
        };
      }
      
      // Kiểm tra và cập nhật sizes
      if (!cartData[itemId].sizes) {
        cartData[itemId].sizes = {};
      }
      
      cartData[itemId].sizes[size] = quantity;
      setCartItems(cartData);
      
    } catch (error) {
      console.error("Lỗi khi cập nhật số lượng:", error);
      toast.error("Không thể cập nhật số lượng sản phẩm");
    }
  }

  const getCartAmount = async() => {
    let totalAmount = 0;
    try {
      for(const itemKey in cartItems){
        const item = cartItems[itemKey];
        if (item && item.product && item.sizes) {
          for(const size in item.sizes){
            if (item.sizes[size] > 0) {
              totalAmount += item.product.price * item.sizes[size];
            }
          }
        }
      }
    } catch (error) {
      console.error('Lỗi khi tính tổng tiền:', error);
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
    getRealProductId,
    navigate
  };
  
  return (
    <ShopContext.Provider value={value}>{props.children}</ShopContext.Provider>
  );
};

export default ShopContextProvider;
