'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { FaArrowLeft, FaTruck, FaBox, FaCheckCircle, FaSpinner } from 'react-icons/fa';

// Mock data for multiple orders
const ordersData = [
  {
    id: 'ORD-12345',
    status: 'In Transit',
    createdAt: '2023-05-15T10:30:00Z',
    totalAmount: 239.99,
    items: [
      { id: 1, name: 'Wireless Headphones', quantity: 1, price: 129.99 },
      { id: 2, name: 'Smartphone Case', quantity: 2, price: 24.99 },
      { id: 3, name: 'USB-C Cable', quantity: 3, price: 19.99 },
    ],
    shippingAddress: '123 Main St, Anytown, AN 12345',
    logistics: {
      company: 'FastShip Logistics',
      trackingNumber: 'FS987654321',
      estimatedDelivery: '2023-05-20',
      currentLocation: 'Distribution Center, Big City',
    },
    confirmed: false,
  },
  {
    id: 'ORD-67890',
    status: 'Delivered',
    createdAt: '2023-05-10T14:45:00Z',
    totalAmount: 499.99,
    items: [
      { id: 4, name: 'Smartphone', quantity: 1, price: 499.99 },
    ],
    shippingAddress: '456 Elm St, Othertown, OT 67890',
    logistics: {
      company: 'QuickDeliver',
      trackingNumber: 'QD123456789',
      estimatedDelivery: '2023-05-14',
      currentLocation: 'Delivered',
    },
    confirmed: true,
  },
  {
    id: 'ORD-24680',
    status: 'Processing',
    createdAt: '2023-05-18T09:15:00Z',
    totalAmount: 89.97,
    items: [
      { id: 5, name: 'Wireless Mouse', quantity: 1, price: 39.99 },
      { id: 6, name: 'Mousepad', quantity: 1, price: 14.99 },
      { id: 7, name: 'HDMI Cable', quantity: 1, price: 34.99 },
    ],
    shippingAddress: '789 Oak St, Somewhere, SW 13579',
    logistics: {
      company: 'EcoShip',
      trackingNumber: 'ES246801357',
      estimatedDelivery: '2023-05-25',
      currentLocation: 'Warehouse',
    },
    confirmed: false,
  },
];

const OrderStatus: React.FC<{ status: string }> = ({ status }) => {
  const getStatusIcon = () => {
    switch (status) {
      case 'Delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'In Transit':
        return <FaTruck className="text-blue-500" />;
      case 'Processing':
        return <FaSpinner className="text-yellow-500" />;
      default:
        return <FaBox className="text-gray-500" />;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      {getStatusIcon()}
      <span className="font-semibold">{status}</span>
    </div>
  );
};

const OrderModal: React.FC<{ order: any; onClose: () => void }> = ({ order, onClose }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Order #{order.id}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Order Details</h3>
            <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
            <p>Total Amount: ${order.totalAmount.toFixed(2)}</p>
            <p>Shipping Address: {order.shippingAddress}</p>
          </div>
          <div>
            <h3 className="text-lg font-semibold mb-2">Logistics Information</h3>
            <p>Company: {order.logistics.company}</p>
            <p>Tracking Number: {order.logistics.trackingNumber}</p>
            <p>Estimated Delivery: {order.logistics.estimatedDelivery}</p>
            <p>Current Location: {order.logistics.currentLocation}</p>
          </div>
        </div>
        <h3 className="text-lg font-semibold mb-2">Items</h3>
        <table className="w-full">
          <thead>
            <tr>
              <th className="text-left">Item</th>
              <th className="text-left">Quantity</th>
              <th className="text-left">Price</th>
              <th className="text-left">Total</th>
            </tr>
          </thead>
          <tbody>
            {order.items.map((item: any) => (
              <tr key={item.id}>
                <td>{item.name}</td>
                <td>{item.quantity}</td>
                <td>${item.price.toFixed(2)}</td>
                <td>${(item.quantity * item.price).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const OrderProfile: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [showConfirmed, setShowConfirmed] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const storedOrders = JSON.parse(localStorage.getItem('orders') || '[]');
    setOrders(storedOrders);
  }, []);

  const filteredOrders = orders.filter(order => order.confirmed === showConfirmed);

  const handleConfirmReceive = (orderId: string) => {
    setOrders(prevOrders => 
      prevOrders.map(order => 
        order.id === orderId ? { ...order, confirmed: true, status: 'Delivered' } : order
      )
    );
    localStorage.setItem('orders', JSON.stringify(orders));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <Link href="/businesses" className="inline-flex items-center text-white hover:text-green-200 mb-8 transition-colors text-xl">
          <FaArrowLeft className="mr-2" />
          <span className="font-semibold">Back to Business</span>
        </Link>
        
        <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-3xl shadow-2xl overflow-hidden border border-green-300">
          <div className="p-8 sm:p-10">
            <h1 className="text-5xl font-bold text-white mb-8 text-center">Your Orders</h1>
            
            <div className="mb-8 flex justify-center space-x-4">
              <button
                onClick={() => setShowConfirmed(false)}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-colors ${
                  !showConfirmed ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-green-800 hover:bg-green-100'
                }`}
              >
                Ongoing Orders
              </button>
              <button
                onClick={() => setShowConfirmed(true)}
                className={`px-8 py-4 rounded-full text-lg font-semibold transition-colors ${
                  showConfirmed ? 'bg-green-500 text-white shadow-lg' : 'bg-white text-green-800 hover:bg-green-100'
                }`}
              >
                Confirmed Orders
              </button>
            </div>
            
            <div className="bg-white bg-opacity-20 rounded-2xl overflow-hidden shadow-xl">
              <table className="min-w-full divide-y divide-green-200">
                <thead className="bg-green-700 text-white">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider">Action</th>
                  </tr>
                </thead>
                <tbody className="bg-white bg-opacity-10 divide-y divide-green-200">
                  {filteredOrders.map((order) => (
                    <tr key={order.id} className="hover:bg-green-100 hover:bg-opacity-20 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">{order.id}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-green-100">{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <OrderStatus status={order.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-white">${order.totalAmount.toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full mr-2 transition-colors"
                        >
                          View
                        </button>
                        {!order.confirmed && (
                          <button
                            onClick={() => handleConfirmReceive(order.id)}
                            className="bg-blue-400 hover:bg-blue-500 text-white font-bold py-2 px-4 rounded-full transition-colors"
                          >
                            Confirm Receive
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
      {selectedOrder && (
        <OrderModal order={selectedOrder} onClose={() => setSelectedOrder(null)} />
      )}
    </div>
  );
};

export default function OrderPage() {
  return <OrderProfile />;
}