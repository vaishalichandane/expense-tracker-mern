import { useState } from 'react';

import {
  Link,
  useNavigate,
} from 'react-router-dom';

import API from '../services/api';

function RegisterPage() {

  const navigate = useNavigate();

  const [formData, setFormData] =
    useState({
      name: '',
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
        '/auth/register',
        formData
      );

      localStorage.setItem(
        'token',
        res.data.token
      );

      alert('Registration Successful');

      navigate('/dashboard');

    } catch (error) {

      console.log(error);

      alert('Registration Failed');

    }
  };

  return (

    <div className="min-h-screen flex justify-center items-center bg-gray-900">

      <form
        onSubmit={handleSubmit}
        className="bg-gray-800 p-8 rounded-xl w-96"
      >

        <h2 className="text-3xl text-white font-bold text-center mb-6">
          Register
        </h2>

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          onChange={handleChange}
          className="w-full p-3 mb-4 rounded-lg bg-gray-700 text-white"
        />

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
          className="w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-lg"
        >
          Register
        </button>

        <p className="text-white mt-4 text-center">

          Already have an account?

          <Link
            to="/"
            className="text-blue-400 ml-2"
          >
            Login
          </Link>

        </p>

      </form>

    </div>

  );
}

export default RegisterPage;