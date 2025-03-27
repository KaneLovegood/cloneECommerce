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
      console.log("Calling API with URL:", apiUrl);
      
      const response = await axios.get(apiUrl);
      console.log("Full response:", response);
      
      if (!response || !response.data) {
        console.error("Response has no data:", response);
        setError("No data received from server");
        toast.error("No data received from server");
        setProducts([]);
        return;
      }
      
      console.log("Data from API:", response.data);
      
      if (response.data.success === true) {
        if (Array.isArray(response.data.products)) {
          console.log("Product list:", response.data.products);
          
          const processedProducts = response.data.products.map(product => {
            if (!product) return null;
            
            const processedProduct = { ...product };
            
            // If no _id, use product name as ID
            if (!processedProduct._id) {
              processedProduct._id = processedProduct.name.toLowerCase().replace(/\s+/g, '-');
            }
            
            // Ensure image is an array
            if (!processedProduct.image) {
              processedProduct.image = [];
            } else if (!Array.isArray(processedProduct.image)) {
              processedProduct.image = [processedProduct.image];
            }
            
            // Ensure sizes is an array
            if (!processedProduct.sizes) {
              processedProduct.sizes = ["S", "M", "L", "XL"];
            } else if (!Array.isArray(processedProduct.sizes)) {
              processedProduct.sizes = [processedProduct.sizes];
            }
            
            return processedProduct;
          })
          .filter(product => product !== null);
          
          console.log("Processed product list:", processedProducts);
          setProducts(processedProducts);
        } else {
          console.error("products is not an array:", response.data.products);
          setError("Invalid product data");
          toast.error("Invalid product data");
          setProducts([]);
        }
      } else {
        console.error("API returned error:", response.data);
        setError(response.data.message || "Could not fetch product data");
        toast.error(response.data.message || "Could not fetch product data");
        setProducts([]);
      }
    } catch (error) {
      console.error("Error calling API:", error);
      
      if (error.response) {
        console.error("Response error:", error.response.data);
        console.error("Status code:", error.response.status);
        setError(`Server error: ${error.response.status} - ${error.response.data?.message || "Unknown error"}`);
      } else if (error.request) {
        console.error("No response received:", error.request);
        setError("Could not connect to server. Please check your connection.");
      } else {
        console.error("Error:", error.message);
        setError(`Error: ${error.message}`);
      }
      
      toast.error("Error connecting to server");
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }

  // Function to get real product ID from database when creating order
  const getRealProductId = async (productName) => {
    try {
      const response = await axios.get(`${backendUrl}/api/products/name/${productName}`);
      if (response.data.success && response.data.product) {
        return response.data.product._id;
      }
      throw new Error("Product not found");
    } catch (error) {
      console.error("Error getting product ID:", error);
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
      console.error("Invalid product ID:", itemId);
      toast.error('Invalid product ID');
      return;
    }
    
    if(!size){
      toast.error('Please select a size');
      return;
    }
    
    try {
      // Try to find product in current state
      let product = products.find(p => p._id === itemId);
      
      // If not found in state, call API to get product info
      if (!product) {
        console.log("Product not found in state, calling API...");
        const response = await axios.get(`${backendUrl}/api/products/${itemId}`);
        if (response.data.success && response.data.product) {
          product = response.data.product;
        } else {
          throw new Error("Product not found");
        }
      }
      
      console.log("Product found to add to cart:", product);
      
      let cartData = structuredClone(cartItems);
      const cartItemKey = itemId;
      
      if (!cartData[cartItemKey]) {
        cartData[cartItemKey] = {
          product: product,
          sizes: {}
        };
      }
      
      if (!cartData[cartItemKey].sizes[size]) {
        cartData[cartItemKey].sizes[size] = 0;
      }
      
      cartData[cartItemKey].sizes[size] += 1;
      
      console.log("Adding to cart:", cartItemKey, size, cartData);
      setCartItems(cartData);
      toast.success('Added to cart');
      
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error('Could not add product to cart');
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
      
      // Check if item exists
      if (!cartData[itemId]) {
        const product = products.find(p => p._id === itemId);
        if (!product) {
          throw new Error("Product not found");
        }
        cartData[itemId] = {
          product: product,
          sizes: {}
        };
      }
      
      // Check and update sizes
      if (!cartData[itemId].sizes) {
        cartData[itemId].sizes = {};
      }
      
      cartData[itemId].sizes[size] = quantity;
      setCartItems(cartData);
      
    } catch (error) {
      console.error("Error updating quantity:", error);
      toast.error("Could not update product quantity");
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
