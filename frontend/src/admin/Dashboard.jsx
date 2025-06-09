import React,{useState,useEffect} from "react";
import { Link, useNavigate, } from "react-router-dom";
import logo from "../../public/logo.webp";
import toast from "react-hot-toast";
import axios from "axios";
import { BACKEND_URL } from "../utils/utils";

function Dashboard() {
  const [adminFirstName, setAdminFirstName] = useState("");
  const navigate=useNavigate();

  useEffect(() => {
    const adminData = JSON.parse(localStorage.getItem("admin"));
    if (adminData?.admin?.firstName) {
      setAdminFirstName(adminData.admin.firstName);
    } else {
      setAdminFirstName("Admin");
    }
  }, []);
  const handleLogout = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/admin/logout`, {
        withCredentials: true,
      });
      toast.success(response.data.message);
      localStorage.removeItem("admin");
    } catch (error) {
      console.log("Error in logging out ", error);
      toast.error(error.response?.data?.errors || "Error in logging out");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-950 text-white focus:outline-none focus:ring-0 select-none">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 p-6 flex flex-col justify-between rounded-tr-3xl rounded-br-3xl shadow-lg focus:outline-none focus:ring-0 select-none">
        <div>
          <div className="flex flex-col items-center mb-10 focus:outline-none focus:ring-0 select-none ">
            <img
              src={logo}
              alt="Logo"
              className="rounded-full h-20 w-20 border-4 border-cyan-400 shadow-md"
            />
            <h2 className="text-xl font-semibold mt-4 text-cyan-300 focus:outline-none focus:ring-0 select-none">
              {adminFirstName}
            </h2>
          </div>

          <nav className="flex flex-col space-y-4">
            <Link to="/admin/our-courses">
              <button className="w-full bg-cyan-600 hover:bg-cyan-500 transition duration-300 py-2 px-4 rounded-2xl shadow">
                Our Courses
              </button>
            </Link>
            <Link to="/admin/create-course">
              <button className="w-full bg-sky-600 hover:bg-sky-500 transition duration-300 py-2 px-4 rounded-2xl shadow">
                Create Course
              </button>
            </Link>
            <Link to="/">
              <button className="w-full bg-indigo-600 hover:bg-indigo-500 transition duration-300 py-2 px-4 rounded-2xl shadow">
                Home
              </button>
            </Link>
          </nav>
        </div>

        <div className="mt-10">
          <Link to="/admin/login">
            <button
              onClick={handleLogout}
              className="w-full bg-rose-600 hover:bg-rose-500 transition duration-300 py-2 px-4 rounded-2xl shadow"
            >
              Logout
            </button>
          </Link>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-8 bg-gray-950 focus:outline-none focus:ring-0 select-none">
        <div className="text-center max-w-xl px-6 py-8 bg-gray-900 rounded-3xl shadow-lg focus:outline-none focus:ring-0 select-none">
          <h1 className="text-3xl md:text-4xl font-bold text-cyan-300 mb-4 focus:outline-none focus:ring-0 select-none">
            Welcome {adminFirstName}
          </h1>
          <p className="text-gray-400 text-lg focus:outline-none focus:ring-0 select-none">
            Manage your courses, create new ones, and monitor your platform's activity right from here.
          </p>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;
