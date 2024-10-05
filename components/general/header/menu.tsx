// components/Navbar.js
import { useState } from "react";
import Link from "next/link";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <nav className="bg-white border-b  sticky overflow-x-hidden top-0  p-6 z-50">
      <div className="container mx-auto flex justify-between items-center ">
        {/* Logo */}
        <Link href="/" className="text-xl font-bold text-green-500">
          Afritrade
        </Link>
        {/* Nav Menu */}
        {/* <div className="hidden md:flex flex-grow justify-center space-x-8">
          <Link href="#hero" className="text-gray-500 hover:text-black">Home</Link>
          <Link href="#about" className="text-gray-500 hover:text-black">About</Link>
          <Link href="#suppliers" className="text-gray-500 hover:text-black">Suppliers</Link>
          <Link href="#smes" className="text-gray-500 hover:text-black">SMES(Businesses)</Link>
          <Link href="#couriers" className="text-gray-500 hover:text-black">Couriers</Link>
        </div> */}
        {/* Contact Button */}
        <div className="hidden md:block -ms-40">
          <Link href="/auth" className="bg-green-700 text-white font-bold px-4 py-2 rounded-full hover:bg-green-300">Get Started</Link>
        </div>
        {/* Hamburger Menu Icon */}
        <button onClick={toggleMenu} className="md:hidden text-gray-700 focus:outline-none">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path>
          </svg>
        </button>
      </div>
      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden fixed inset-0 bg-white flex flex-col items-center justify-start z-40 p-4">
          {/* Logo and Close Button */}
          <div className="flex justify-between items-center w-full mb-32">
            <Link href="/" className="text-xl font-bold text-green-500">Afritrade</Link>
            <button onClick={closeMenu} className="text-gray-700 focus:outline-none">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
              </svg>
            </button>
          </div>
          {/* Menu Items */}
          <Link href="#hero" onClick={closeMenu} className="block text-gray-500 px-4 py-2 hover:bg-gray-100">Home</Link>
          {/* <Link href="#about" onClick={closeMenu} className="block text-gray-500 px-4 py-2 hover:bg-gray-100">About</Link>
          <Link href="#suppliers" onClick={closeMenu} className="block text-gray-500 px-4 py-2 hover:bg-gray-100">Suppliers</Link>
          <Link href="#smes" onClick={closeMenu} className="block text-gray-500 px-4 py-2 hover:bg-gray-100">SMES(Businesses)</Link>
          <Link href="#couriers" onClick={closeMenu} className="block text-gray-500 px-4 py-2 hover:bg-gray-100">Couriers</Link> */}
          <Link href="#registeroptions" onClick={closeMenu} className="block mt-30 w-full text-center bg-green-500 text-white font-semibold px-4 py-2 rounded hover:bg-blue-300">Get Started</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
