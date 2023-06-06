import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const adminSlice = createSlice({
  name: "users",
  initialState: {
    admin: {
      admin_id: 0,
      name: "",
      email: "",
      role: 0,
      store_id: "",
      is_deleted: false,
    },
  },
  reducers: {
    setAdmin: (state, action) => {
      state.admin = action.payload;
    },
    resetAdmin: (state) => {
      state.admin = {
        admin_id: 0,
        name: "",
        email: "",
        role: 0,
        store_id: "",
        is_deleted: false,
      };
    },
  },
});

export function loginAdmin(data) {
  return async (dispatch) => {
    // console.log(data); //data in login form
    try {
      let response = await Axios.post("http://localhost:8000/api/auth/adminLogin", data);
      if (response) {
        dispatch(setAdmin(response.data.data));
        alert(response.data.message);
        //checker
        //console.log(response.data.data);
      }
    } catch {
      alert("You are not registered as an admin");
    }
  };
}

export function createBranchAdmin(data) {
  return async () => {
    console.log(data)
    try {
      let response = await Axios.post(`http://localhost:8000/api/admin/create`, data)
      if (response) {
        alert(response.data.message);
      }
    } catch (error) {
      console.error(error.response.data);
      alert(`There was an error creating the branch admin: error.response.data`);
    }
  }
}

export const { setAdmin, resetAdmin } = adminSlice.actions;
export default adminSlice.reducer;
