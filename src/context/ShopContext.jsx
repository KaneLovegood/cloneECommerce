import { createContext, useState, useEffect } from "react";
import { products } from "../assets/assets";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export const ShopContext = createContext()

const ShopContextProvider = (props) =>{
    const currency = '$';
    const delivery_fee = 10;
    const [cartItems, setCartItems] = useState({});
    const [search, setSearch] = useState('');
    const [showSearch, setShowSearch] = useState(false);
    const navigate = useNavigate();


    const addToCart = async(itemId,size) => {
        if(!size){
            toast.error('Select Product Size');
            return;
        }
        
        let cartData = structuredClone(cartItems);
        if(cartData[itemId]){
            if(cartData[itemId][size]){
                cartData[itemId][size] += 1;
            }else{  
                cartData[itemId][size] = 1;
            }
        }
        else{
            cartData[itemId] = {};   
            cartData[itemId][size] = 1;
        }
        setCartItems(cartData);
    }

   const getCartCount = () => {
    let totalCount = 0;
    for(const item in cartItems){
        for(const size in cartItems[item]){
            try{
                if(cartItems[item][size] > 0){
                    totalCount += cartItems[item][size];
                }
            }catch(error){
                
            }
        }
    }
    return totalCount;
   }

   const updateQuantity = async(itemId,size,quantity)=>{
        let cartData = structuredClone(cartItems);
        cartData[itemId][size] = quantity;
        setCartItems(cartData);
   }

   const getCartAmount =()=> {
    let totalAmount = 0;
    for(const item in cartItems){
        let itemInfo = products.find((product)=>product._id === item);
        for(const size in cartItems[item]){
            try {
                if (cartItems[item][size] > 0) {
                    totalAmount += itemInfo.price * cartItems[item][size];
                }
            } catch (error) {
                
            }
        }
    }
    return totalAmount;
   }

    const value = {
        products, currency, delivery_fee,
        search, setSearch, showSearch, setShowSearch,
        cartItems, addToCart, getCartCount, updateQuantity, getCartAmount, navigate
    }
    return (
        <ShopContext.Provider value={value}>
            {props.children}
        </ShopContext.Provider>
    )
}

export default ShopContextProvider