import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import UserManagementSettings from "./pages/UserManagementSettings";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import { checkLogin } from "./features/userSlice";
import { checkLoginAdmin } from "./features/adminSlice";
import AdminCategories from "./pages/AdminCategories";
import UserProfile from "./pages/UserProfile";
import { getCityStore } from "./features/locationSlice";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminEditProduct from "./pages/AdminEditProduct";

function App() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const userToken = localStorage.getItem("user_token");
  const adminToken = localStorage.getItem("admin_token");
  const userGlobal = useSelector((state) => state.user.user);
  const adminGlobal = useSelector((state) => state.admin.admin);

  useEffect(() => {
    if (userToken) {
      dispatch(checkLogin(userToken));
    }
  }, []);

  useEffect(() => {
    if (adminToken) {
      dispatch(checkLoginAdmin(adminToken));
    }
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(function (position) {
      let latitude = position.coords.latitude;
      let longitude = position.coords.longitude;

      dispatch(getCityStore(latitude, longitude));
    });
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
      {adminGlobal.id > 0 ? (
        //when admin is logged in
        <>
          <AdminNavbar />
        </>
      ) : (
        //when admin is logged out
        <>
          <Navbar />
        </>
      )}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<UserProfile />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route
          path="/admin/settings/users"
          element={<UserManagementSettings />}
        />
        <Route
          path="/admin/products/categories"
          element={<AdminCategories />}
        />
        <Route path="/admin/products/" element={<AdminProducts />} />
        <Route path="/admin/products/add-product" element={<AdminAddProduct />} />
        <Route path="/admin/products/:product_id" element={<AdminEditProduct />} />
      </Routes>
    </div>
  );
}

export default App;
