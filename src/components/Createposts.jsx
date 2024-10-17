import React, { useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@radix-ui/react-avatar';
import axios from 'axios';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';
import { useDispatch, useSelector } from 'react-redux';
import { setPosts } from '../redux/postSlice';

const Createposts = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState('');
  const [caption, setCaption] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { post_find } = useSelector((store) => store.post);

  const createPostHandler = async (e) => {
    e.preventDefault();
    const formdata = new FormData();
    formdata.append('caption', caption);
    if (file) formdata.append('image', file);

    const token = Cookies.get('accesstoken');
    const headers = { token };

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:4000/api/addpost', formdata, {
        headers,
      });

      if (response.data.success) {
        dispatch(setPosts([response.data.post, ...post_find]));
        toast.success(response.data.message);
        setOpen(false);
      }

      setOpen(false);
    } catch (error) {
      toast.error(error.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUploadClick = () => {
    imageRef.current.click();
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target?.files[0];
    if (selectedFile) {
      setFile(selectedFile);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  return (
    <>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-8 relative">
            <button
              className="absolute top-3 right-3 text-gray-600 hover:text-gray-900"
              onClick={() => setOpen(false)}
            >
              &times;
            </button>

            <div className="flex flex-col items-center mb-4">
              <Avatar className="w-24 h-24">
                <AvatarImage
                  src={user?.profilePhoto}
                  alt="Profile"
                  className="w-full h-full object-cover rounded-full"
                />
                <AvatarFallback className="bg-gray-300 text-gray-600 font-semibold">
                  {user?.username}
                </AvatarFallback>
              </Avatar>
              <div className="text-center mt-3">
                <h1 className="font-bold text-xl text-gray-800">{user?.username || 'Username'}</h1>
                <p className="text-gray-500">Bio goes here...</p>
              </div>
            </div>

            <form onSubmit={createPostHandler} className="space-y-6">
              <div>
                <textarea
                  rows={4}
                  placeholder="What's on your mind?"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  value={caption}
                  onChange={(e) => setCaption(e.target.value)}
                  required
                />
              </div>

              {imagePreview && (
                <div className="w-full flex justify-center mb-4">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-32 h-32 object-cover rounded-lg shadow-md"
                  />
                </div>
              )}

              <div className="flex justify-center mb-4">
                <input
                  ref={imageRef}
                  type="file"
                  className="hidden"
                  id="file-upload"
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={handleFileUploadClick}
                  className="w-full max-w-xs bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
                >
                  {file ? 'Change Image' : 'Select an Image'}
                </button>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="bg-gray-400 hover:bg-gray-500 text-white py-2 px-6 rounded-lg transition duration-300"
                  disabled={loading}
                >
                  Cancel
                </button>

                {loading ? (
                  <button
                    type="button"
                    disabled
                    className="flex items-center bg-blue-600 text-white py-2 px-6 rounded-lg transition duration-300"
                  >
                    <svg
                      className="animate-spin h-5 w-5 mr-2 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      ></path>
                    </svg>
                    Posting...
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="bg-green-500 hover:bg-green-600 text-white py-2 px-6 rounded-lg transition duration-300"
                  >
                    Post
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Createposts;
