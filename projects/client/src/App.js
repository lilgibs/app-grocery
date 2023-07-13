import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";

import Navbar from "./components/Navbar";
import AdminNavbar from "./components/AdminNavbar";
import LandingPage from "./pages/LandingPage";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import UserManagementSettings from "./pages/UserManagementSettings";
import Register from "./pages/Register";
import Verification from "./pages/Verification";
import Login from "./pages/Login";
import AdminCategories from "./pages/AdminCategories";
import UserProfile from "./pages/UserProfile";
import AdminAddProduct from "./pages/AdminAddProduct";
import AdminProducts from "./pages/AdminProducts";
import AdminEditProduct from "./pages/AdminEditProduct";
import Cart from "./pages/Cart";
import Orders from "./pages/Orders";
import Products from "./pages/Products";
import Product from "./pages/Product";
import AdminOrders from "./pages/AdminOrders";
import ChangePassword from "./pages/ChangePassword";
import NotFound from "./pages/NotFound";
import { checkLogin } from "./features/userSlice";
import { checkLoginAdmin } from "./features/adminSlice";
import { fetchCart } from "./features/cartSlice";
import { fetchOrder, fetchStoreOrder, fetchAllOrder } from "./features/orderSlice";
import { getCityStore } from "./features/locationSlice";
import { getAddress } from "./features/addressSlice";
import AdminDiscount from "./pages/AdminDiscount";
import { getDiscount } from "./features/discountSlice";
import { getVoucher } from "./features/voucherSlice";
import ResetPasswordEmailForm from "./pages/ResetPasswordEmailForm";
import ResetPassword from "./pages/ResetPassword";
import AdminStockHistory from "./pages/AdminStockHistory";

function App() {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const userToken = localStorage.getItem("user_token");
  const adminToken = localStorage.getItem("admin_token");
  const userGlobal = useSelector((state) => state.user.user);
  const adminGlobal = useSelector((state) => state.admin.admin);
  const userAddresses = useSelector((state) => state.address.address);
  let mainAddress;

  if (userAddresses) {
    mainAddress = userAddresses.find((address) => address.first_address === 1);
  }

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
    if (userToken) {
      dispatch(fetchOrder(userGlobal.user_id));
    }
  }); // get order if user is logged in

  useEffect(() => {
    if (adminToken) {
      {
        adminGlobal.role === 99 ? dispatch(fetchAllOrder()) : dispatch(fetchStoreOrder(adminGlobal.store_id));
      }
    }
  }); // get store order if admin is logged in

  useEffect(() => {
    if (userToken) {
      dispatch(fetchCart(userGlobal.user_id));
    }
  }, []);

  useEffect(() => {
    if (mainAddress) {
      let latitude = mainAddress.latitude;
      let longitude = mainAddress.longitude;

      dispatch(getCityStore(latitude, longitude));
    } else {
      navigator.geolocation.getCurrentPosition(function (position) {
        let latitude = position.coords.latitude;
        let longitude = position.coords.longitude;

        dispatch(getCityStore(latitude, longitude));
      });
    }
  }, [mainAddress]);

  useEffect(() => {
    if (userGlobal.user_id !== null) {
      dispatch(getAddress(userGlobal.user_id, userToken));
    }
  }, [userGlobal, userToken]);

  useEffect(() => {
    if (adminGlobal.id !== null) {
      dispatch(getDiscount(adminGlobal.store_id, adminToken));
    }
  }, [adminGlobal, adminToken]);

  useEffect(() => {
    if (adminGlobal.id !== null) {
      dispatch(getVoucher(adminGlobal.store_id, adminToken));
    }
  }, [adminGlobal, adminToken]);

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
      setMessage(data?.message || "");
    })();
  }, []);

  return (
    <div>
      {adminGlobal.id != null ? (
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
        <Route path="/login" element={<Login />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/products" element={<Products />} />
        <Route path="/products/:productName" element={<Product />} />

        {adminGlobal.id != null ? (
          //when admin is logged in
          <>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            {adminGlobal.role === 99 ? <Route path="/admin/settings/users" element={<UserManagementSettings />} /> : <> </>}

            <Route path="/admin/products/categories" element={<AdminCategories />} />
            <Route path="/admin/products/" element={<AdminProducts />} />
            <Route path="/admin/products/add-product" element={<AdminAddProduct />} />
            <Route path="/admin/products/:productId" element={<AdminEditProduct />} />
            <Route path="/admin/orders" element={<AdminOrders />} />
            <Route path="/admin/discounts" element={<AdminDiscount />} />
            <Route
              path="/admin/stock-history"
              element={<AdminStockHistory />}
            />
          </>
        ) : (
          //when admin is logged out
          <></>
        )}
        {userGlobal.user_id != null ? (
          //when user is logged in
          <>
            <Route path="/profile" element={<UserProfile />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/change-password" element={<ChangePassword />} />
          </>
        ) : (
          //when user is logged out
          <>
            <Route path="/reset-password" element={<ResetPasswordEmailForm />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
          </>
        )}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;
