import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { setAuthUser } from '../redux/authSlice';
import Cookies from 'js-cookie';
import { useForm } from 'react-hook-form';

const Login = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const {user} = useSelector(store=>store.auth)
  
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();

  const loginHandler = async (data) => {
    // Extract email and password from the form data
    const { email, password } = data;

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:4000/api/login", 
        { email, password }, 
        {
          headers: { 'Content-Type': 'application/json' }
        }
      ); 

      if (response.data.success) {
        dispatch(setAuthUser(response.data.user));
        navigate('/');
        toast.success('User login in successfully!');
        Cookies.set("accesstoken", response.data?.token);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(()=>{
    if(user){
      navigate('/')
    }
  })

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full" onSubmit={handleSubmit(loginHandler)}>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LoGo</h1>
          <p className="text-gray-500">Login to see photos & videos from your friends</p>
        </div>

        {/* Email Input */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            type="email"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="email"
            {...register("email", {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Enter a valid email address"
              },
              setValueAs: val => val.trim(),
            })}
            placeholder="Enter Email"
            id="email"
          />
          {errors.email && <span className="text-red-500 text-sm">{errors.email.message}</span>}
        </div>

        {/* Password Input */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
          <input
            type="password"
            className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
            name="password"
            {...register("password", {
              required: 'Password is required',
              // minLength: {
              //   value: 6,
              //   message: "Password must be at least 6 characters"
              // },
              setValueAs: val => val.trim(),
            })}
            placeholder="Enter Password"
            id="password"
          />
          {errors.password && <span className="text-red-500 text-sm">{errors.password.message}</span>}
        </div>

        {/* Loading Indicator */}
        {loading ? (
          <div className="d-flex justify-content-center">
            <div className="spinner-border" role="status">
              <span className="sr-only">Loading...</span>
            </div>
          </div>
        ) : (
          <button
            type="submit"
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition duration-300"
          >
            Login
          </button>
        )}

        <div className="text-center mt-4">
          Don't have an account? <Link to='/signup' className="text-blue-600">Sign up</Link>
        </div>

        <div className="text-center mt-4">
           <Link to='/forgetpassword' className="text-blue-600">ForGetPassword</Link>
        </div>
      </form>
    </div>
  );
};

export default Login;
