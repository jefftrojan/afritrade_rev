'use client';

import { useState, useEffect, SetStateAction } from 'react';
import { useRouter } from 'next/navigation';
import { FaBuilding, FaUser, FaLock, FaTruck, FaBox, FaEnvelope, FaUserCircle, FaCity, FaEye, FaEyeSlash, FaSpinner } from 'react-icons/fa';

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [name, setName] = useState('');
  const [organizationName, setOrganizationName] = useState('');
  const [role, setRole] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [showRolePopup, setShowRolePopup] = useState(false);
  const [slideDirection, setSlideDirection] = useState('');
  const [location, setLocation] = useState('');
  const [businessType, setBusinessType] = useState('');
  const [tradeFocus, setTradeFocus] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [productCategories, setProductCategories] = useState<string[]>([]);
  const [capacity, setCapacity] = useState('');
  const [transportModes, setTransportModes] = useState<string[]>([]);
  const [regionsCovered, setRegionsCovered] = useState<string[]>([]);
  const [registrationStep, setRegistrationStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [user_id, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    setSlideDirection(isSignUp ? 'slide-left' : 'slide-right');
  }, [isSignUp]);

  const getRegistrationEndpoint = (role: string) => {
    switch (role) {
      case 'business':
        return 'http://localhost:8000/register/client/';
      case 'supplier':
        return 'http://localhost:8000/register/supplier/';
      case 'courier':
        return 'http://localhost:8000/register/transporter/';
      default:
        throw new Error('Unknown role');
    }
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (isSignUp && registrationStep === 1) {
      if (password !== confirmPassword) {
        setErrorMessage("Passwords don't match");
        return;
      }
      // All validations passed, move to next step
      setShowRolePopup(true);
      // Don't increment registrationStep here, it will be done when a role is selected
    }
  };

  const saveUserToLocalStorage = (user: { name: string; email: string; role: string, user_id: string }) => {
    try {
      localStorage.setItem('user', JSON.stringify(user));
      console.log('User saved to localStorage:', user);
    } catch (error) {
      console.error('Error saving user to localStorage:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);
    
    try {
      let response;
      let userData;

      if (isSignUp && registrationStep === 2) {
        // Registration logic
        const endpoint = getRegistrationEndpoint(role);
        let body;
        switch (role) {
          case 'business':
            body = JSON.stringify({ name, email, password, location, business_type: businessType, trade_focus: tradeFocus });
            break;
          case 'supplier':
            body = JSON.stringify({ name, email, password, company_name: companyName, location, product_categories: productCategories, capacity: parseInt(capacity) });
            break;
          case 'courier':
            body = JSON.stringify({ name, email, password, location, transport_modes: transportModes, regions_covered: regionsCovered });
            break;
        }

        response = await fetch(endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: body,
        });
      } else if (!isSignUp) {
        // Login logic
        response = await fetch('http://localhost:8000/login/', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
      } else {
        throw new Error('Invalid state');
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || 'An error occurred');
      }

      userData = await response.json();
      console.log('Server response:', userData);

      let userId;
      let userType;

      if (userData.client_id) {
        userId = userData.client_id;
        userType = 'client';
      } else if (userData.supplier_id) {
        userId = userData.supplier_id;
        userType = 'supplier';
      } else if (userData.transporter_id) {
        userId = userData.transporter_id;
        userType = 'transporter';
      }

      if (userId) {
        // Save the user_id and user_type to localStorage
        localStorage.setItem('user_id', userId);
        localStorage.setItem('user_type', userType);
        
        console.log(`Registration successful! ${userType.charAt(0).toUpperCase() + userType.slice(1)} ID saved.`);
      } else {
        console.error('Registration successful, but no user ID received.');
      }

      // Save user data to local storage
      const userToSave = {
        user_id: userId,
        name: userData.name || name,
        email: userData.email || email,
        role: isSignUp ? role : userData.role // Use selected role for signup, server response for login
      };
      saveUserToLocalStorage(userToSave);

      // Redirect based on user role
      switch(userToSave.role) {
        case 'business':
          router.push('/businesses');
          break;
        case 'supplier':
          router.push('/suppliers');
          break;
        case 'courier':
          router.push('/courier');
          break;
        default:
          console.warn('Unknown user role:', userToSave.role);
          router.push('/');
      }
    } catch (error) {
      console.error('Error:', error);
      setErrorMessage(error.message || 'An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (selectedRole: string) => {
    setRole(selectedRole);
    setShowRolePopup(false);
    setRegistrationStep(2);
  };

  const toggleSignUp = () => {
    setIsSignUp(!isSignUp);
    setShowRolePopup(false);
    setRole('');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-800 via-green-600 to-green-400">
      {showRolePopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-green-800 p-12 rounded-lg shadow-xl">
            <h3 className="text-3xl font-bold mb-6 text-green-100">Select Your Account Type</h3>
            <div className="grid grid-cols-3 gap-6">
              <button
                onClick={() => handleRoleSelect('business')}
                className="bg-green-600 text-green-100 py-6 px-8 rounded-lg hover:bg-green-500 transition duration-300 flex items-center justify-center space-x-2"
              >
                <FaBuilding className="h-10 w-10" />
                <span>Business</span>
              </button>
              <button
                onClick={() => handleRoleSelect('supplier')}
                className="bg-green-600 text-green-100 py-5 px-6 rounded-lg hover:bg-green-500 transition duration-300"
              >
                <FaBox className="h-8 w-8 mb-1" />
                Supplier
              </button>
              <button
                onClick={() => handleRoleSelect('courier')}
                className="bg-green-600 text-green-100 py-5 px-6 rounded-lg hover:bg-green-500 transition duration-300"
              >
                <FaTruck className="h-8 w-8 mb-1" />
                Courier
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="bg-green-900 bg-opacity-80 p-12 rounded-2xl shadow-lg backdrop-filter backdrop-blur-lg border border-green-700 border-opacity-30 w-[500px] z-40">
        <h2 className={`text-5xl font-bold mb-10 text-green-100 text-center transition-all duration-500 ${slideDirection}`}>
          {isSignUp ? 'Create Account' : 'Welcome Back'}
        </h2>
        {errorMessage && (
          <div className="bg-red-500 text-white p-3 rounded-lg mb-4">
            {errorMessage}
          </div>
        )}
        <form onSubmit={isSignUp && registrationStep === 1 ? handleNext : handleSubmit} className="space-y-6">
          {isSignUp && registrationStep === 1 && (
            <>
              <div>
                <label htmlFor="name" className="block mb-2 text-lg font-medium text-green-100">Name</label>
                <input
                  type="text"
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your name"
                />
              </div>
              <div>
                <label htmlFor="email" className="block mb-2 text-lg font-medium text-green-100">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label htmlFor="location" className="block mb-2 text-lg font-medium text-green-100">Location</label>
                <input
                  type="text"
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your location"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-lg font-medium text-green-100">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-green-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
              <div className="relative">
                <label htmlFor="confirmPassword" className="block mb-2 text-lg font-medium text-green-100">Confirm Password</label>
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Confirm your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-green-100"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}
          {isSignUp && registrationStep === 2 && (
            <>
              {role === 'business' && (
                <>
                  <div>
                    <label htmlFor="businessType" className="block mb-2 text-lg font-medium text-green-100">Business Type</label>
                    <select
                      id="businessType"
                      value={businessType}
                      onChange={(e) => setBusinessType(e.target.value)}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                    >
                      <option value="">Select business type</option>
                      <option value="SME">SME</option>
                      <option value="exporter">Exporter</option>
                      <option value="manufacturer">Manufacturer</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="tradeFocus" className="block mb-2 text-lg font-medium text-green-100">Trade Focus</label>
                    <input
                      type="text"
                      id="tradeFocus"
                      value={tradeFocus}
                      onChange={(e) => setTradeFocus(e.target.value)}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Products you deal in"
                    />
                  </div>
                </>
              )}
              {role === 'supplier' && (
                <>
                  <div>
                    <label htmlFor="companyName" className="block mb-2 text-lg font-medium text-green-100">Company Name</label>
                    <input
                      type="text"
                      id="companyName"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Enter your company name"
                    />
                  </div>
                  <div>
                    <label htmlFor="productCategories" className="block mb-2 text-lg font-medium text-green-100">Product Categories</label>
                    <input
                      type="text"
                      id="productCategories"
                      value={productCategories.join(', ')}
                      onChange={(e) => setProductCategories(e.target.value.split(', '))}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Enter product categories (comma-separated)"
                    />
                  </div>
                  <div>
                    <label htmlFor="capacity" className="block mb-2 text-lg font-medium text-green-100">Capacity</label>
                    <input
                      type="number"
                      id="capacity"
                      value={capacity}
                      onChange={(e) => setCapacity(e.target.value)}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Max orders you can handle"
                    />
                  </div>
                </>
              )}
              {role === 'courier' && (
                <>
                  <div>
                    <label htmlFor="transportModes" className="block mb-2 text-lg font-medium text-green-100">Transport Modes</label>
                    <input
                      type="text"
                      id="transportModes"
                      value={transportModes.join(', ')}
                      onChange={(e) => setTransportModes(e.target.value.split(', '))}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Enter transport modes (comma-separated)"
                    />
                  </div>
                  <div>
                    <label htmlFor="regionsCovered" className="block mb-2 text-lg font-medium text-green-100">Regions Covered</label>
                    <input
                      type="text"
                      id="regionsCovered"
                      value={regionsCovered.join(', ')}
                      onChange={(e) => setRegionsCovered(e.target.value.split(', '))}
                      className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                      required
                      placeholder="Enter regions covered (comma-separated)"
                    />
                  </div>
                </>
              )}
            </>
          )}
          {!isSignUp && (
            <>
              <div>
                <label htmlFor="email" className="block mb-2 text-lg font-medium text-green-100">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your email"
                />
              </div>
              <div className="relative">
                <label htmlFor="password" className="block mb-2 text-lg font-medium text-green-100">Password</label>
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-green-800 bg-opacity-50 text-green-100 rounded-lg focus:outline-none"
                  required
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-10 text-green-100"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </>
          )}
          <button
            type="submit"
            className="w-full py-4 bg-green-700 text-green-100 font-semibold rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <FaSpinner className="animate-spin mr-2" />
                {isSignUp ? 'Processing...' : 'Signing In...'}
              </>
            ) : (
              isSignUp ? (registrationStep === 1 ? 'Next' : 'Sign Up') : 'Sign In'
            )}
          </button>
          <div className="text-center text-green-200">
            {isSignUp ? (
              <>
                Already have an account?{' '}
                <span className="text-green-300 hover:underline cursor-pointer" onClick={toggleSignUp}>
                  Sign in
                </span>
              </>
            ) : (
              <>
                Don't have an account?{' '}
                <span className="text-green-300 hover:underline cursor-pointer" onClick={toggleSignUp}>
                  Sign up
                </span>
              </>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

export default AuthPage;