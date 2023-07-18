import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const usersSlice = createSlice({
  name: "users",
  initialState: {
    user: {
      user_id: null,
      name: null,
      email: null,
      phone_number: null,
      gender: null,
      birthdate: null,
      profile_picture: null,
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
        user_id: null,
        name: null,
        email: null,
        phone_number: null,
        gender: null,
        birthdate: null,
        profile_picture: null,
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
        `${process.env.REACT_APP_API_BASE_URL}/auth/login`,
        data
      );
      if (response) {
        response.data.data.birthdate = moment(
          response.data.data.birthdate
        ).format("YYYY-MM-DD");
        dispatch(setUser(response.data.data));
        localStorage.setItem("user_token", response.data.token);
        // alert(response.data.message);
      }
      return true;
    } catch (error) {
      return error.response.data;
      // alert(error.response.data);
    } finally {
      dispatch(setLoaded(true));
    }
  };
}

export function checkLogin(token) {
  return async (dispatch) => {
    try {
      let response = await Axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/check-login`,
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
      // alert(error.response.data);
      console.log(error.response.data);
    } finally {
      dispatch(setLoaded(true));
    }
  };
}
