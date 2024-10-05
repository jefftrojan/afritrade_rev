import React, { useState } from 'react';
import Image from 'next/image';
import { StaticImageData } from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { FaSpinner } from 'react-icons/fa';

interface CardProps {
    image: string | StaticImageData;
    price: string;
    name: string;
    location: string;
    onPurchase: (order: any) => void;
}

interface Transit {
    id: string;
    name: string;
    info: string;
}

const Card: React.FC<CardProps> = ({ image, price, name, location, onPurchase }) => {
    const [showModal, setShowModal] = useState(false);
    const [activeTab, setActiveTab] = useState('details');
    const [quantity, setQuantity] = useState(1);
    const [isPurchased, setIsPurchased] = useState(false);
    const [availableTransits, setAvailableTransits] = useState<Transit[]>([]);
    const [selectedTransit, setSelectedTransit] = useState<string | null>(null);
    const [showInfo, setShowInfo] = useState<string | null>(null);
    const [legalQuestion, setLegalQuestion] = useState('');
    const [legalAnswer, setLegalAnswer] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPurchasing, setIsPurchasing] = useState(false);

    const handleShow = () => setShowModal(true);
    const handleClose = () => {
        setShowModal(false);
        setIsPurchased(false);
        setAvailableTransits([]);
        setSelectedTransit(null);
        setShowInfo(null);
    };

    const incrementQuantity = () => setQuantity(quantity + 1);
    const decrementQuantity = () => setQuantity(quantity > 1 ? quantity - 1 : 1);

    const handlePurchase = async () => {
        setIsPurchasing(true);
        try {
            // Simulate API call to create an order
            await new Promise(resolve => setTimeout(resolve, 2000)); // 2 second delay

            const newOrder = {
                id: `ORD-${Math.random().toString(36).substr(2, 9)}`,
                status: 'Processing',
                createdAt: new Date().toISOString(),
                totalAmount: parseFloat(price.replace('$', '')) * quantity,
                items: [{ id: Math.random(), name, quantity, price: parseFloat(price.replace('$', '')) }],
                shippingAddress: 'To be updated',
                logistics: {
                    company: 'To be assigned',
                    trackingNumber: 'To be generated',
                    estimatedDelivery: 'To be calculated',
                    currentLocation: 'Warehouse',
                },
                confirmed: false,
            };

            // Call the onPurchase callback with the new order
            onPurchase(newOrder);

            toast.success('Order placed successfully!');
            handleClose(); // Close the modal after successful purchase
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to place order. Please try again.');
        } finally {
            setIsPurchasing(false);
        }
    };

    const handleTransitSelect = (id: string) => {
        setSelectedTransit(id);
        setShowInfo(null);
    };

    const handleInfoToggle = (id: string) => {
        setShowInfo(showInfo === id ? null : id);
    };

    const handleCheckout = async () => {
        if (!selectedTransit) {
            toast.error("Please select a transit agency");
            return;
        }

        const orderDetails = {
            businessName: name,
            location: location,
            price: price,
            quantity: quantity,
            transitAgency: availableTransits.find(transit => transit.id === selectedTransit)?.name,
            totalPrice: parseFloat(price.replace('$', '')) * quantity
        };

        try {
            // Simulating an API call to create an order
            const response = await fetch('/api/createOrder', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderDetails),
            });

            if (response.ok) {
                const result = await response.json();
                toast.success(`Order created successfully! Order ID: ${result.orderId}`);
                handleClose(); // Close the modal after successful order
            } else {
                throw new Error('Failed to create order');
            }
        } catch (error) {
            console.error('Error creating order:', error);
            toast.error('Failed to create order. Please try again.');
        }
    };

    const handleLegalQuestion = async () => {
        if (!legalQuestion.trim()) return;

        setIsLoading(true);
        try {
            const response = await fetch('https://af-rag.onrender.com/rag', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_input: legalQuestion }),
            });

            if (!response.ok) {
                throw new Error('Failed to get response from AI');
            }

            const data = await response.json();
            setLegalAnswer(data.response);
        } catch (error) {
            console.error('Error fetching AI response:', error);
            setLegalAnswer('Sorry, I couldn\'t get an answer at this time. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <>
            <div 
                className="card bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden cursor-pointer transition-all duration-300 hover:shadow-xl hover:scale-105 relative"
                onClick={handleShow}
            >
                <div className="relative h-48">
                    <Image 
                        src={image} 
                        alt={name} 
                        layout="fill" 
                        objectFit="cover" 
                        className="rounded-t-lg"
                    />
                </div>
                <div className="p-4">
                    <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">{name}</h3>
                    <div className="flex justify-between items-center">
                        <span className="text-gray-600 dark:text-gray-300">{location}</span>
                        <span className="text-green-600 dark:text-green-400 font-bold">{price}</span>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showModal && (
                    <motion.div 
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4"
                    >
                        <motion.div 
                            initial={{ scale: 0.9, y: 50 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 50 }}
                            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
                        >
                            <div className="bg-gradient-to-br from-green-800 via-green-600 to-green-400 p-6 text-white">
                                <h2 className="text-3xl font-bold mb-2">{name}</h2>
                                <p className="text-green-100">{location}</p>
                            </div>
                            <button 
                                onClick={handleClose}
                                className="absolute top-4 right-4 text-white hover:text-green-200 transition-colors"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                            <div className="flex-grow overflow-y-auto">
                                <div className="p-6">
                                    {!isPurchased ? (
                                        <>
                                            <div className="flex space-x-4 mb-6">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`py-2 px-4 rounded-full transition-colors ${activeTab === 'details' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                                    onClick={() => setActiveTab('details')}
                                                >
                                                    Details
                                                </motion.button>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`py-2 px-4 rounded-full transition-colors ${activeTab === 'legal' ? 'bg-green-600 text-white' : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}
                                                    onClick={() => setActiveTab('legal')}
                                                >
                                                    Legal Info
                                                </motion.button>
                                            </div>
                                            <motion.div 
                                                initial={{ opacity: 0, y: 20 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.2 }}
                                                className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg mb-6"
                                            >
                                                {activeTab === 'details' && <div className="text-gray-800 dark:text-gray-200">Details content...</div>}
                                                {activeTab === 'legal' && (
                                                    <div className="text-gray-800 dark:text-gray-200">
                                                        <h3 className="text-lg font-semibold mb-2">Legal Information Chatbot</h3>
                                                        <div className="mb-4">
                                                            <input
                                                                type="text"
                                                                value={legalQuestion}
                                                                onChange={(e) => setLegalQuestion(e.target.value)}
                                                                placeholder="Ask a legal question..."
                                                                className="w-full p-2 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                                                            />
                                                            <button
                                                                onClick={handleLegalQuestion}
                                                                disabled={isLoading}
                                                                className="mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full transition-colors"
                                                            >
                                                                {isLoading ? 'Loading...' : 'Ask'}
                                                            </button>
                                                        </div>
                                                        {legalAnswer && (
                                                            <div className="bg-white dark:bg-gray-800 p-3 rounded-md shadow max-h-40 overflow-y-auto">
                                                                <p className="text-gray-800 dark:text-gray-200">{legalAnswer}</p>
                                                            </div>
                                                        )}
                                                    </div>
                                                )}
                                            </motion.div>
                                            <div className="flex justify-between items-center">
                                                <div className="flex items-center bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
                                                    <motion.button whileTap={{ scale: 0.9 }} onClick={decrementQuantity} className="text-gray-700 dark:text-gray-300 px-2 py-1 rounded-l-md hover:bg-gray-300 dark:hover:bg-gray-600">-</motion.button>
                                                    <span className="text-gray-800 dark:text-gray-200 px-4">{quantity}</span>
                                                    <motion.button whileTap={{ scale: 0.9 }} onClick={incrementQuantity} className="text-gray-700 dark:text-gray-300 px-2 py-1 rounded-r-md hover:bg-gray-300 dark:hover:bg-gray-600">+</motion.button>
                                                </div>
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handlePurchase}
                                                    disabled={isPurchasing}
                                                    className={`bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-bold py-2 px-6 rounded-full transition-colors ${isPurchasing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                >
                                                    {isPurchasing ? (
                                                        <span className="flex items-center">
                                                            <FaSpinner className="animate-spin mr-2" />
                                                            Processing...
                                                        </span>
                                                    ) : (
                                                        'Purchase'
                                                    )}
                                                </motion.button>
                                            </div>
                                        </>
                                    ) : (
                                        <motion.div 
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            className="text-gray-800 dark:text-gray-200"
                                        >
                                            <h3 className="text-xl font-semibold mb-4">Choose your transit agency:</h3>
                                            <ul className="space-y-4">
                                                {availableTransits.map((transit) => (
                                                    <motion.li 
                                                        key={transit.id} 
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: 0.1 }}
                                                        className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow"
                                                    >
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="font-medium">{transit.name}</span>
                                                            <div>
                                                                <motion.button 
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleInfoToggle(transit.id)}
                                                                    className="bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500 text-gray-800 dark:text-gray-200 px-3 py-1 rounded-full mr-2 transition-colors"
                                                                >
                                                                    Info
                                                                </motion.button>
                                                                <motion.button 
                                                                    whileHover={{ scale: 1.05 }}
                                                                    whileTap={{ scale: 0.95 }}
                                                                    onClick={() => handleTransitSelect(transit.id)}
                                                                    className={`px-3 py-1 rounded-full transition-colors ${
                                                                        selectedTransit === transit.id 
                                                                        ? 'bg-green-600 text-white' 
                                                                        : 'bg-gray-300 dark:bg-gray-600 text-gray-800 dark:text-gray-200 hover:bg-gray-400 dark:hover:bg-gray-500'
                                                                    }`}
                                                                >
                                                                    {selectedTransit === transit.id ? 'Selected' : 'Select'}
                                                                </motion.button>
                                                            </div>
                                                        </div>
                                                        <AnimatePresence>
                                                            {showInfo === transit.id && (
                                                                <motion.p 
                                                                    initial={{ opacity: 0, height: 0 }}
                                                                    animate={{ opacity: 1, height: 'auto' }}
                                                                    exit={{ opacity: 0, height: 0 }}
                                                                    className="text-sm text-gray-600 dark:text-gray-300 mt-2"
                                                                >
                                                                    {transit.info}
                                                                </motion.p>
                                                            )}
                                                        </AnimatePresence>
                                                    </motion.li>
                                                ))}
                                            </ul>
                                            <div className="mt-6 flex justify-end">
                                                <motion.button 
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    onClick={handleCheckout}
                                                    className={`bg-gradient-to-r from-green-600 to-green-400 hover:from-green-700 hover:to-green-500 text-white font-bold py-2 px-6 rounded-full transition-colors ${
                                                        !selectedTransit && 'opacity-50 cursor-not-allowed'
                                                    }`}
                                                    disabled={!selectedTransit}
                                                >
                                                    Checkout
                                                </motion.button>
                                            </div>
                                        </motion.div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
};

export default Card;