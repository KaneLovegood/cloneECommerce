import axios from 'axios'
import React, { useContext, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContext'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { backendUrl } = useContext(ShopContext)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = isAdmin ? 'api/user/admin' : 'api/user/login'
      const response = await axios.post(`${backendUrl}/${endpoint}`, {
        email, password
      })

      if (response.data.success) {
        const token = response.data.token
        localStorage.setItem('token', token)
        localStorage.setItem('isAdmin', isAdmin.toString())
        toast.success('Đăng nhập thành công!')
        
        if (isAdmin) {
          // Chuyển đến trang admin (không có trong dự án hiện tại)
          navigate('/orders')
        } else {
          // Chuyển đến trang orders cho user thường
          navigate('/orders')
        }
      } else {
        toast.error(response.data.message || 'Đăng nhập thất bại')
      }
    } catch (error) {
      console.error('Lỗi đăng nhập:', error)
      toast.error('Có lỗi xảy ra khi đăng nhập')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Đăng nhập</h2>
        
        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">Mật khẩu</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              required
            />
          </div>

          <div className="mb-6">
            <label className="flex items-center">
              <input 
                type="checkbox" 
                checked={isAdmin}
                onChange={() => setIsAdmin(!isAdmin)}
                className="mr-2"
              />
              <span>Đăng nhập với quyền Admin</span>
            </label>
          </div>
          
          <button 
            type="submit" 
            className="w-full bg-purple-500 text-white py-2 rounded-lg hover:bg-purple-600 transition duration-300"
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : 'Đăng nhập'}
          </button>
        </form>
        
        <div className="mt-4 text-center">
          <p>Chưa có tài khoản? <button className="text-purple-500">Đăng ký</button></p>
          {isAdmin && (
            <div className="mt-2 text-sm text-gray-600">
              <p>Admin: admin@forever.com / admin123</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Login
