import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Card from './cards';
import { FaSearch, FaRobot } from 'react-icons/fa';
import HamburgerMenu from './hamburger';
import { motion } from 'framer-motion';

// Make sure to create this component

const Dashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showChatModal, setShowChatModal] = useState(false);
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orderStatus, setOrderStatus] = useState<string | null>(null);
  const [purchasedProduct, setPurchasedProduct] = useState<any | null>(null);

  // Fetch products from API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('http://localhost:8000/products/'); // Adjust the URL if necessary
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
        setIsLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message as unknown as React.SetStateAction<null>);
        } else {
          setError('An unknown error occurred' as unknown as React.SetStateAction<null>);
        }
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Filter products based on search term
  const filteredCards = products.filter((product: { product_name: string; location: string }) =>
    product.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.location.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleProductPurchase = async (product: { id: number; product_name: string; location: string }) => {
    const userId = localStorage.getItem('user_id');
    const userName = localStorage.getItem('user_name'); // Assuming you store the user's name
    if (!userId || !userName) {
      setOrderStatus('Please log in to place an order.');
      return;
    }

    const order = {
      product_id: product.id.toString(), // Ensure this is a string
      product_name: product.product_name,
      buyer_name: userName,
      buyer_id: userId,
      location: product.location,
      status: 'Pending'
    };

    try {
      const response = await fetch('http://localhost:8000/orders/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'Failed to place order');
      }

      const data = await response.json();
      setOrderStatus(`Order placed successfully! Order ID: ${data.order_id}`);
      setPurchasedProduct({ ...product, orderId: data.order_id });
    } catch (error) {
      if (error instanceof Error) {
        setOrderStatus(`Error placing order: ${error.message}`);
      } else {
        setOrderStatus('An unknown error occurred while placing the order');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400">
      {/* Header */}
      <header className=" ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <HamburgerMenu />
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search bar */}
        <div className="mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search products or locations..."
              className="w-full p-4 pr-12 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300 bg-white bg-opacity-90"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <FaSearch className="absolute right-4 top-1/2 transform -translate-y-1/2 text-green-600" />
          </div>
        </div>

        {/* Order status message */}
        {orderStatus && (
          <div className="mb-8 p-4 rounded-lg bg-white bg-opacity-90 text-green-800">
            {orderStatus}
          </div>
        )}

        {/* Cards grid */}
        {isLoading ? (
          <div className="text-center text-white mt-8">Loading products...</div>
        ) : error ? (
          <div className="text-center text-white mt-8 bg-red-500 p-4 rounded-lg">{error}</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCards.map((product) => (
              <div key={product.id} onClick={() => handleProductPurchase(product)}>
                <Card
                  image={product.image_url}
                  price={product.product_details}
                  name={product.product_name}
                  location={product.location}
                />
              </div>
            ))}
          </div>
        )}

        {/* No results message */}
        {filteredCards.length === 0 && !isLoading && !error && (
          <div className="text-center text-white mt-8 bg-green-700 bg-opacity-80 p-4 rounded-lg shadow-sm">
            No results found. Try a different search term.
          </div>
        )}

        {/* Order component */}
        {purchasedProduct && (
          <Order
            product={purchasedProduct}
            onClose={() => setPurchasedProduct(null)}
          />
        )}
      </main>
    </div>
  );
};

export default Dashboard;