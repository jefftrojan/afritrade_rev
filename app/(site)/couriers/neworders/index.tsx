import React, { useState, useEffect } from 'react';
import { collection, getDocs, updateDoc, doc } from 'firebase/firestore';
import { db } from '@/utils/firebase';

interface DeliveryRequest {
  id: string;
  Product: string;
  Destination: string;
  Source: string;
  Quantity: number;
  "Client Contact": string;
  status?: string;
}

interface ChatMessage {
  role: 'user' | 'ai';
  content: string;
}

const NewOrders = () => {
  const [deliveryRequests, setDeliveryRequests] = useState<DeliveryRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDeliveryRequests();
  }, []);

  const fetchDeliveryRequests = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const querySnapshot = await getDocs(collection(db, 'delivery_requests'));
      const requests: DeliveryRequest[] = querySnapshot.docs.map(doc => ({
        ...doc.data() as DeliveryRequest,
        id: doc.id,
        status: doc.data().status || 'Pending'
      }));
      setDeliveryRequests(requests);
    } catch (error) {
      console.error('Error fetching delivery requests:', error);
      setError('Failed to fetch delivery requests. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatusUpdate = async (id: string, newStatus: string) => {
    try {
      await updateDoc(doc(db, 'delivery_requests', id), { status: newStatus });
      if (newStatus === 'AcceptedRequest') {
        setDeliveryRequests(prevRequests => prevRequests.filter(request => request.id !== id));
      } else {
        setDeliveryRequests(prevRequests =>
          prevRequests.map(request =>
            request.id === id ? { ...request, status: newStatus } : request
          )
        );
      }
    } catch (error) {
      console.error(`Error updating status to ${newStatus}:`, error);
      setError(`Failed to update status to ${newStatus}. Please try again.`);
    }
  };

  if (isLoading) return <div>Loading delivery requests...</div>;
  if (error) return <div>{error}</div>;
  if (deliveryRequests.length === 0) return <div>No delivery requests found.</div>;

  return (
    <div className="container mx-auto px-4 py-8 flex flex-col max-w-full">
      <div className="overflow-y-auto flex-grow">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {deliveryRequests.map((request) => (
            <DeliveryRequestCard
              key={request.id}
              request={request}
              onAccept={() => handleStatusUpdate(request.id, 'AcceptedRequest')}
              onDecline={() => handleStatusUpdate(request.id, 'Declined')}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

const DeliveryRequestCard: React.FC<{
  request: DeliveryRequest;
  onAccept: () => void;
  onDecline: () => void;
}> = ({ request, onAccept, onDecline }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [userInput, setUserInput] = useState('');

  const handleLegalInfoClick = () => {
    if (!isExpanded) {
      setChatMessages([{ role: 'ai', content: 'Hello! How can I assist you with legal information regarding this delivery request?' }]);
    }
    setIsExpanded(!isExpanded);
  };

  const handleSendMessage = async () => {
    if (userInput.trim()) {
      setChatMessages(prevMessages => [...prevMessages, { role: 'user', content: userInput }]);
      try {
        console.log('Sending request to AI...');
        const response = await fetch('https://af-rag.onrender.com/rag/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ user_input: userInput })
        });
        console.log('Received response:', response);
        if (response.ok) {
          const responseData = await response.json();
          console.log('Parsed response data:', responseData);
          if (responseData && responseData.response) {
            setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: responseData.response }]);
          } else {
            console.error('Unexpected response format:', responseData);
            setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: 'Sorry, I received an unexpected response. Please try again.' }]);
          }
        } else {
          console.error('Unexpected response status:', response.status);
          const errorMessage = await response.text();
          console.error('Response error message:', errorMessage);
          setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: `Sorry, I encountered an error: ${response.status}. ${errorMessage}` }]);
        }
      } catch (error) {
        console.error('Error interacting with AI:', error);
        setChatMessages(prevMessages => [...prevMessages, { role: 'ai', content: 'Sorry, I encountered an error. Please try again.' }]);
      }
      setUserInput('');
    }
  };

  return (
    <div className="bg-white shadow-xl rounded-lg overflow-hidden flex flex-col">
      <div className="p-4 flex-grow">
        <div className="flex justify-between items-center mb-2">
          <h2 className="text-xl font-semibold text-gray-700">{request.Product}</h2>
          <span className="px-2 py-1 bg-yellow-200 text-yellow-800 rounded-full text-xs font-semibold">
            {request.status}
          </span>
        </div>
        <p className="text-sm text-gray-600 mb-1">From: {request.Source}</p>
        <p className="text-sm text-gray-600 mb-1">To: {request.Destination}</p>
        <p className="text-sm text-gray-600 mb-1">Quantity: {request.Quantity}</p>
        <p className="text-sm text-gray-600 mb-4">Client Contact: {request['Client Contact']}</p>
        <button onClick={handleLegalInfoClick} className="text-blue-500 hover:underline block">
          Legal Info
        </button>
      </div>

      {isExpanded && (
        <div className="p-4 border-t">
          <div className="h-48 overflow-y-auto mb-4 bg-gray-100 p-2 rounded">
            {chatMessages.map((msg, index) => (
              <div key={index} className={`mb-2 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                <span className={`inline-block p-2 rounded ${msg.role === 'user' ? 'bg-gray-500 text-black' : 'bg-gray-500'}`}>
                  {msg.content}
                </span>
              </div>
            ))}
          </div>
          <div className="flex">
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              className="flex-grow border text-black rounded-l px-2 py-1"
              placeholder="Type your message..."
            />
            <button
              onClick={handleSendMessage}
              className="bg-green-500 text-white px-4 py-1 rounded-r"
            >
              Send
            </button>
          </div>
        </div>
      )}

      <div className="bg-gray-50 px-4 py-3 flex justify-between">
        <button
          onClick={onAccept}
          className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Accept
        </button>
        <button
          onClick={onDecline}
          className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded transition duration-300"
        >
          Decline
        </button>
      </div>
    </div>
  );
};

export default NewOrders;