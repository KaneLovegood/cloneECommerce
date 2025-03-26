import { useContext } from "react";
import { Link } from 'react-router-dom';
import { ShopContext } from '../context/ShopContext';

const DEFAULT_IMAGE = "https://placehold.co/300x400";

export const ProductItem = ({ data }) => {
  const { currency } = useContext(ShopContext);
  
  // Destructure các thuộc tính từ data
  const { _id, id, image, name, price } = data || {};
  
  console.log("ProductItem - Data:", data);
  console.log("ProductItem - ID:", _id || id, "Type:", typeof (_id || id), "Name:", name);
  
  // Sử dụng _id nếu có, không thì dùng id
  const productId = _id || id;
  
  if (!productId) {
    console.error("Sản phẩm không có ID hợp lệ:", {_id, id, name});
    return null;
  }

  // Kiểm tra và xử lý URL hình ảnh
  const imageUrl = image && Array.isArray(image) && image.length > 0 ? image[0] : DEFAULT_IMAGE;

  return (
    <Link className='text-gray-700 cursor-pointer' to={`/product/${productId}`}>
      <div className='overflow-hidden'>
        <img 
          className='hover:scale-110 transition ease-in-out' 
          src={imageUrl} 
          alt={name || "Sản phẩm"}
        />
      </div>
      <p className='pt-3 pb-1 text-sm'>{name}</p>
      <p className='text-sm font-medium'>{currency} {price}</p>
    </Link>
  );
};

export default ProductItem;
