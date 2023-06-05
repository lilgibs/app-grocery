import axios from "axios";
import { useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import UserManagementSettings from "./pages/UserManagementSettings";

function App() {
  const [message, setMessage] = useState("");

  useEffect(() => {
    (async () => {
      const { data } = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/greetings`);
      setMessage(data?.message || "");
    })();
  }, []);

  return (
    <div className="App">
      <Routes>
        <Route path="/admin/settings/users" element={<UserManagementSettings/>}/>
      </Routes>
    </div>
  );
}

export default App;
