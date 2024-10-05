'use client'
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaGlobe, FaInfoCircle, FaAddressCard, FaArrowLeft, FaBuilding, FaUpload } from 'react-icons/fa';

interface BusinessProfileProps {
  business: {
    id: number;
    name: string;
    image: string;
    location: string;
    description: string;
    phone: string;
    email: string;
    website: string;
    established: string;
    industry: string;
  };
}

const BusinessProfile: React.FC<BusinessProfileProps> = ({ business: initialBusiness }) => {
  const [activeTab, setActiveTab] = useState<'info' | 'contact'>('info');
  const router = useRouter();
  const [business, setBusiness] = useState(initialBusiness);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const storedBusiness = localStorage.getItem('businessProfile');
    if (storedBusiness) {
      setBusiness(JSON.parse(storedBusiness));
    }
  }, []);

  const handleBackToHome = () => {
    const referrer = document.referrer;
    if (referrer.includes('/suppliers')) {
      router.push('/suppliers');
    } else if (referrer.includes('/businesses')) {
      router.push('/businesses');
    } else {
      router.push('/businesses'); // Default to home if referrer is unknown
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const imageDataUrl = reader.result as string;
        updateBusiness({ image: imageDataUrl });
      };
      reader.readAsDataURL(file);
    }
  };

  const updateBusiness = (updates: Partial<BusinessProfileProps['business']>) => {
    const updatedBusiness = { ...business, ...updates };
    setBusiness(updatedBusiness);
    localStorage.setItem('businessProfile', JSON.stringify(updatedBusiness));
  };

  const handleEdit = () => {
    if (isEditing) {
      localStorage.setItem('businessProfile', JSON.stringify(business));
    }
    setIsEditing(!isEditing);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-800 via-green-600 to-green-400 p-8">
      <button
        className="mb-8 px-6 py-3 bg-white text-green-600 rounded-full flex items-center shadow-lg hover:bg-green-100 transition-colors"
        onClick={handleBackToHome}
      >
        <FaArrowLeft className="mr-2" />
        Back
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden">
        <div className="flex flex-col lg:flex-row">
          <div className="lg:w-2/5 p-8">
            <div className="relative w-full h-96 lg:h-full rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={business.image}
                alt={business.name}
                layout="fill"
                objectFit="cover"
              />
              <label className="absolute bottom-4 right-4 bg-green-600 text-white p-2 rounded-full cursor-pointer hover:bg-green-700 transition-colors">
                <FaUpload />
                <input type="file" className="hidden" onChange={handleImageUpload} accept="image/*" />
              </label>
            </div>
          </div>
          
          <div className="lg:w-3/5 p-8">
            {isEditing ? (
              <input
                type="text"
                value={business.name}
                onChange={(e) => updateBusiness({ name: e.target.value })}
                className="text-5xl font-bold mb-4 text-green-600 dark:text-green-400 bg-transparent border-b border-green-600 focus:outline-none w-full"
              />
            ) : (
              <h1 className="text-5xl font-bold mb-4 text-green-600 dark:text-green-400">
                {business.name}
              </h1>
            )}
            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8">
              <FaMapMarkerAlt className="inline mr-2 text-green-500" />
              {isEditing ? (
                <input
                  type="text"
                  value={business.location}
                  onChange={(e) => updateBusiness({ location: e.target.value })}
                  className="bg-transparent border-b border-green-600 focus:outline-none"
                />
              ) : (
                business.location
              )}
            </p>
            
            <div className="flex space-x-4 mb-8">
              <button
                className={`py-3 px-8 rounded-full transition-colors flex items-center text-lg ${
                  activeTab === 'info'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('info')}
              >
                <FaInfoCircle className="mr-2" /> Information
              </button>
              <button
                className={`py-3 px-8 rounded-full transition-colors flex items-center text-lg ${
                  activeTab === 'contact'
                    ? 'bg-green-600 text-white'
                    : 'bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                }`}
                onClick={() => setActiveTab('contact')}
              >
                <FaAddressCard className="mr-2" /> Contact
              </button>
            </div>
            
            <div className="space-y-6">
              {activeTab === 'info' && (
                <div>
                  <h2 className="text-3xl font-semibold mb-4 text-gray-800 dark:text-white">About Us</h2>
                  {isEditing ? (
                    <textarea
                      value={business.description}
                      onChange={(e) => updateBusiness({ description: e.target.value })}
                      className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6 w-full h-32 bg-transparent border border-green-600 focus:outline-none p-2"
                    />
                  ) : (
                    <p className="text-xl text-gray-600 dark:text-gray-300 leading-relaxed mb-6">{business.description}</p>
                  )}
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <FaBuilding className="text-green-600 mr-3" size={24} />
                      <span className="text-lg text-gray-700 dark:text-gray-300">
                        Established: {isEditing ? (
                          <input
                            type="text"
                            value={business.established}
                            onChange={(e) => updateBusiness({ established: e.target.value })}
                            className="bg-transparent border-b border-green-600 focus:outline-none"
                          />
                        ) : (
                          business.established
                        )}
                      </span>
                    </div>
                    <div className="flex items-center">
                      <FaGlobe className="text-green-600 mr-3" size={24} />
                      <span className="text-lg text-gray-700 dark:text-gray-300">
                        Industry: {isEditing ? (
                          <input
                            type="text"
                            value={business.industry}
                            onChange={(e) => updateBusiness({ industry: e.target.value })}
                            className="bg-transparent border-b border-green-600 focus:outline-none"
                          />
                        ) : (
                          business.industry
                        )}
                      </span>
                    </div>
                  </div>
                </div>
              )}
              {activeTab === 'contact' && (
                <div className="space-y-6">
                  {[
                    { icon: FaPhone, key: 'phone' },
                    { icon: FaEnvelope, key: 'email' },
                    { icon: FaGlobe, key: 'website' },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className="flex items-center bg-gray-100 dark:bg-gray-700 p-6 rounded-xl transition-colors hover:bg-green-100 dark:hover:bg-green-700"
                    >
                      <item.icon className="mr-4 text-green-600" size={28} />
                      {isEditing ? (
                        <input
                          type="text"
                          value={business[item.key as keyof typeof business]}
                          onChange={(e) => updateBusiness({ [item.key]: e.target.value })}
                          className="text-xl text-gray-800 dark:text-gray-200 bg-transparent border-b border-green-600 focus:outline-none"
                        />
                      ) : (
                        <span className="text-xl text-gray-800 dark:text-gray-200">{business[item.key as keyof typeof business]}</span>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <button
        className="mt-8 px-6 py-3 bg-green-600 text-white rounded-full shadow-lg hover:bg-green-700 transition-colors"
        onClick={handleEdit}
      >
        {isEditing ? 'Save Changes' : 'Edit Profile'}
      </button>
    </div>
  );
};

// Assuming you have some business data, either fetched or passed as props
const businessData = {
  id: 1,
  name: "Green Tech Solutions",
  image: "/images/business-image.jpg", // Replace with actual image path
  location: "San Francisco, CA",
  description: "We are a leading provider of sustainable technology solutions, committed to creating a greener future through innovation and eco-friendly practices.",
  phone: "+1 (555) 123-4567",
  email: "contact@greentechsolutions.com",
  website: "www.greentechsolutions.com",
  established: "2010",
  industry: "Sustainable Technology"
};

const ProfilePage = () => {
  return (
    <BusinessProfile business={businessData} />
  );
};

export default ProfilePage;