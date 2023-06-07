import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {
      user_id: "",
      name: "",
      email: "",
      phone_number: "",
      isVerified: false,
    },
  },
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
    },
    resetUser: (state) => {
      state.user = {
        user_id: "",
        name: "",
        email: "",
        phone: "",
        isVerified: false,
      };
    },
  },
});

export const { setUser, resetUser } = usersSlice.actions;
export default usersSlice.reducer;

export function registerUser(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/register",
        data
      );
      if (response) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };
}

export function loginUser(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      if (response) {
        dispatch(setUser(response.data.data));
        localStorage.setItem("user_token", response.data.token);
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };
}
