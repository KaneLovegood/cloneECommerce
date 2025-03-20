import React, { useState } from 'react';

const NewsletterBox = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const validateEmail = (email) => {
        return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setError('');
        
        if (!email) {
            setError('Please enter your email');
            return;
        }

        if (!validateEmail(email)) {
            setError('Please enter a valid email');
            return;
        }

        // Here you would typically make an API call to subscribe
        setSuccess(true);
        setEmail('');
        
        // Reset success message after 3 seconds
        setTimeout(() => {
            setSuccess(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center py-16 px-4 text-center">
            <h3 className="text-xl font-medium mb-2">Subscribe now & get 20% off</h3>
            <p className="text-gray-500 text-sm mb-6">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam at feugiat orci.</p>
            <form onSubmit={handleSubmit} className="w-full max-w-md">
                <div className="flex flex-col">
                    <div className="flex">
                        <input 
                            type="email" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="Enter your email" 
                            className={`flex-1 px-4 py-2 border ${error ? 'border-red-500' : 'border-gray-300'} focus:outline-none`}
                        />
                        <button 
                            type="submit" 
                            className="bg-black text-white px-6 py-2 hover:bg-gray-800 transition-colors"
                        >
                            Subscribe
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-sm mt-2 text-left">{error}</p>}
                    {success && (
                        <div className="text-green-500 text-sm mt-2 flex items-center justify-center animate-fade-in">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                            </svg>
                            Successfully subscribed!
                        </div>
                    )}
                </div>
            </form>
        </div>
    );
};

export default NewsletterBox;
