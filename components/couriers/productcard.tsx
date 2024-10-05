import React, { useState } from 'react';
import { FiInfo, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface ProductCardProps {
  product: {
    id: string;
    name: string;
    description: string;
    origin: string;
    destination: string;
    status: string;
    clientcontact: number;
    // Add other relevant fields
  };
  onAccept: (productId: string) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, onAccept }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTab, setActiveTab] = useState<'description' | 'legal'>('description');

  const handleAccept = async () => {
    try {
      const productRef = doc(db, 'delivery_requests', product.id);
      await updateDoc(productRef, { status: 'Accepted' });
      onAccept(product.id);
    } catch (error) {
      console.error('Error accepting delivery request:', error);
    }
  };

  const getLegalInfo = () => {
    // This is a placeholder. In a real application, you would call an AI service here.
    return `Legal information for transporting ${product.name} from ${product.origin} to ${product.destination}.`;
  };

  return (
    <div className="border rounded-lg shadow-sm mb-4">
      <div className="p-4 flex justify-between items-center">
        <h3 className="text-lg font-semibold">{product.name}</h3>
        <button onClick={() => setIsExpanded(!isExpanded)} className="text-gray-500 hover:text-gray-700">
          <FiInfo size={20} />
        </button>
      </div>
      {isExpanded && (
        <div className="p-4 border-t">
          <div className="flex mb-4">
            <button
              className={`mr-4 ${activeTab === 'description' ? 'text-blue-600 font-semibold' : 'text-gray-600'}`}
              onClick={() => setActiveTab('description')}
            >
              Description
            </button>
            <button
              className={activeTab === 'legal' ? 'text-blue-600 font-semibold' : 'text-gray-600'}
              onClick={() => setActiveTab('legal')}
            >
              Legal Information
            </button>
          </div>
          <div className="mb-4">
            {activeTab === 'description' ? (
              <div>
                <p><strong>Description:</strong> {product.description}</p>
                <p><strong>Origin:</strong> {product.origin}</p>
                <p><strong>Destination:</strong> {product.destination}</p>
                {/* Add other relevant product information here */}
              </div>
            ) : (
              <p>{getLegalInfo()}</p>
            )}
          </div>
          <button
            onClick={handleAccept}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
          >
            Accept Delivery Request
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
