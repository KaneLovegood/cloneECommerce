import axios from 'axios'
import React, { useContext, useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Orders = () => {
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(false)
  const [selectedTab, setSelectedTab] = useState('orders') // 'orders' or 'stats'
  const { backendUrl } = useContext(ShopContext)
  const isAdmin = localStorage.getItem('isAdmin') === 'true'
  const token = localStorage.getItem('token')

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
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // Đối với admin, lấy tất cả đơn hàng
      // Đối với user, lấy chỉ đơn hàng của họ
      const endpoint = isAdmin ? 'api/order/all' : 'api/order/user-orders'
      const response = await axios.get(`${backendUrl}/${endpoint}`, {
        headers: { token }
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
        headers: { token }
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
        <p>Đang tải thống kê...</p>
      )}
    </div>
  )

  const ProductsList = () => (
    <div className="bg-white p-4 rounded-lg shadow">
      <h3 className="text-xl font-bold mb-4">Danh sách sản phẩm</h3>
      <p className="text-gray-500">Không có dữ liệu sản phẩm. API chưa được triển khai.</p>
    </div>
  )

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
              <p className="text-center py-8">Đang tải đơn hàng...</p>
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
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">OD123456</td>
                      <td className="px-6 py-4 whitespace-nowrap">25/04/2023</td>
                      <td className="px-6 py-4 whitespace-nowrap">$350</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          Hoàn thành
                        </span>
                      </td>
                      {isAdmin && <td className="px-6 py-4 whitespace-nowrap">Nguyễn Văn A</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Xem</button>
                        {isAdmin && <button className="text-red-600 hover:text-red-900">Hủy</button>}
                      </td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 whitespace-nowrap">OD789012</td>
                      <td className="px-6 py-4 whitespace-nowrap">28/04/2023</td>
                      <td className="px-6 py-4 whitespace-nowrap">$120</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                          Đang giao
                        </span>
                      </td>
                      {isAdmin && <td className="px-6 py-4 whitespace-nowrap">Trần Thị B</td>}
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button className="text-indigo-600 hover:text-indigo-900 mr-3">Xem</button>
                        {isAdmin && <button className="text-red-600 hover:text-red-900">Hủy</button>}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 bg-white rounded-lg shadow">
                <p className="text-gray-500">Không có đơn hàng nào.</p>
                {!isAdmin && (
                  <button className="mt-4 bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
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
