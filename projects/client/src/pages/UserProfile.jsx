import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Biodata from "../components/Biodata";
import Setting from "../components/Setting";
import Address from "../components/Address";

function UserProfile() {
  const navigate = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);
  const userGlobalIsLoaded = useSelector((state) => state.user.isLoaded);
  const [selectedComponent, setSelectedComponent] = useState("Biodata");
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    let isUserGlobalUpdated = false;

    const checkLoginStatus = () => {
      if (isUserGlobalUpdated && userGlobal.user_id === "") {
        navigate("/login");
      }
    };

    checkLoginStatus();

    const userGlobalUpdateListener = setInterval(() => {
      if (userGlobal.user_id !== null) {
        isUserGlobalUpdated = true;
        clearInterval(userGlobalUpdateListener);
        checkLoginStatus();
      }
    }, 100);

    return () => {
      clearInterval(userGlobalUpdateListener);
    };
  }, [userGlobal.user_id]);

  if (!userGlobalIsLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex">
      {/* Responsive Hamburger Button */}
      <div className="lg:hidden">
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="bg-gray-200 p-2"
        >
          ☰
        </button>
      </div>

      {/* Sidebar */}
      <div className={`${isSidebarOpen ? "block" : "hidden"} lg:flex mb-10`}>
        <Sidebar
          setSelectedComponent={setSelectedComponent}
          menuItems={["Biodata", "Address", "Settings"]}
        />
      </div>

      {/* Main Content */}
      <div className="md:w-5/6">
        {selectedComponent === "Biodata" && (
          <div className="flex w-full flex-col items-center">
            <Biodata />
          </div>
        )}
        {selectedComponent === "Address" && (
          <div className="flex w-full flex-col items-center">
            <Address />
          </div>
        )}
        {selectedComponent === "Settings" && (
          <div className="flex w-full flex-col items-center">
            <Setting />
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
