import axios from 'axios'
import { useContext, useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [exportLoading, setExportLoading] = useState(false)
  const [cancelLoading, setCancelLoading] = useState(null)
  const [selectedTab, setSelectedTab] = useState('orders') // 'orders' or 'stats'
  const { backendUrl } = useContext(ShopContext)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const token = localStorage.getItem('token')

  const handleShopping = () => {
    navigate('/');
  }

  useEffect(() => {
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem đơn hàng')
      return
    }

    // Fetch orders
    fetchOrders()

    // Fetch admin stats if admin
    if (isAdmin) {
      fetchAdminStats()
    }
  }, [token, isAdmin, backendUrl])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Đối với admin, lấy tất cả đơn hàng
      // Đối với user, lấy chỉ đơn hàng của họ
      const endpoint = isAdmin ? 'api/order' : 'api/order/my-orders'
      const response = await axios.get(`${backendUrl}/${endpoint}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setOrders(response.data.orders || [])
      } else {
        toast.error(response.data.message || 'Không thể lấy đơn hàng')
      }
    } catch (error) {
      console.error('Lỗi khi lấy đơn hàng:', error)
      toast.error('Có lỗi xảy ra khi lấy đơn hàng')
    } finally {
      setLoading(false)
    }
  }

  const fetchAdminStats = async () => {
    try {
      const response = await axios.get(`${backendUrl}/api/user/admin/stats`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.data.success) {
        setStats(response.data.stats)
      } else {
        toast.error(response.data.message || 'Không thể lấy thống kê')
      }
    } catch (error) {
      console.error('Lỗi khi lấy thống kê:', error)
    }
  }

  // Hàm để xuất đơn hàng dưới dạng JSON
  const exportOrder = async (orderId) => {
    try {
      setExportLoading(true);
      const response = await axios.get(`${backendUrl}/api/order/export/${orderId}`, {
        headers: { 
          'Authorization': `Bearer ${token}`
        },
        responseType: 'blob'
      });
      
      // Tạo đường dẫn URL tạm thời cho blob
      const url = window.URL.createObjectURL(new Blob([response.data]));
      
      // Tạo thẻ a để tải xuống
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `order_${orderId}_${Date.now()}.json`);
      document.body.appendChild(link);
      
      // Kích hoạt tải xuống
      link.click();
      
      // Dọn dẹp
      window.URL.revokeObjectURL(url);
      document.body.removeChild(link);
      
      toast.success('Đã xuất đơn hàng thành công');
    } catch (error) {
      console.error('Lỗi khi xuất đơn hàng:', error);
      toast.error('Không thể xuất đơn hàng');
    } finally {
      setExportLoading(false);
    }
  };

  // Hàm để hủy đơn hàng
  const cancelOrder = async (orderId) => {
    if (!window.confirm('Bạn có chắc chắn muốn hủy đơn hàng này?')) {
      return;
    }
    
    try {
      setCancelLoading(orderId);
      const response = await axios.patch(`${backendUrl}/api/order/cancel`, 
        { orderId }, 
        { 
          headers: { 
            'Authorization': `Bearer ${token}`
          } 
        }
      );
      
      if (response.data.success) {
        toast.success('Đơn hàng đã được hủy thành công');
        // Cập nhật lại danh sách đơn hàng
        fetchOrders();
      } else {
        toast.error(response.data.message || 'Không thể hủy đơn hàng');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng:', error);
      toast.error('Có lỗi xảy ra khi hủy đơn hàng');
    } finally {
      setCancelLoading(null);
    }
  };

  // Admin section components
  const AdminTabs = () => (
    <div className="flex border-b mb-6">
      <button 
        className={`py-2 px-4 ${selectedTab === 'orders' ? 'border-b-2 border-purple-500 font-bold' : ''}`}
        onClick={() => setSelectedTab('orders')}
      >
        Quản lý đơn hàng
      </button>
      <button 
        className={`py-2 px-4 ${selectedTab === 'stats' ? 'border-b-2 border-purple-500 font-bold' : ''}`}
        onClick={() => setSelectedTab('stats')}
      >
        Thống kê
      </button>
      <button 
        className={`py-2 px-4 ${selectedTab === 'products' ? 'border-b-2 border-purple-500 font-bold' : ''}`}
        onClick={() => setSelectedTab('products')}
      >
        Quản lý sản phẩm
      </button>
    </div>
  )

  const AdminStats = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats ? (
        <>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Tổng sản phẩm</h3>
            <p className="text-2xl font-bold">{stats.totalProducts}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Tổng đơn hàng</h3>
            <p className="text-2xl font-bold">{stats.totalOrders}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Doanh thu</h3>
            <p className="text-2xl font-bold">${stats.totalRevenue}</p>
          </div>
          <div className="bg-white p-4 rounded-lg shadow">
            <h3 className="text-gray-500">Đơn chờ xử lý</h3>
            <p className="text-2xl font-bold">{stats.pendingOrders}</p>
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  )

  const ProductsList = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Products list</h3>
      <p className="text-gray-500">No context, can not connect to api.</p>
    </div>
  )

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Đang xử lý':
        return 'bg-yellow-100 text-yellow-800';
      case 'Đang giao hàng':
        return 'bg-blue-100 text-blue-800';
      case 'Đã giao hàng':
        return 'bg-green-100 text-green-800';
      case 'Đã hủy':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-[80vh] py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">{isAdmin ? 'Quản lý' : 'Đơn hàng của bạn'}</h1>
        
        {/* Admin sections */}
        {isAdmin && (
          <>
            <AdminTabs />
            {selectedTab === 'stats' && <AdminStats />}
            {selectedTab === 'products' && <ProductsList />}
          </>
        )}
        
        {/* Orders section - for both admin and normal users */}
        {selectedTab === 'orders' && (
          <>
            {loading ? (
              <p className="text-center py-8">Đang tải...</p>
            ) : orders.length > 0 ? (
              <div className="bg-white rounded-lg shadow overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mã đơn</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ngày</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tổng tiền</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                      {isAdmin && <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Khách hàng</th>}
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="px-6 py-4 whitespace-nowrap">#{order._id.slice(-6)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{formatDate(order.orderDate)}</td>
                        <td className="px-6 py-4 whitespace-nowrap">{Number(order.totalAmount).toLocaleString()} VND</td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(order.status)}`}>
                            {order.status}
                          </span>
                        </td>
                        {isAdmin && <td className="px-6 py-4 whitespace-nowrap">{order.userId?.name || 'N/A'}</td>}
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium flex items-center space-x-2">
                          <button 
                            className="text-indigo-600 hover:text-indigo-900"
                            onClick={() => navigate(`/order-detail/${order._id}`)}
                          >
                            Xem
                          </button>
                          
                          <button 
                            className="text-blue-600 hover:text-blue-800 flex items-center"
                            onClick={() => exportOrder(order._id)}
                            disabled={exportLoading}
                            title="Xuất đơn hàng"
                          >
                            {exportLoading ? (
                              <div className="animate-spin h-4 w-4 border-t-2 border-blue-500 rounded-full"></div>
                            ) : (
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                            )}
                          </button>
                          
                          {order.status === 'Đang xử lý' && (
                            <button 
                              className="text-red-600 hover:text-red-900 flex items-center"
                              onClick={() => cancelOrder(order._id)}
                              disabled={cancelLoading === order._id}
                            >
                              {cancelLoading === order._id ? (
                                <div className="animate-spin h-4 w-4 border-t-2 border-red-500 rounded-full"></div>
                              ) : 'Hủy'}
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Bạn chưa có đơn hàng nào.</p>
                {!isAdmin && (
                  <button onClick={handleShopping} className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
                    Mua sắm ngay
                  </button>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

export default Orders
