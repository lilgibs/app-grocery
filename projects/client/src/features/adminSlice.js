import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const adminSlice = createSlice({
  name: "users",
  initialState: {
    admin: {
      admin_id: null,
      name: null,
      email: null,
      role: null,
      store_id: null,
      is_deleted: false,
    },
    isLoaded: false,
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    resetAdmin: (state) => {
      state.admin = {
        admin_id: null,
        name: null,
        email: null,
        role: null,
        store_id: null,
        is_deleted: false,
      };
      localStorage.removeItem("admin_token");
    },
    setLoading: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export function loginAdmin(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/adminLogin",
        data
      );
      if (response) {
        dispatch(setAdmin(response.data.data));
        localStorage.setItem("admin_token", response.data.token);
        alert(response.data.message);
      }
    } catch {
      alert("You are not registered as an admin");
    }
  };
}

export function checkLoginAdmin(token) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/check-adminlogin",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setAdmin(response.data.data));
      }
    } catch (error) {
      // alert("error");
      console.log(error);
    } finally {
      dispatch(setLoading(true));
    }
  };
}

export function createBranchAdmin(data) {
  return async () => {
    const adminToken = localStorage.getItem("admin_token");
    try {
      let response = await Axios.post(
        `http://localhost:8000/api/admin/create`,
        data,
        {
          headers: {
            Authorization: `Bearer ${adminToken}`,
          },
        }
      );
      if (response) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(
        `There was an error creating the branch admin: ${error.response.data}`
      );
    }
  };
}

export const { setAdmin, resetAdmin, setLoading } = adminSlice.actions;
export default adminSlice.reducer;
