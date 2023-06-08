import axios from "axios";
import { useEffect, useState } from "react";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import UserManagementSettings from "./pages/UserManagementSettings";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import AdminCategories from "./pages/AdminCategories";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
      setMessage(data?.message || "");
    })();
  }, []);

  return (
    <div>
      <Navbar />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings/users" element={<UserManagementSettings />} />
        <Route path="/admin/products/categories" element={<AdminCategories />} />
      </Routes>
    </div>
  );
}

export default App;
