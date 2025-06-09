import React, { useState } from "react";
import logo from "../../public/logo.webp";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";
import { FiEye, FiEyeOff } from "react-icons/fi";
import { BACKEND_URL } from "../utils/utils";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${BACKEND_URL}/admin/login`,
        { email, password },
        {
          withCredentials: true,
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate("/admin/dashboard");
      toast.success(response.data.message);
      localStorage.setItem("admin", JSON.stringify(response.data));
    } catch (error) {
      if (error.response) {
        setErrorMessage(error.response.data.errors || "AdminLogin failed!!!");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-black to-blue-950 flex flex-col">
      {/* Header */}
      <header className="w-full flex justify-between items-center px-4 py-4 md:px-8 absolute top-0">
        <div className="flex items-center space-x-2">
          <img src={logo} alt="Logo" className="w-10 h-10 rounded-full" />
          <Link to="/" className="text-xl font-bold text-cyan-500">
            CourseHaven
          </Link>
        </div>
        <div className="flex items-center space-x-3">
          <Link
            to="/admin/signup"
            className="border border-gray-500 text-white py-2 px-3 rounded-md text-sm md:text-base"
          >
            Signup
          </Link>
          <Link
            to="/"
            className="bg-cyan-500 py-2 px-3 rounded-md text-sm md:text-base"
          >
            Home
          </Link>
        </div>
      </header>

      {/* AdminLogin Form */}
      <div className="flex-grow flex items-center justify-center px-4 mt-24 md:mt-20">
        <div className="bg-gray-900 p-6 md:p-8 rounded-lg shadow-lg w-full max-w-sm ">
          <h2 className="text-2xl md:text-3xl font-bold mb-4 text-center">
            Welcome to <span className="text-cyan-500">CourseHaven</span>
          </h2>
          <p className="text-center text-gray-400 mb-6 text-sm md:text-base">
            Log in to access admin dashboard!
          </p>

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="text-gray-400 block mb-1">
                Email
              </label>
              <input
                type="text"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                placeholder="name@email.com"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="text-gray-400 block mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 rounded-md bg-gray-800 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm md:text-base"
                  placeholder="********"
                  required
                />
                <span
                  className="absolute right-3 top-3 text-gray-500 cursor-pointer text-lg"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FiEye /> : <FiEyeOff />}
                </span>
              </div>
            </div>

            {errorMessage && (
              <div className="mb-4 text-red-500 text-center text-sm">
                {errorMessage}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-blue-600 text-white py-3 px-6 rounded-md transition text-sm md:text-base"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
