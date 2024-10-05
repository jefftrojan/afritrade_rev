import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface Delivery {
  id: string;
  Product: string;
  Quantity: number;
  "Client Contact": string;
  Date: Date;
  status?: string;
}

const Delivered = () => {
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
      const querySnapshot = await getDocs(collection(db, 'deliverystatus'));
      const deliveriesData: Delivery[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as Delivery,
        id: doc.id,
        Date: new Date(doc.data().Date.seconds * 1000), // Convert Firestore Timestamp to Date
        status: doc.data().status || 'Pending' // Default status if not present
      })).filter(delivery => delivery.status !== 'Delivered');
      setDeliveries(deliveriesData);
    } catch (error) {
      console.error('Error fetching deliveries:', error);
      setError('Failed to fetch deliveries. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'deliverystatus', id), { status: newStatus });
      if (newStatus === 'Delivered') {
        setDeliveries(prevDeliveries => prevDeliveries.filter(delivery => delivery.id !== id));
      } else {
        setDeliveries(prevDeliveries =>
          prevDeliveries.map(delivery =>
            delivery.id === id ? { ...delivery, status: newStatus } : delivery
          )
        );
      }
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error);
      setError(`Failed to update status to ${newStatus}. Please try again.`);
    }
  };

  if (isLoading) return <div className="text-center">Loading deliveries...</div>;
  if (error) return <div className="text-red-500 mb-4">{error}</div>;
  if (deliveries.length === 0) return <div className="text-center mt-8">No deliveries found.</div>;

  return (
    <div className="p-4">
      <ul className="bg-white p-4 text-gray-900 rounded-md shadow-md">
        {deliveries.map((delivery) => (
          <li key={delivery.id} className="mb-4 border-b pb-2">
            <h2 className="text-lg text-gray-500 font-semibold mb-2">{delivery.Product}</h2>
            <p>Quantity: {delivery.Quantity}</p>
            <p>Client Contact: {delivery['Client Contact']}</p>
            <p>Date: {delivery.Date.toLocaleDateString()}</p> {/* Format Date */}
            <p>Status: {delivery.status}</p>
            <div className="flex space-x-2 mt-2">
              <button
                onClick={() => handleStatusUpdate(delivery.id, 'Pending')}
                className={`px-3 py-1 rounded ${delivery.status === 'Pending' ? 'bg-yellow-500 text-white' : 'bg-gray-200'}`}
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusUpdate(delivery.id, 'In Transit')}
                className={`px-3 py-1 rounded ${delivery.status === 'In Transit' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
              >
                In Transit
              </button>
              <button
                onClick={() => handleStatusUpdate(delivery.id, 'Delivered')}
                className={`px-3 py-1 rounded ${delivery.status === 'Delivered' ? 'bg-green-500 text-white' : 'bg-gray-200'}`}
              >
                Delivered
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Delivered;