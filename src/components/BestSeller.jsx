import React, { useContext, useEffect, useState } from 'react';
import Title from '../components/Title.jsx';
import { ShopContext } from '../context/ShopContext.jsx';
import ProductItem from './ProductItem.jsx';

const BestSeller = () => {
    const { products, loading, error, refreshProducts } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);
    
    useEffect(() => {
        if (products && products.length > 0) {
            const bestProduct = products.filter((item) => item.bestseller);
            setBestSeller(bestProduct.slice(0, 5));
        }
    }, [products]);
    
    return (
        <div className='my-10'>
            <div className='text-center text-3xl py-8'>
                <Title text1={'BEST'} text2={'SELLER'} />
                <p className='w-3/4 m-auto text-xs sm:text-sm md:text-base text-gray-600'>Don't miss out on our best sellers – top picks loved by many!</p>
            </div>
            
            {/* Hiển thị trạng thái loading */}
            {loading && (
                <div className="text-center py-10">
                    <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]" role="status">
                        <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">Đang tải...</span>
                    </div>
                    <p className="mt-2">Đang tải sản phẩm bán chạy...</p>
                </div>
            )}

            {/* Hiển thị lỗi nếu có */}
            {error && !loading && (
                <div className="text-center py-10 text-red-500">
                    <p className="mb-2">Có lỗi xảy ra khi tải sản phẩm bán chạy:</p>
                    <p>{error}</p>
                    <button 
                        onClick={refreshProducts}
                        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Thử lại
                    </button>
                </div>
            )}

            {/* Hiển thị thông báo nếu không có sản phẩm bán chạy */}
            {!loading && !error && bestSeller.length === 0 && (
                <div className="text-center py-10">
                    <p>Không có sản phẩm bán chạy nào.</p>
                </div>
            )}

            {/* Hiển thị sản phẩm bán chạy */}
            {!loading && !error && bestSeller.length > 0 && (
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 px-4'>
                    {bestSeller.map((product, index) => (
                        <ProductItem 
                            key={index} 
                            id={product._id} 
                            image={product.image} 
                            name={product.name} 
                            price={product.price}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default BestSeller;
