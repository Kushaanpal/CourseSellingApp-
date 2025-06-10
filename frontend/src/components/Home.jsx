import React, { useEffect, useState } from 'react';
import logo from "../../public/logo.webp";
import { Link, useNavigate } from 'react-router-dom';
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";
import axios from "axios";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import toast from 'react-hot-toast';
import { BACKEND_URL } from '../utils/utils';

function Home() {
  const [courses, setCourses] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    setIsLoggedIn(!!user);
  }, []);

  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/user/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("user");
      setIsLoggedIn(false);
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
      } catch (error) {
        console.log("error in fetchCourses ", error);
      }
    };
    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    course.description?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const settings = {
    dots: true,
    infinite: false,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    initialSlide: 0,
    autoplay: true,
    responsive: [
      { breakpoint: 1280, settings: { slidesToShow: 3 } },
      { breakpoint: 1024, settings: { slidesToShow: 2 } },
      { breakpoint: 768, settings: { slidesToShow: 1 } },
    ]
  };

  return (
    <div className="bg-gradient-to-r from-[#0f2027] via-[#203a43] to-[#2c5364]">
      <div className="min-h-screen text-white max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row items-center justify-between space-y-4 sm:space-y-0 focus:outline-none focus:ring-0 select-none">
          <div className="flex items-center space-x-2 focus:outline-none focus:ring-0 select-none">
            <img src={logo} alt="" className="w-10 h-10 rounded-full" />
            <h1 className="text-2xl text-cyan-400 font-bold focus:outline-none focus:ring-0 select-none">CourseHaven</h1>
          </div>

          <div className="flex space-x-2 flex-wrap justify-center">
            {isLoggedIn ? (
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-5 rounded-md shadow-md hover:scale-105 transition-transform duration-300"
              >
                Logout
              </button>
            ) : (
              <>
                <Link
                  to="/login"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-5 rounded-md shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-0 select-none"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  className="bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-2 px-5 rounded-md shadow-md hover:scale-105 transition-transform duration-300 focus:outline-none focus:ring-0 select-none"
                >
                  Signup
                </Link>
              </>
            )}
          </div>
        </header>

        {/* Hero */}
        <section className="text-center py-12">
          <h1 className="text-4xl sm:text-5xl font-bold text-cyan-400 focus:outline-none focus:ring-0 select-none">CourseHaven</h1>
          <p className="text-gray-300 mt-4 text-lg focus:outline-none focus:ring-0 select-none">Sharpen your skills with courses crafted by experts.</p>
          <div className="mt-6">
            <Link
              to="/courses"
              className="bg-cyan-500 text-white px-6 py-3 rounded font-semibold hover:bg-white duration-300 hover:text-black
              focus:outline-none focus:ring-0 select-none">
              Explore Courses
            </Link>
          </div>
        </section>

        {/* Search Input */}
        <div className="my-6 flex justify-center">
          <input
            type="text"
            placeholder="Search courses..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full max-w-2xl px-4 py-2 border border-white rounded-md text-black outline-none focus:ring-2 focus:ring-cyan-400"
          />
        </div>

        {/* Courses Slider */}
        <section className="mt-8">
          {filteredCourses.length > 0 ? (
            <Slider {...settings}>
              {filteredCourses.map((course) => (
                <div key={course._id} className="p-3">
                  <div className="bg-[#1a1f2e] rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                    <img
                      className="h-40 w-full object-cover"
                      src={course?.image?.url || "/imgPL.webp"}
                      alt={course.title}
                    />
                    <div className="p-4 text-center">
                      <h2 className="text-xl font-bold text-white mb-3">
                        {course.title}
                      </h2>
                      <button
                        onClick={() => {
                          if (isLoggedIn) {
                            navigate(`/buy/${course._id}`);
                          } else {
                            toast.error("Please login to enroll in a course.");
                            navigate("/login");
                          }
                        }}
                        className="mt-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white py-2 px-4 rounded-full hover:from-pink-500 hover:to-orange-500 duration-300"
                      >
                        Enroll Now
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </Slider>
          ) : (
            <p className="text-center text-white">Loading....</p>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-gray-700 pt-8 focus:outline-none focus:ring-0 select-none">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left focus:outline-none focus:ring-0 select-none">
            
            {/* Logo & Social */}
            <div className="space-y-4">
              <div className="flex items-center justify-center md:justify-start space-x-2">
                <img src={logo} alt="" className="w-10 h-10 rounded-full" />
                <h1 className="text-2xl text-cyan-400 font-bold focus:outline-none focus:ring-0 select-none">CourseHaven</h1>
              </div>
              <div>
                <p className="text-gray-300 mb-2 focus:outline-none focus:ring-0 select-none">Follow us</p>
                <div className="flex justify-center md:justify-start space-x-4">
                  <a href="#"><FaFacebook className="text-2xl hover:text-blue-400 duration-300" /></a>
                  <a href="#"><FaInstagram className="text-2xl hover:text-pink-600 duration-300" /></a>
                  <a href="#"><FaTwitter className="text-2xl hover:text-sky-500 duration-300" /></a>
                </div>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-cyan-300 focus:outline-none focus:ring-0 select-none">Connects</h3>
              <ul className="text-gray-400 space-y-1">
                <li>
                  <a href="https://www.linkedin.com/in/kushaan-pal-031175248/" target="_blank" rel="noopener noreferrer" className="hover:text-white focus:outline-none focus:ring-0 select-none">
                    LinkedIn – Kushaan Pal
                  </a>
                </li>
                <li>
                  <a href="https://github.com/Kushaanpal" target="_blank" rel="noopener noreferrer" className="hover:text-white focus:outline-none focus:ring-0 select-none">
                    GitHub – Kushaan Pal
                  </a>
                </li>
              </ul>
            </div>

            {/* Policies */}
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-cyan-300 focus:outline-none focus:ring-0 select-none">© 2025 CourseHaven</h3>
              <ul className="text-gray-400 space-y-1">
                <li className="hover:text-white cursor-pointer focus:outline-none focus:ring-0 select-none">Terms & Conditions</li>
                <li className="hover:text-white cursor-pointer focus:outline-none focus:ring-0 select-none">Privacy Policy</li>
                <li className="hover:text-white cursor-pointer focus:outline-none focus:ring-0 select-none">Refund & Cancellation</li>
              </ul>
            </div>
          </div>
        </footer>

      </div>
    </div>
  );
}

export default Home;
