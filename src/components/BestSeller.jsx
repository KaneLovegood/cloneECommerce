import React, { useContext, useEffect, useState } from 'react';
import { ShopContext } from "../context/ShopContext";
import ProductItem from './ProductItem';
import Title from './Title';

const BestSeller = () => {
    const { products, loading, error } = useContext(ShopContext);
    const [bestSeller, setBestSeller] = useState([]);

    useEffect(() => {
        if (products && products.length > 0) {
            // Lấy 4 sản phẩm đầu tiên làm sản phẩm bán chạy
            setBestSeller(products.slice(0, 4));
        }
    }, [products]);

    return (
        <div className='my-10'>
            <Title>Best Seller</Title>
            {loading && <p className="text-center py-4">Đang tải sản phẩm...</p>}
            {error && <p className="text-center py-4 text-red-500">{error}</p>}
            {!loading && bestSeller.length === 0 && (
                <p className="text-center py-4">Không có sản phẩm</p>
            )}

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {bestSeller.map((product) => (
                    <ProductItem key={product._id} data={product} />
                ))}
            </div>
        </div>
    );
};

export default BestSeller;
