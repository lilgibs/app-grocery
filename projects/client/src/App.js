import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import UserManagementSettings from "./pages/UserManagementSettings";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import { checkLogin } from "./features/userSlice";

function App() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const userToken = localStorage.getItem("user_token");
  const userGlobal = useSelector((state) => state.user.user);

  useEffect(() => {
    if (userToken) {
      dispatch(checkLogin(userToken));
    }
  }, []);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/greetings`
      );
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
        <Route
          path="/admin/settings/users"
          element={<UserManagementSettings />}
        />
      </Routes>
    </div>
  );
}

export default App;
