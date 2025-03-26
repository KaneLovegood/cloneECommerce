import axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const { currency, getCartAmount, delivery_fee, cartItems, products } = useContext(ShopContext);
  const [cartAmount, setCartAmount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    country: '',
    cardNumber: '',
    cardName: '',
    expiryDate: '',
    cvv: ''
  });

  useEffect(() => {
    const fetchCartAmount = async () => {
      try {
        const amount = await getCartAmount();
        setCartAmount(amount);
      } catch (error) {
        console.error("Lỗi khi tính tổng giỏ hàng:", error);
        setCartAmount(0);
      }
    };
    
    fetchCartAmount();
  }, [getCartAmount]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Kiểm tra form
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'country', 'cardNumber', 'cardName', 'expiryDate', 'cvv'];
    const emptyFields = requiredFields.filter(field => !formData[field]);
    
    if (emptyFields.length > 0) {
      toast.error('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    // Kiểm tra giỏ hàng
    if (Object.keys(cartItems).length === 0) {
      toast.error('Giỏ hàng trống');
      return;
    }
    
    // Xử lý thanh toán
    setLoading(true);
    
    try {
      // Lấy token từ localStorage
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Vui lòng đăng nhập để đặt hàng');
        return;
      }

      // Chuẩn bị dữ liệu đơn hàng
      const orderProducts = [];
      
      // Xử lý từng sản phẩm trong giỏ hàng
      for (const [productId, sizes] of Object.entries(cartItems)) {
        const product = products.find(p => p._id === productId || p.id === productId);
        if (!product) {
          throw new Error(`Không tìm thấy sản phẩm với ID: ${productId}`);
        }

        // Xử lý từng size của sản phẩm
        for (const [size, quantity] of Object.entries(sizes)) {
          if (quantity > 0) {
            orderProducts.push({
              productId: product._id, // Đảm bảo sử dụng _id từ sản phẩm
              name: product.name,
              quantity: Number(quantity), // Đảm bảo quantity là số
              price: Number(product.price), // Đảm bảo price là số
              size: size,
              image: product.image[0]
            });
          }
        }
      }

      if (orderProducts.length === 0) {
        throw new Error('Không có sản phẩm nào trong giỏ hàng');
      }

      const orderData = {
        products: orderProducts,
        address: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.postalCode || '',
          country: formData.country,
          pincode: formData.postalCode || ''
        },
        paymentMethod: 'Stripe',
        totalAmount: Number(cartAmount + delivery_fee)
      };

      console.log('Dữ liệu đơn hàng:', orderData);

      // Gọi API tạo đơn hàng với token
      const response = await axios.post('http://localhost:4001/api/order', orderData, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.data.success) {
        // Xóa giỏ hàng
        localStorage.setItem('cartItems', JSON.stringify({}));
        
        // Hiển thị modal thành công
        setShowSuccessModal(true);
        
        // Reload trang sau 3 giây
        setTimeout(() => {
          window.location.href = '/';
        }, 3000);
      } else {
        toast.error('Có lỗi xảy ra khi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      toast.error(error.response?.data?.error || error.message || 'Có lỗi xảy ra khi tạo đơn hàng');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white py-8">
      <div className="max-w-6xl mx-auto px-4">
        <h1 className="text-3xl font-semibold text-gray-800 mb-8 text-center">Complete your order now!</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form thanh toán */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">Payment information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Full name <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="fullName" 
                      value={formData.fullName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email <span className="text-red-500">*</span></label>
                    <input 
                      type="email" 
                      name="email" 
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Phone number <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone" 
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="address" 
                      value={formData.address}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">City<span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="city" 
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Postal Code</label>
                    <input 
                      type="text" 
                      name="postalCode" 
                      value={formData.postalCode}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nation <span className="text-red-500">*</span></label>
                    <select 
                      name="country" 
                      value={formData.country}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    >
                      <option value="">Choose your nation</option>
                      <option value="Vietnam">Việt Nam</option>
                      <option value="US">United State</option>
                      <option value="UK">United Kingdome</option>
                      <option value="Japan">Japan</option>
                      <option value="Korea">Korea</option>
                    </select>
                  </div>
                </div>
                
                <h3 className="text-lg font-medium text-gray-800 mb-4 mt-8">Card</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card number <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="cardNumber" 
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Card owner <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="cardName" 
                      value={formData.cardName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Valid date <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="expiryDate" 
                      value={formData.expiryDate}
                      onChange={handleInputChange}
                      placeholder="MM/YY"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">CVV <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="cvv" 
                      value={formData.cvv}
                      onChange={handleInputChange}
                      placeholder="123"
                      className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                      maxLength="4"
                      required
                    />
                  </div>
                </div>
                
                <button 
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white font-medium py-3 px-4 rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 disabled:opacity-70 disabled:cursor-not-allowed"
                  disabled={loading}
                >
                  {loading ? 'Đang xử lý...' : 'Thanh toán ngay'}
                </button>
              </form>
            </div>
          </div>
          
          {/* Tổng đơn hàng */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 sticky top-6">
              <h2 className="text-xl font-medium text-gray-800 mb-6">Your order</h2>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>provisional</span>
                  <span>{currency}{cartAmount}.00</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Delivery fee</span>
                  <span>{currency}{delivery_fee}.00</span>
                </div>
                
                <div className="border-t border-gray-200 pt-4 mt-4">
                  <div className="flex justify-between font-medium text-gray-900">
                    <span>Total</span>
                    <span>{currency}{cartAmount + delivery_fee}.00</span>
                  </div>
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex items-center text-sm text-gray-600">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Free delivery fee {currency}100
                </div>
              </div>
              
              <div className="text-sm text-gray-500">
                <p>To continue, you have to agree with <a href="#" className="text-purple-600 hover:underline">điều khoản dịch vụ</a> và <a href="#" className="text-purple-600 hover:underline">chính sách bảo mật</a> của chúng tôi.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal thành công */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-8 max-w-md w-full">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              
              <h3 className="text-xl font-medium text-gray-900 mb-2">All done!</h3>
              <p className="text-gray-600 mb-6">Thank you. Your order will be delivered as soon as possible..</p>
              
              <p className="text-sm text-gray-500">Redirecting to home page...</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
