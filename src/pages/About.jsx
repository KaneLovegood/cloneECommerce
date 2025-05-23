import React from 'react';
import Title from '../components/Title';
import { assets } from '../assets/assets';
import NewsletterBox from '../components/NewletterBox';

const About = () => {
    return (
        <div>
            <div className='text-2xl text-center pt-8 border-t'>
                <Title text1={'ABOUT'} text2={'US'} />
            </div>
            <div className='my-10 flex flex-col md:flex-row gap-16'>
                <img className='w-full md:max-w-[450px]' src={assets.about_img} alt='' />
                <div className='flex flex-col justify-center gap-6 md:w-2/4 text-gray-600'>
                    <p>
                        Forever was born out of a passion for innovation and a desire to revolutionize the way people shop online. Our journey began with a simple idea: to provide a platform where customers can easily discover, explore, and purchase a wide range of products from the comfort of their homes.
                    </p>
                    <p>
                        Since our inception, we've worked tirelessly to curate a diverse selection of high-quality products that cater to every taste and preference. From fashion and beauty to electronics and home essentials, we offer an extensive collection sourced from trusted brands and suppliers.
                    </p>
                    <p>
                        At the heart of our mission is a commitment to redefining the shopping experience through innovation and convenience. We started with a vision to create an online marketplace where customers could seamlessly browse, select, and purchase top-quality products without leaving their homes.
                    </p>
                    <b className='text-gray-800'>Our Mission</b>
                    <p>
                        Our mission at Forever is to empower customers with choice, convenience, and exceptional value. We're dedicated to delivering a seamless shopping experience that exceeds expectations.
                    </p>
                </div>
            </div>

            <div className='text-xl py-4'>
                <Title text1={'WHY'} text2={'CHOOSE US'} />
            </div>

            <div className='flex flex-col md:flex-row text-sm mb-20'>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Quality Assurance:</b>
                    <p className='text-gray-600'>We meticulously select and vet each product to ensure it meets our high standards of quality and authenticity.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Convenience:</b>
                    <p className='text-gray-600'>With our user-friendly platform, shopping is just a click away. We offer fast and secure checkout, multiple payment options, and hassle-free returns.</p>
                </div>
                <div className='border px-10 md:px-16 py-8 sm:py-20 flex flex-col gap-5'>
                    <b>Exceptional Customer Service:</b>
                    <p className='text-gray-600'>Our team of dedicated professionals is committed to providing you with the highest level of service. We're here to assist you every step of the way, ensuring your shopping experience is nothing short of exceptional.</p>
                </div>
            </div>
            <NewsletterBox />
        </div>
    );
};

export default About;