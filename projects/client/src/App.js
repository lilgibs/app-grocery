import axios from "axios";
import "./styles/App.css";
import { useEffect, useState } from "react";
import { Routes, Route } from "react-router-dom";

import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Register from "./pages/Register";
import Verification from "./pages/Verification";

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
        <Route path="/verification/:token" element={<Verification />} />
        <Route path="/adminlogin" element={<AdminLogin />} />
        <Route path="/admindashboard" element={<AdminDashboard />} />
      </Routes>
    </div>
  );
}

export default App;
