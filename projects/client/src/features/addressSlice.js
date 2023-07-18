import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    address: [],
    mainAddress: null,
    isLoaded: false,
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    resetAddress: (state) => {
      state.address = null;
    },
    setMainAddress: (state, action) => {
      state.mainAddress = action.payload;
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setAddress, resetAddress, setMainAddress, setLoaded } =
  addressSlice.actions;
export default addressSlice.reducer;

export function getAddress(user_id, token) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/addresses/${user_id}`,
        // {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setAddress(response.data.data));
        if (response.data.data.length > 0) {
          const mainAddress = response.data.data.find(
            (address) => address["first_address"] === 1
          );
          dispatch(setMainAddress(mainAddress));
        } else {
          dispatch(setMainAddress(false));
        }
      }
    } catch (error) {
      console.log(error.response.data);
    } finally {
      dispatch(setLoaded(true));
    }
  };
}
