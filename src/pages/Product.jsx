import React,{useContext, useState,useEffect} from 'react'
import { ShopContext } from '../context/ShopContext';
import { useParams } from 'react-router-dom';
import assets from '../assets/assets';
import RelatedProducts from '../components/RelatedProducts/RelatedProducts';

const Product = () => {
  const {productID} = useParams();
  const {products, currency,addToCart} = useContext(ShopContext);
  const [productData, setProductData] = useState(false);
  const [image, setImage] = useState('');
  const [size, setSize] = useState('');
  const fetchProductData = async () => {
    products.map((item) => {
      if(item.id === productID){
      setProductData(item)
      setImage(item.image[0])
      console.log(item)
    return null;
  }
 })
}

useEffect(() => {
  fetchProductData();
},[productID])

return productData ? (
  <div className='border-t-2 pt-10 transition-opacity ease-in duration-500 opacity-100'>
    {/* Product Data */}
    <div className='flex gap-12 sm:gap-12 flex-col sm:flex-row'>
      {/* Product Images */}
      <div className='flex-1 flex flex-col-reverse gap-3 sm:flex-row'>
        <div className='flex sm:flex-col overflow-x-auto sm:overflow-y-scroll justify-between sm:justify-normal sm:w-[18.7%] w-full'>
          {
            productData.image.map((item,index) => (
        
              <img src={item} key={index}  className='w-[24%] sm:w-full sm:mb-3 flex-shrink-0 cursor-pointer' onClick={() => setImage(item)} />
           
            ))
          }
        </div>
        <div className='sm:w-[80%] w-full' >
          <img src={image} className='w-full h-auto object-cover' />
        </div>
      </div>
      {/* Product Info */}
      <div className='flex-1  '>
        <h1 className='text-2xl font-medium mt-2'>{productData.name}</h1>
        <div className='flex items-center gap-1 mt-2'>
          <img src={assets.star_icon} alt="" className="w-3 5" />
          <img src={assets.star_icon} alt="" className="w-3 5" />
          <img src={assets.star_icon} alt="" className="w-3 5" />
          <img src={assets.star_icon} alt="" className="w-3 5" />
          <img src={assets.star_dull_icon} alt="" className="w-3 5" />
          <p className='p1-2'>(122)</p>
        </div>
        <p className='mt-5 text-3xl font-medium'>{currency}{productData.price}</p>
        <p className='mt-5 md:w-4/5 text-gray-500'>{productData.description}</p>
        <div className='flex flex-col gap-4 my-8'>
          <p>Select Size</p>
          <div className='flex gap-2'>
            {productData.sizes.map((item,index) => (
              <button onClick={()=>setSize(item)}  className={`border py-2 px-4 bg-gray-100 ${item === size ? 'border-orange-500' : ''}`} key={index}>{item}</button>
            ))}
           
          </div>

        </div>
        <button onClick={()=>addToCart(productData._id,size)} className='bg-black text-white py-3 px-8 text-sm active:bg-gray-700'>Add to Cart</button>
        <hr className='mt-8 sm:w-4/5' />
        <div className='flex flex-col gap-1 mt-5 text-sm text-gray-500'>
          <p>100% Original Product.</p>
          <p>Cash on delivery is available on this product.</p>
          <p>Easy return and exchange policy within 7 days.</p>
        </div>
      </div>
    </div>
    {/* Description and Reviews */}
    <div className='mt-20'>
      <div className='flex'>
        <b className='border px-5 py-3 text-sm'>Description</b>
        <p className='border px-5 py-3 text-sm'>Reviews (122)</p>
      </div>
      <div className='flex flex-col gap-4 border px-6 py-6 text-sm text-gray-500'>
        <p>An a e-commerce website for a clothing brand.</p>
        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quos.</p>
    </div>
  </div>
  {/* Display related products */}
  <RelatedProducts category={productData.category} subCategory={productData.subCategory} />
 
    
  </div>
  ) : <div className='opacity-0'></div>
}



export default Product
