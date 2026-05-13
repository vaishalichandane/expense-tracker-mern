import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../services/api';

function LoginPage() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      email: '',
      password: '',
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });

  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await API.post(
        '/auth/login',
        formData
      );

      localStorage.setItem(
        'token',
        res.data.token
      );

      alert('Login Successful');

      navigate('/dashboard');

    } catch (error) {

      alert('Invalid Email or Password');

      console.log(error);

    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-96"
      >

        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Login
        </h2>

        <input
          type="email"
          name="email"
          placeholder="Email"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
        />

        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-lg"
        >
          Login
        </button>

        <p className="text-white mt-4 text-center">

          Don't have an account?

          <Link
            to="/register"
            className="text-blue-400 ml-2"
          >
            Register
          </Link>

        </p>

      </form>

    </div>

  );
}

export default LoginPage;