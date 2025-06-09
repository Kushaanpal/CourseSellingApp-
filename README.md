# 🎓 Course Selling App

A full-stack MERN (MongoDB, Express, React, Node.js) application for selling and purchasing courses. It supports both *User* and *Admin* roles with secure authentication, course purchase tracking, and full course management from an admin dashboard.

---

## 🌐 Live Links

- *Website (Vercel):* [https://course-selling-app-rust.vercel.app](https://course-selling-app-rust.vercel.app)


---

## 📌 Features

### 👤 User Features

- 🔐 User Signup and Login
- 🎥 Browse all available courses
- 💳 Buy a course
- 📚 View purchased courses
- 🔒 Protected user routes using localStorage for session persistence

### 🛠 Admin Features

- 🔐 Admin Signup and Login (Separate from users)
- 📊 Admin Dashboard with protected access
- ➕ Create new courses
- ✏ Edit/update existing courses
- 🗃 View and manage all courses
- 🔒 Protected admin routes using a custom route guard

---

## 🧱 Tech Stack

### 🔧 Frontend

- React.js
- Tailwind CSS
- React Router DOM
- React Hot Toast (notifications)

### 🖥 Backend

- Node.js
- Express.js
- MongoDB + Mongoose
- dotenv for environment configuration
- CORS and cookie-based authentication

---

🧪 API Endpoints Overview




##Users


Method	Endpoint	Description


POST	/signup	User registration


POST	/login	User login


GET	/courses	List all courses


POST	/buy/:id	Buy a course


GET	/purchases	List purchased items


POST	/logout	Logout user



##Admin


Method	Endpoint	Description


POST	/admin/signup	Admin registration


POST	/admin/login	Admin login


POST	/admin/create-course	Add new course


GET	/admin/courses	Get all courses


PUT	/admin/update/:id	Update existing course


POST	/admin/logout	Logout admin
