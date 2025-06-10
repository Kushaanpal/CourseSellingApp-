import React, { useState } from 'react';
import logo from "../../public/logo.webp";
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BACKEND_URL } from '../utils/utils';

function Signup() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(`${BACKEND_URL}/user/signup`,
        {
          firstName,
          lastName,
          email,
          password,
        },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      console.log("Signup successful: ", response.data);
      toast.success(response.data.message);
      navigate("/login");
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "Signup failed!!!");
      }
    }
  };

  return (
    <div className="bg-gradient-to-r from-black to-blue-950">
      <div className="h-screen container mx-auto flex flex-col items-center justify-center text-white relative">

        {/* Header */}
        <header className="absolute top-0 left-0 w-full flex justify-between items-center p-5">
          <div className="flex items-center space-x-2">
            <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
            <Link to={"/"} className="text-xl font-bold text-cyan-500">
              CourseHaven
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link
              to={"/login"}
              className="border border-gray-600 text-sm md:text-md md:py-2 md:px-4 rounded-md hover:border-cyan-500 hover:text-cyan-400"
            >
              Login
            </Link>
           
          </div>
        </header>

        {/* Signup Form */}
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-[320px] sm:w-[350px]">
          <h2 className="text-xl font-bold mb-4 text-center">
            Welcome to <span className="text-cyan-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-4 text-sm">
            Just Signup To Join Us!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="firstname" className="text-gray-400 mb-1 block text-sm">
                Firstname
              </label>
              <input
                type="text"
                id="firstname"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="w-full p-2 text-sm rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your firstname"
              />
            </div>

            <div className="mb-3">
              <label htmlFor="lastname" className="text-gray-400 mb-1 block text-sm">
                Lastname
              </label>
              <input
                type="text"
                id="lastname"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="w-full p-2 text-sm rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Type your lastname"
                required
              />
            </div>

            <div className="mb-3">
              <label htmlFor="email" className="text-gray-400 mb-1 block text-sm">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-2 text-sm rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 mb-1 block text-sm">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 text-sm rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-2 top-2.5 text-gray-400 hover:text-white cursor-pointer text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md transition text-sm"
            >
            Create my account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signup;
