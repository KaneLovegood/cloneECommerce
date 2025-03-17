import React from 'react'
import { assets } from '../assets/assets'

const Footer = () => {
  return (
    <div >
        <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-40 text-sm'>
            <div>
                <img src={assets.logo} className='mb-5 w-32'></img>
                <p className='w-full md:w-2/3 text-gray-600'>Welcome to our team. We are committed to providing the best services to our customers.</p>
            </div>

            <div>
                <p className='text-xl font-medium mb-5'>COMPANY</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>Home</li>
                    <li>About us</li>
                    <li>Delivery</li>
                    <li>Privacy policy</li>
                </ul>
            </div>
            <div>
                <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                <ul className='flex flex-col gap-1 text-gray-600'>
                    <li>0765 - 917 - xxx</li>
                    <li>duykhang12a7@gmail.com</li>
                </ul>
            </div>
        </div>
        <div>
            <hr></hr>
            <p className='py-5 text-sm text-center'>Copyright 2024@forever.com - All Rights Reserved</p>
        </div>
    </div>
  )
}

export default Footer