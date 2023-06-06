import axios from "axios";
import { useEffect, useState } from "react";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import { Route, Routes } from "react-router-dom";
import UserManagementSettings from "./pages/UserManagementSettings";
import Register from "./pages/Register";

function App() {
  const [message, setMessage] = useState("");

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
      <Routes>
        <Route path="/" element={<AdminLogin />} />
        <Route path="/register" element={<Register />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
        <Route path="/admin/settings/users" element={<UserManagementSettings />} />
      </Routes>
    </div>
  );
}

export default App;
