import React, { useState } from 'react';
import Link from 'next/link';

const HamburgerMenu: React.FC = () => {
    const [isOpen, setIsOpen] = useState(false);

    const toggleMenu = () => setIsOpen(!isOpen);

    const menuItems = [
        { label: 'Profile', href: '/profile' },
       
        { label: 'Orders', href: '/orders' },


    ];

    return (
        <div className="relative bg-white rounded-full">
            <button
                className="text-green-900 p-2 rounded-md hover:bg-white/10 transition-colors duration-200"
                onClick={toggleMenu}
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-20">
                    {menuItems.map((item, index) => (
                        <Link key={index} href={item.href}>
                            <span className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer">
                                {item.label}
                            </span>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );
};

export default HamburgerMenu;