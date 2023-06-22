import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {
      user_id: "",
      name: "",
      email: "",
      phone_number: "",
      gender: "",
      birthdate: "",
      profile_picture: "",
      isVerified: false,
    },
    isLoaded: false,
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
        phone_number: "",
        gender: "",
        birthdate: "",
        profile_picture: "",
        isVerified: false,
      };
      localStorage.removeItem("user_token");
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setUser, resetUser, setLoaded } = usersSlice.actions;
export default usersSlice.reducer;

export function loginUser(data) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/login",
        data
      );
      if (response) {
        response.data.data.birthdate = moment(
          response.data.data.birthdate
        ).format("YYYY-MM-DD");
        dispatch(setUser(response.data.data));
        localStorage.setItem("user_token", response.data.token);
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };
}

export function checkLogin(token) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        "http://localhost:8000/api/auth/check-login",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        response.data.data.birthdate = moment(
          response.data.data.birthdate
        ).format("YYYY-MM-DD");
        dispatch(setUser(response.data.data));
      }
    } catch (error) {
      if (error.response.data === "jwt expired") {
        localStorage.removeItem("user_token");
      }
      alert(error.response.data);
    } finally {
      dispatch(setLoaded(true));
    }
  };
}
