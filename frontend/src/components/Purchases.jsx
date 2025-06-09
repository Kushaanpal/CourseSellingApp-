import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { FaDiscourse, FaDownload } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { RiHome2Fill } from "react-icons/ri";
import { HiMenu, HiX } from "react-icons/hi";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Purchases() {
  const [purchases, setPurchase] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));
  const token = user?.token;

  useEffect(() => {
    if (token) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
      navigate("/login");
    }
  }, [token, navigate]);

  useEffect(() => {
    const fetchPurchases = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/user/purchases`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        });
        setPurchase(response.data.courseData);
      } catch (error) {
        setErrorMessage("Failed to fetch purchase data");
      }
    };
    fetchPurchases();
  }, [token]);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      navigate("/login");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-950 text-gray-100 focus:outline-none focus:ring-0 select-none">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 bg-gray-900/80 backdrop-blur-lg shadow-lg p-6 transform focus:outline-none focus:ring-0 select-none ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 transition-transform duration-300 ease-in-out w-64 z-50 border-r border-gray-700`}
      >
        <nav className="space-y-6 mt-10 text-gray-300 font-medium">
          <Link to="/" className="flex items-center hover:text-teal-400">
            <RiHome2Fill className="mr-3 text-lg focus:outline-none focus:ring-0 select-none" /> Home
          </Link>
          <Link to="/courses" className="flex items-center hover:text-teal-400">
            <FaDiscourse className="mr-3 text-lg focus:outline-none focus:ring-0 select-none" /> Courses
          </Link>
          <div className="flex items-center text-teal-400 font-semibold">
            <FaDownload className="mr-3 text-lg focus:outline-none focus:ring-0 select-none" /> Purchases
          </div>
         
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="flex items-center text-red-400 hover:underline focus:outline-none focus:ring-0 select-none"
            >
              <IoLogOut className="mr-3 text-lg " /> Logout
            </button>
          ) : (
            <Link to="/login" className="flex items-center hover:text-green-400">
              <IoLogIn className="mr-3 text-lg" /> Login
            </Link>
          )}
        </nav>
      </div>
  
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        className="fixed top-4 left-4 z-50 md:hidden bg-teal-600 text-white p-2 rounded-lg shadow-md"
        onClick={toggleSidebar}
      >
        {isSidebarOpen ? <HiX className="text-2xl" /> : <HiMenu className="text-2xl" />}
      </button>
  
      {/* Main Content */}
      <div
        className={`flex-1 p-8 overflow-y-auto transition-all duration-300 focus:outline-none focus:ring-0 select-none ${
          isSidebarOpen ? "ml-64" : "ml-0"
        } md:ml-64`}
      >
        <h2 className="text-3xl font-bold text-teal-300 mb-8">🎓 My Purchases</h2>
  
        {errorMessage && (
          <div className="bg-red-800/20 border border-red-500 text-red-400 px-4 py-2 rounded mb-6">
            {errorMessage}
          </div>
        )}
  
        {purchases.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {purchases.map((purchase, index) => (
              <div
                key={index}
                className="bg-gray-800 rounded-xl shadow-md hover:scale-105
                 transition-all duration-300 p-5 flex flex-col justify-between border border-gray-700"
              >
                <img
                  className="w-full h-44 object-cover rounded-lg mb-4"
                  src={purchase.image?.url || "https://via.placeholder.com/300"}
                  alt={purchase.title}
                />
                <div className="flex flex-col gap-2">
                  <h3 className="text-lg font-semibold text-white">{purchase.title}</h3>
                  <p className="text-sm text-gray-400">
                    {purchase.description.length > 100
                      ? `${purchase.description.slice(0, 100)}...`
                      : purchase.description}
                  </p>
                  <span className="text-emerald-400 font-semibold mt-2">
                    ${purchase.price}
                  </span>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center text-gray-400 text-lg mt-20">
            🛒 You have no purchases yet. Explore courses and start learning!
          </div>
        )}
      </div>
    </div>
  );
  
}

export default Purchases;
