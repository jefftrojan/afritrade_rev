import React, { useState, useEffect } from 'react';
import { FiEdit } from 'react-icons/fi';
import CustomButton from '@/components/general/Button';
import FileUploadComponent from '@/components/couriers/FileUploadComponent';
import { db, auth, storage } from '@/utils/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({ name: '', email: '', license: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (auth.currentUser) {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setUserInfo({
            name: userData.name || '',
            email: userData.email || '',
            license: userData.license || '',
          });
        } else {
          await setDoc(userDocRef, {
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            license: '',
          });
          setUserInfo({
            name: auth.currentUser.displayName || '',
            email: auth.currentUser.email || '',
            license: '',
          });
        }
      }
      setLoading(false);
    };

    fetchUserProfile();
  }, []);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSubmit = async () => {
    if (auth.currentUser) {
      try {
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, userInfo);
        setIsEditing(false);
        console.log('Profile updated successfully');
      } catch (error) {
        console.error('Error updating profile:', error);
      }
    }
  };

  const handleLicenseUpload = async (file: File) => {
    if (auth.currentUser) {
      try {
        const storageRef = ref(storage, `licenses/${auth.currentUser.uid}/${file.name}`);
        await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(storageRef);
        
        const userDocRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userDocRef, { license: downloadURL });
        
        setUserInfo(prevInfo => ({ ...prevInfo, license: downloadURL }));
        console.log('License uploaded successfully');
      } catch (error) {
        console.error('Error uploading license:', error);
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-4 w-full max-w-3xl mx-auto lg:flex lg:space-x-8">
      <div className="flex-1 space-y-4 sm:space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">General Information</h2>
          {!isEditing && (
            <FiEdit
              className="cursor-pointer text-black hover:text-gray-700 text-2xl sm:text-3xl"
              onClick={handleEdit}
            />
          )}
        </div>
        <div className="space-y-4">
          <div>
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 border border-gray-300 rounded-lg text-base sm:text-lg"
                value={userInfo.name}
                onChange={(e) => setUserInfo({ ...userInfo, name: e.target.value })}
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800">{userInfo.name}</p>
            )}
          </div>
          <div>
            {isEditing ? (
              <input
                type="email"
                className="w-full p-2 border border-gray-300 rounded-lg text-base sm:text-lg"
                value={userInfo.email}
                onChange={(e) => setUserInfo({ ...userInfo, email: e.target.value })}
              />
            ) : (
              <p className="text-base sm:text-lg text-gray-800">{userInfo.email}</p>
            )}
          </div>
          {isEditing && (
            <CustomButton
              onClick={handleSubmit}
              className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg text-base sm:text-lg mt-4"
            >
              Save Changes
            </CustomButton>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-4">Business License</h2>
          {userInfo.license ? (
            <div className="space-y-4">
              <a 
                href={userInfo.license} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-indigo-600 hover:text-indigo-800"
              >
                View Current License
              </a>
              <p className="text-sm text-gray-600">To update your license, upload a new file below:</p>
              <FileUploadComponent onFileUpload={handleLicenseUpload} />
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-red-600">Please upload your business license</p>
              <FileUploadComponent onFileUpload={handleLicenseUpload} />
            </div>
          )}
        </div>
      </div>

      {/* Snapshot of the document */}
      {userInfo.license && (
        <div className="flex-none w-[200px] bg-gray-100 p-4 rounded-md shadow-md lg:w-[300px]">
          <img src={userInfo.license} alt="Document Snapshot" className="w-full h-auto" />
        </div>
      )}
    </div>
  );
};

export default Profile;