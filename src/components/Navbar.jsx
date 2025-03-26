import { useContext, useEffect, useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { ShopContext } from "../context/ShopContext";
import { assets } from "./../assets/assets";

const Navbar = () => {
  const [visible, setVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const {setShowSearch, getCartCount} = useContext(ShopContext)
  const navigate = useNavigate();

  // Check authentication status when component mounts and when localStorage changes
  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      setIsLoggedIn(!!token);
    };
    
    // Initial check
    checkAuth();
    
    // Add event listener for storage changes (for multi-tab functionality)
    window.addEventListener('storage', checkAuth);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);

  // Handle user icon click
  const handleUserClick = () => {
    if (!isLoggedIn) {
      navigate('/login');
    }
  }

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
    navigate('/');
  }

  return (
    <div className="flex items-center justify-between py-5 font-medium">
      <Link to='/'><img src={assets.logo} className="w-36" alt="" /></Link>

      <ul className="hidden sm:flex gap-5 text-sm text-gray-700">
        <NavLink to="/" className="flex flex-col items-center gap-1">
          <p>HOME</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/collection" className="flex flex-col items-center gap-1">
          <p>COLLECTION</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/about" className="flex flex-col items-center gap-1">
          <p>ABOUT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
        <NavLink to="/contact" className="flex flex-col items-center gap-1">
          <p>CONTACT</p>
          <hr className="w-2/4 border-none h-[1.5px] bg-gray-700 hidden"></hr>
        </NavLink>
      </ul>
      <div className="flex items-center gap-6">
        <img src={assets.search_icon} onClick={() => setShowSearch(true)} className="w-5 cursor-pointer"></img>
        <div className="group relative">
          <img src={assets.profile_icon} onClick={handleUserClick} className="w-5 cursor-pointer"></img>
          <div className="group-hover:block hidden absolute dropdown-menu right-0 pt-4">
            <div className="flex flex-col gap-2 w-36 py-3 px-5 bg-slate-100 text-gray-500 rounded">
              {isLoggedIn ? (
                <>
                  <Link to="/profile" className="cursor-pointer hover:text-black">My Account</Link>
                  <Link to="/orders" className="cursor-pointer hover:text-black">Orders</Link>
                  <p onClick={handleLogout} className="cursor-pointer hover:text-black">Logout</p>
                </>
              ) : (
                <Link to="/login" className="cursor-pointer hover:text-black">Login</Link>
              )}
            </div>
          </div>
        </div>

        <Link to="/cart" className="relative">
          {/* w-5 => chieu rong 5, min-w-5 => khi thu nho k dc nho qua 5 */}
          <img src={assets.cart_icon} className="w-5 min-w-5"></img>
          <p className="absolute right-[-5px] bottom-[-5px] w-4 text-center leading-4 bg-black text-white aspect-square rounded-full text-[8px]">
            {getCartCount()}
          </p>
        </Link>
        <img
          onClick={() => setVisible(true)}
          src={assets.menu_icon}
          className="w-5 cursor-pointer sm:hidden"
        ></img>
      </div>

      {/* Sidebar menu for small screens */}

      <div
        className={`absolute top-0 right-0 bottom-0 overflow-hidden bg-white transition-all ${
          visible ? `w-full` : "w-0"
        }`}
      >
        <div className="flex flex-col text-gray-600">
          <div
            onClick={() => setVisible(false)}
            className="cursor-pointer flex items-center gap-4 p-3"
          >
            <img className="h-4 rotate-180" src={assets.dropdown_icon}></img>
            <p>Back</p>
          </div>
          {/* py-2 (Padding trên & dưới)
              py-2 = padding-top và padding-bottom là 0.5rem (tương đương 8px).
              Giúp mục menu có khoảng cách trên và dưới, làm cho nút bấm dễ nhìn hơn. */}
          {/* pl-6 (Padding trái)
              pl-6 = padding-left là 1.5rem (tương đương 24px).
              Đẩy nội dung sang phải một chút, giúp căn chỉnh menu đẹp hơn. */}
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border " to="/">
            HOME
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border " to="/collection">
            COLLECTION
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border " to="/about">
            ABOUT
          </NavLink>
          <NavLink onClick={() => setVisible(false)} className="py-2 pl-6 border " to="/contact">
            CONTACT
          </NavLink>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
