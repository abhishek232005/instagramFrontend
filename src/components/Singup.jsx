import axios from 'axios';
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Cookies from 'js-cookie';
import { useSelector } from 'react-redux';

const Signup = () => {
  const [loading, setLoading] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm();
  const navigate = useNavigate();
 const {user}  = useSelector(store=>store.auth)
  const signupSubmit = async (data) => {
    console.log(data);
    // Uncomment this block to use the actual submission logic
    try {
      setLoading(true);
      const response = await axios.post("http://localhost:4000/api/register", data, );
      if (response.data.success) {
        toast.success(response.data.message);
        navigate('/login');
        Cookies.set('token', response.data.token, { expires: 7 });
        Cookies.get('token',response.data.token, {expires:7})
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message);
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
      <form className="bg-white shadow-lg rounded-lg p-8 max-w-lg w-full" onSubmit={handleSubmit(signupSubmit)}>
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">LoGo</h1>
          <p className="text-gray-500">Signup to see photos & videos from your friends</p>
        </div>

        {/* Username Field */}
        <div className="mb-4">
          <label htmlFor="username" className="block text-gray-600 font-medium mb-1">Username</label>
          <input
            type="text"
            className={`w-full border ${errors.username ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            name="username"
            {...register("username", {
              required: 'Username is required',
              setValueAs: val => val.trim(),
            })}
            placeholder="Enter Username"
            id="username"
          />
          {errors?.username && <span className="text-red-500 text-sm">{errors?.username?.message}</span>}
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label htmlFor="email" className="block text-gray-600 font-medium mb-1">Email</label>
          <input
            type="email"
            className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            name="email"
            {...register("email", {
              required: 'Email is required',
              setValueAs: val => val.trim(),
            })}
            placeholder="Enter Email"
            id="email"
          />
          {errors?.email && <span className="text-red-500 text-sm">{errors?.email?.message}</span>}
        </div>

        {/* Password Field */}
        <div className="mb-4">
          <label htmlFor="password" className="block text-gray-600 font-medium mb-1">Password</label>
          <input
            type="password"
            className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400`}
            name="password"
            {...register("password", {
              required: 'Password is required',
              setValueAs: val => val.trim(),
            })}
            placeholder="Enter Password"
            id="password"
          />
          {errors?.password && <span className="text-red-500 text-sm">{errors?.password?.message}</span>}
        </div>

        {/* Submit Button */}
        {
          loading ? (
            <div className="flex justify-center">
              <div className="spinner-border text-blue-500" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          ) : (
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 rounded-lg transition duration-300"
            >
              Signup
            </button>
          )
        }

        {/* Redirect to Login */}
        <div className="mt-4 text-center">
          <span className="text-gray-600">Already have an account? </span>
          <Link to='/login' className="text-blue-600 font-medium">Login</Link>
        </div>
      </form>

     
    </div>
  );
};

export default Signup;
