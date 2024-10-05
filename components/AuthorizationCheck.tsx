import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

const AuthorizationCheck: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [showModal, setShowModal] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuthorization = async () => {
      const hasLicense = false; // Update this with actual logic
      if (!hasLicense && router.pathname !== '/couriers/profile') {
        setShowModal(true);
      }
    };

    checkAuthorization();
  }, [router.pathname]);

  const handleRedirect = () => {
    setShowModal(false);
    router.push('/couriers/profile');
  };

  if (showModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white p-6 rounded-lg max-w-md w-full">
          <h2 className="text-xl font-bold mb-4">Authorization Required</h2>
          <p className="mb-4">Unable to authorize access to other sections. Verify identity by uploading a valid and up-to-date business license.</p>
          <button onClick={handleRedirect} className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700">
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthorizationCheck;