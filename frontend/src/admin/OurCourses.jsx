import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_URL } from "../utils/utils";

function OurCourses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const admin = JSON.parse(localStorage.getItem("admin"));
  const token = admin?.token;

  useEffect(() => {
    if (!token) {
      toast.error("Please login to admin");
      navigate("/admin/login");
      return;
    }

    const fetchCourses = async () => {
      try {
        const response = await axios.get(`${BACKEND_URL}/course/courses`, {
          withCredentials: true,
        });
        setCourses(response.data.courses);
        setLoading(false);
      } catch (error) {
        console.log("error in fetchCourses ", error);
        setLoading(false);
      }
    };

    fetchCourses();
  }, [token, navigate]);

  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `${BACKEND_URL}/course/delete/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          withCredentials: true,
        }
      );
      toast.success(response.data.message);
      const updatedCourses = courses.filter((course) => course._id !== id);
      setCourses(updatedCourses);
    } catch (error) {
      console.log("Error in deleting course ", error);
      toast.error(error.response?.data?.errors || "Error in deleting course");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-950 text-white">
        <p className="text-lg text-gray-400">Loading courses...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white p-6 ">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex justify-between items-center flex-wrap gap-3">
          <h1 className="text-3xl font-bold text-cyan-400 focus:outline-none focus:ring-0 select-none">Our Courses</h1>
          <Link
            className="bg-cyan-600 hover:bg-cyan-500 text-white py-2 px-4 rounded-xl transition focus:outline-none focus:ring-0 select-none"
            to={"/admin/dashboard"}
          >
            Go to Dashboard
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 focus:outline-none focus:ring-0 select-none">
          {courses.map((course) => (
            <div
              key={course._id}
              className="bg-gray-900 rounded-2xl shadow-lg overflow-hidden flex flex-col hover:scale-105 transform transition-all duration-300"
            >
              <img
                src={course?.image?.url}
                alt={course.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-4 flex-1 flex flex-col">
                <h2 className="text-lg font-semibold text-cyan-300">
                  {course.title}
                </h2>
                <p className="text-gray-400 text-sm mt-2 flex-1">
                  {course.description.length > 180
                    ? `${course.description.slice(0, 180)}...`
                    : course.description}
                </p>
                <div className="flex justify-between mt-4 text-sm text-gray-300">
                  <span className="font-bold text-white">
                    ${course.price}{" "}
                   
                  </span>
                 
                </div>

                <div className="flex justify-between gap-2 mt-4">
                  <Link
                    to={`/admin/update-course/${course._id}`}
                    className="flex-1 text-center bg-orange-500 hover:bg-orange-400 py-2 rounded-lg text-white transition"
                  >
                    Update
                  </Link>
                  <button
                    onClick={() => handleDelete(course._id)}
                    className="flex-1 bg-red-600 hover:bg-red-500 py-2 rounded-lg text-white transition"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {courses.length === 0 && (
          <p className="text-center text-gray-400 mt-10">No courses found.</p>
        )}
      </div>
    </div>
  );
}

export default OurCourses;
