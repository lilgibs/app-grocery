import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    address: [],
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
  },
});

export const { setAddress, resetAddress } = addressSlice.actions;
export default addressSlice.reducer;

export function getAddress(user_id) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(
        `http://localhost:8000/api/addresses/${user_id}`
      );
      if (response) {
        dispatch(setAddress(response.data.data));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
}
