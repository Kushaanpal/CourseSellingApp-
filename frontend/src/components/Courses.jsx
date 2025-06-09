import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaCircleUser, FaDiscourse, FaDownload } from "react-icons/fa6";
import { RiHome2Fill } from "react-icons/ri";
import { IoMdSettings } from "react-icons/io";
import { IoLogIn, IoLogOut } from "react-icons/io5";
import { FiSearch } from "react-icons/fi";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("user");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.error("Error fetching courses", error);
        toast.error("Failed to load courses");
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex bg-gradient-to-tr from-gray-900 via-gray-800 to-gray-950 text-gray-100 min-h-screen relative overflow-hidden focus:outline-none focus:ring-0 select-none">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-10 md:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 min-h-screen w-64 p-5 z-20 transform transition-transform duration-300 ease-in-out bg-gray-900 border-r border-gray-800 shadow-lg ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } md:translate-x-0 md:static`}
      >
        <div className="flex items-center mb-10">
          <img src={logo} alt="Logo" className="h-12 w-12 rounded-full" />
          <span className="ml-3 text-2xl font-bold text-emerald-400 focus:outline-none focus:ring-0 select-none">CourseHub</span>
        </div>
        <nav>
          <ul className="space-y-4 text-gray-300">
            <li>
              <Link to="/" className="flex items-center hover:text-teal-400">
                <RiHome2Fill className="mr-2 focus:outline-none focus:ring-0 select-none" /> Home
              </Link>
            </li>
            <li>
              <Link to="#" className="flex items-center text-teal-400 font-semibold">
                <FaDiscourse className="mr-2 focus:outline-none focus:ring-0 select-none" /> Courses
              </Link>
            </li>
            <li>
              <Link to="/purchases" className="flex items-center hover:text-teal-400">
                <FaDownload className="mr-2 focus:outline-none focus:ring-0 select-none" /> Purchases
              </Link>
            </li>
            <li>
              {isLoggedIn ? (
                <button onClick={handleLogout} className="flex items-center hover:text-red-400 focus:outline-none focus:ring-0 select-none">
                  <IoLogOut className="mr-2 " /> Logout
                </button>
              ) : (
                <Link to="/login" className="flex items-center hover:text-green-400">
                  <IoLogIn className="mr-2 " /> Login
                </Link>
              )}
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-10 w-full focus:outline-none focus:ring-0 select-none">
        <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <button
              className="md:hidden text-white text-2xl"
              onClick={toggleSidebar}
            >
              ☰
            </button>
            <h1 className="text-2xl sm:text-3xl font-bold text-teal-300 focus:outline-none focus:ring-0 select-none">Available Courses</h1>
          </div>
          <div className="w-full sm:w-auto">
            <div className="flex w-full max-w-md mx-auto sm:mx-0">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 bg-gray-800 text-white border border-gray-600 rounded-l-full px-4 py-2 focus:outline-none shadow-sm placeholder:text-gray-400"
              />
              <button
                onClick={() => {}}
                className="bg-teal-500 hover:bg-teal-600 border border-teal-600 rounded-r-full px-4 flex items-center text-white"
              >
                🔍
              </button>
            </div>
          </div>
        </header>

        {/* Course Cards */}
        {loading ? (
          <p className="text-center text-gray-400">Loading courses...</p>
        ) : filteredCourses.length === 0 ? (
          <p className="text-center text-gray-400 focus:outline-none focus:ring-0 select-none">No courses found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-gray-800 rounded-xl shadow-md p-4 hover:shadow-lg transition duration-300 border border-gray-700 flex flex-col"
              >
                <img
                  src={course.image?.url || "https://via.placeholder.com/300x200?text=No+Image"}
                  alt={course.title}
                  className="rounded-md mb-3 h-40 w-full object-cover"
                />
                <h2 className="text-lg font-bold text-white mb-1">{course.title}</h2>
                <p className="text-gray-400 mb-3 text-sm flex-1">
                  {course.description.length > 100
                    ? `${course.description.slice(0, 100)}...`
                    : course.description}
                </p>
                <div className="flex justify-between items-center text-sm mb-4">
                  <span className="font-bold text-emerald-400 text-lg">
                    ${course.price}
                    
                  </span>
                  
                </div>
                <button
                  onClick={() => {
                    if (isLoggedIn) {
                      navigate(`/buy/${course._id}`);
                    } else {
                      toast.error("Please login to enroll in a course.");
                      navigate("/login");
                    }
                  }}
                  className="bg-gradient-to-r from-cyan-400 to-teal-500 hover:from-teal-600 hover:to-cyan-500 text-white w-full block text-center py-2 rounded-md transition duration-300"
                >
                  Buy Now
                </button>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default Courses;