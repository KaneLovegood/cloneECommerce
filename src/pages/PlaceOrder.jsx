import axios from 'axios';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { ShopContext } from '../context/ShopContext';

const PlaceOrder = () => {
  const { currency, getCartAmount, delivery_fee, cartItems, backendUrl } = useContext(ShopContext);
  const [cartAmount, setCartAmount] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
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
    const requiredFields = ['fullName', 'email', 'phone', 'address', 'city', 'state', 'country', 'cardNumber', 'cardName', 'expiryDate', 'cvv'];
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
      for (const [productId, itemData] of Object.entries(cartItems)) {
        if (!itemData || !itemData.product || !itemData.sizes) {
          console.error("Dữ liệu sản phẩm không hợp lệ:", productId, itemData);
          continue;
        }

        const product = itemData.product;
        
        // Xử lý từng size của sản phẩm
        for (const [size, quantity] of Object.entries(itemData.sizes)) {
          if (quantity > 0) {
            orderProducts.push({
              productId: product._id,
              name: product.name,
              quantity: Number(quantity),
              price: Number(product.price),
              size: size,
              image: product.image[0]
            });
          }
        }
      }

      if (orderProducts.length === 0) {
        throw new Error('Không có sản phẩm nào trong giỏ hàng');
      }

      // Tạo đơn hàng theo cấu trúc API yêu cầu
      const orderData = {
        products: orderProducts,
        address: {
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          pincode: formData.postalCode || '000000',
          country: formData.country
        },
        paymentMethod: 'COD',
        totalAmount: cartAmount + delivery_fee
      };

      console.log("Dữ liệu đơn hàng gửi đi:", orderData);

      // Gọi API tạo đơn hàng
      const response = await axios.post(
        `${backendUrl}/api/order/create`,
        orderData,
        {
          headers: {
            token: token,
            'Content-Type': 'application/json'
          }
        }
      );

      console.log("Phản hồi từ server:", response.data);

      if (response.data.success) {
        // Xóa giỏ hàng sau khi đặt hàng thành công
        localStorage.removeItem('cartItems');
        setShowSuccessModal(true);
        toast.success('Đặt hàng thành công!');
      } else {
        throw new Error(response.data.message || 'Lỗi khi tạo đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi xử lý đơn hàng:', error);
      toast.error(error.response?.data?.message || error.message || 'Không thể tạo đơn hàng. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Thông tin đặt hàng</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Thông tin cá nhân */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="fullName"
              placeholder="Họ và tên *"
              value={formData.fullName}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="email"
              name="email"
              placeholder="Email *"
              value={formData.email}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="tel"
              name="phone"
              placeholder="Số điện thoại *"
              value={formData.phone}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
          </div>
        </div>

        {/* Địa chỉ giao hàng */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Địa chỉ giao hàng</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="address"
              placeholder="Địa chỉ *"
              value={formData.address}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <input
                type="text"
                name="city"
                placeholder="Thành phố *"
                value={formData.city}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="state"
                placeholder="Tỉnh/Thành phố *"
                value={formData.state}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="postalCode"
                placeholder="Mã bưu điện *"
                value={formData.postalCode}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="country"
                placeholder="Quốc gia *"
                value={formData.country}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Thông tin thanh toán */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Thông tin thanh toán</h2>
          <div className="grid grid-cols-1 gap-4">
            <input
              type="text"
              name="cardNumber"
              placeholder="Số thẻ *"
              value={formData.cardNumber}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <input
              type="text"
              name="cardName"
              placeholder="Tên chủ thẻ *"
              value={formData.cardName}
              onChange={handleInputChange}
              className="border p-2 rounded"
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="expiryDate"
                placeholder="Ngày hết hạn (MM/YY) *"
                value={formData.expiryDate}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="cvv"
                placeholder="CVV *"
                value={formData.cvv}
                onChange={handleInputChange}
                className="border p-2 rounded"
              />
            </div>
          </div>
        </div>

        {/* Tổng tiền */}
        <div className="border-t pt-4">
          <div className="flex justify-between items-center mb-2">
            <span>Tổng tiền hàng:</span>
            <span>{currency}{cartAmount}.00</span>
          </div>
          <div className="flex justify-between items-center mb-2">
            <span>Phí vận chuyển:</span>
            <span>{currency}{delivery_fee}.00</span>
          </div>
          <div className="flex justify-between items-center font-bold">
            <span>Tổng thanh toán:</span>
            <span>{currency}{cartAmount + delivery_fee}.00</span>
          </div>
        </div>

        {/* Nút đặt hàng */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-black text-white py-3 rounded hover:bg-gray-800 disabled:bg-gray-400"
        >
          {loading ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </form>

      {/* Modal thông báo thành công */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Đặt hàng thành công!</h2>
            <p className="mb-6">Cảm ơn bạn đã mua hàng. Chúng tôi sẽ sớm liên hệ với bạn.</p>
            <button
              onClick={() => {
                setShowSuccessModal(false);
                window.location.href = '/';
              }}
              className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
            >
              Tiếp tục mua sắm
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaceOrder;
