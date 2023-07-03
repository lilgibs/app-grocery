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
      <Sidebar
        setSelectedComponent={setSelectedComponent}
        menuItems={["Biodata", "Address", "Settings"]}
      />
      {selectedComponent === "Biodata" ? (
        <div className="flex w-full flex-col items-center">
          <Biodata />
        </div>
      ) : null}
      {selectedComponent === "Address" ? (
        <div className="flex w-full flex-col items-center">
          <Address />
        </div>
      ) : null}
      {selectedComponent === "Settings" ? (
        <div className="flex w-full flex-col items-center">
          <Setting />
        </div>
      ) : null}
    </div>
  );
}

export default UserProfile;
