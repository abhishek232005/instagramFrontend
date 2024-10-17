import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import Cookies from 'js-cookie';
import React, { useRef, useState } from 'react';
import { Button } from 'react-bootstrap';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Select from 'react-select';
import SyncLoader from 'react-spinners/SyncLoader';
import { toast } from 'react-toastify';
import { setAuthUser } from '../redux/authSlice';

const EditProfile = () => {
  const { user } = useSelector((store) => store.auth);
  const imageRef = useRef();
  const [selectedGender, setSelectedGender] = useState(
    user?.gender ? { value: user?.gender, label: capitalizeFirstLetter(user?.gender) } : null
  );
  const [bio, setBio] = useState(user?.bio || '');
  const [loading, setLoading] = useState(false);
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || null); // Initialize with user's photo or null
  const [previewImage, setPreviewImage] = useState(user?.profilePhoto || ''); // Preview image
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Gender options for the select dropdown
  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'other', label: 'Other' },
    { value: 'prefer_not_to_say', label: 'Prefer not to say' },
  ];

  // Capitalize first letter utility
  const capitalizeFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

  // Handle profile submission
  const editProfileHandler = async () => {
    setLoading(true); // Show loader when submitting

    const formData = new FormData();
    formData.append('bio', bio);
    formData.append('gender', selectedGender?.value);
    if (profilePhoto) formData.append('profilePhoto', profilePhoto);

    try {
      const token = Cookies.get('accesstoken');
      const headers = {token}

      // Send the form data to the backend (replace with actual endpoint)
      const response = await axios.post('http://localhost:4000/api/profile/edit', formData, { headers });

      if (response.data.success) {
        const updatedData = {
          ...user,
          bio: response.data.user?.bio,
          profilePhoto: response.data.user?.profilePhoto,
          gender: response.data.user?.gender,
        };

        dispatch(setAuthUser(updatedData));
        navigate(`/profile/${user?._id}`);
        toast.success(response.data.message);
      }

      setLoading(false); // Hide loader
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
      setLoading(false); // Hide loader on error
    }
  };

  // Handle profile photo change
  const handleProfilePhotoChange = (e) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      setProfilePhoto(file);
      setPreviewImage(URL.createObjectURL(file)); // Set preview of the image
    } else {
      toast.error('Please select a valid image file (jpeg, png, etc.)');
    }
  };

  return (
    <div className="max-w-xl mx-auto py-10 px-4">
      <section>
        {/* Title */}
        <h1 className="font-bold text-2xl mb-6 text-gray-800 flex items-center">
          ✏️ Edit Profile
        </h1>

        {/* Profile Info */}
        <div className="flex items-center gap-4 bg-white shadow-md p-4 rounded-lg">
          {/* Avatar */}
          <Avatar className="w-24 h-24 rounded-full border-2 border-gray-300 shadow-lg hover:scale-105 transition-transform duration-200 ease-in-out overflow-hidden">
            <AvatarImage
              src={previewImage} // Show the preview image or the existing profile photo
              alt={user?.username || 'Profile Photo'}
              className="w-full h-full object-cover"
            />
            <AvatarFallback className="bg-gray-500 text-white text-lg font-semibold">
              {user?.username?.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>

          {/* Username and Bio */}
          <div className="flex flex-col justify-center">
            <h5 className="text-xl font-semibold text-gray-900 hover:underline transition-colors flex items-center">
              {user?.username || 'Username'} 👤
            </h5>
            <p className="text-sm text-gray-500 mt-1">{user?.bio || 'This is your bio... ✍️'}</p>
          </div>

          {/* Change Photo Button */}
          <div className="ml-auto">
            <input
              ref={imageRef}
              type="file"
              className="hidden"
              id="profile-photo"
              onChange={handleProfilePhotoChange}
            />
            <label htmlFor="profile-photo">
              <Button
                onClick={() => imageRef?.current.click()}
                variant="primary"
                className="px-3 py-1 flex items-center bg-[#0095F6] h-8 hover:bg-[#318bc7]"
              >
                📸 Change Photo
              </Button>
            </label>
          </div>
        </div>

        {/* Bio Section */}
        <div className="mt-6">
          <h1 className="font-semibold text-lg text-gray-800 mb-2">Bio</h1>
          <textarea
            className="w-full p-3 border rounded-lg shadow-sm bg-gray-100 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-colors duration-150"
            rows="4"
            placeholder="Tell us about yourself... ✍️"
            value={bio}
            onChange={(e) => setBio(e.target.value)}
          />
        </div>

        {/* Gender Selection */}
        <div className="mt-6">
          <h1 className="font-bold text-lg text-gray-800 mb-2">Gender</h1>
          <Select
            options={genderOptions}
            value={selectedGender}
            onChange={setSelectedGender}
            placeholder="Select your gender"
            className="w-full"
          />
        </div>

        {/* Submit Button */}
        <div className="mt-6 flex justify-center">
          {loading ? (
            <SyncLoader color="#0095F6" />
          ) : (
            <button
              className="px-6 py-2 bg-[#0095F6] text-white font-semibold rounded-md hover:bg-[#318bc7] transition-colors"
              onClick={editProfileHandler}
            >
              Submit
            </button>
          )}
        </div>
      </section>
    </div>
  );
};

export default EditProfile;
