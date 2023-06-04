import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { resetAdmin } from "../features/adminSlice";
import { Button } from "@chakra-ui/react";

const AdminDashboard = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.admin.admin);

  return (
    <div>
      <center>
        Welcome {userGlobal.name} !<br />
        <Button
          colorScheme="gray"
          size="sm"
          onClick={() => {
            //alert("logging out");
            dispatch(resetAdmin());
            nav("/adminlogin");
          }}
        >
          Logout
        </Button>
      </center>
    </div>
  );
};

export default AdminDashboard;
