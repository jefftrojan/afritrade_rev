import React, { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface DeliveryRequest {
  id: string;
  Product: string;
  Destination: string;
  Source: string;
  Quantity: number;
  "Client Contact": string;
  status: string;
}

const ConfirmedOrders = () => {
  const [confirmedOrders, setConfirmedOrders] = useState<DeliveryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchConfirmedOrders();
  }, []);

  const fetchConfirmedOrders = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const q = query(collection(db, 'delivery_requests'), where('status', '==', 'AcceptedRequest'));
      const querySnapshot = await getDocs(q);
      const orders: DeliveryRequest[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as DeliveryRequest,
        id: doc.id
      }));
      setConfirmedOrders(orders);
    } catch (error) {
      console.error('Error fetching confirmed orders:', error);
      setError('Failed to fetch confirmed orders. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center p-4">Loading confirmed orders...</div>;
  if (error) return <div className="text-red-500 p-4">{error}</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-10">Confirmed Orders</h1>
      {confirmedOrders.length === 0 ? (
        <div className="bg-white p-4 rounded-md shadow-md">
          <p>No confirmed orders found.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {confirmedOrders.map((order) => (
            <div key={order.id} className="bg-white p-4 rounded-md shadow-md">
              <h2 className="text-lg font-semibold text-gray-900 mb-2">{order.Product}</h2>
              <p className="text-sm text-gray-600 mb-1">From: {order.Source}</p>
              <p className="text-sm text-gray-600 mb-1">To: {order.Destination}</p>
              <p className="text-sm text-gray-600 mb-1">Quantity: {order.Quantity}</p>
              <p className="text-sm text-gray-600 mb-1">Client Contact: {order['Client Contact']}</p>
              <p className="text-sm text-green-600 font-semibold mt-2">Status: {order.status}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ConfirmedOrders;