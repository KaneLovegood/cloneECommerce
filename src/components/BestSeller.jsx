import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title.jsx';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductItem from './ProductItem.jsx';
const BestSeller = () => {
    const {products} = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([])
    useEffect(() => {
        const bestProduct = products.filter((item) => item.bestseller)
        setBestSeller(bestProduct.slice(0,5))
    },[products])
  return (
    
    <div className='my-10'>
      <div className='text-center text-3xl py-8'>
        <Title text1= {'BEST'} text2={'SELLER'}/>
        <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Don't miss out on our best sellers – top picks loved by many!</p>
      </div>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4'>
        {bestSeller.map((product, index) => (
          <ProductItem key={index} id={product._id} image={product.image} name={product.name} price={product.price}></ProductItem>
        ))}
      </div>
    </div>
  )
}

export default BestSeller
