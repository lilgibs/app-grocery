import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

const AdminDashboard = () => {
  const adminGlobal = useSelector((state) => state.admin.admin);

  return (
    <div>
      <center>
        <br />
        Welcome {adminGlobal.name} !<br />
      </center>
    </div>
  );
};

export default AdminDashboard;
