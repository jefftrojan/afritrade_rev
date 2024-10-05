import React, { useState, useEffect } from 'react';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface Delivery {
  id: string;
  Product: string;
  Quantity: number;
  "Client Contact": string;
  Date: Date;
  status?: string;
}

const DeliveryStatus = () => {
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const q = query(
        collection(db, 'deliverystatus'),
        where('status', '==', 'Delivered')
      );
      const querySnapshot = await getDocs(q);
      const deliveriesData: Delivery[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as Delivery,
        id: doc.id,
        Date: new Date(doc.data().Date.seconds * 1000) // Convert Firestore Timestamp to Date
      }));
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to fetch deliveries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div className="text-center">Loading deliveries...</div>;
  if (error) return <div className="text-red-500 mb-4">{error}</div>;
  if (deliveries.length === 0) return <div className="text-center mt-8">No delivered requests found.</div>;

  return (
    <div className="p-4">
      <h1 className="text-2xl text-gray-900 font-bold mb-4">Delivered Requests</h1>
      <ul className="bg-white p-4 rounded-md shadow-md text-gray-500">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="mb-4 border-b pb-2">
            <h2 className="text-lg font-semibold mb-2">{delivery.Product}</h2>
            <p>Quantity: {delivery.Quantity}</p>
            <p>Client Contact: {delivery['Client Contact']}</p>
            <p>Date: {delivery.Date.toLocaleDateString()}</p> {/* Format Date */}
            <p>Status: Delivered</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default DeliveryStatus;