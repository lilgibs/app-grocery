import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const addressSlice = createSlice({
  name: "addresses",
  initialState: {
    address: [],
    // address: {
    //   address_id: "",
    //   user_id: "",
    //   province: "",
    //   city: "",
    //   street: "",
    //   longitude: "",
    //   latitude: "",
    // },
  },
  reducers: {
    setAddress: (state, action) => {
      state.address = action.payload;
    },
    resetAddress: (state) => {
      state.address = {
        address_id: "",
        user_id: "",
        province: "",
        city: "",
        street: "",
        longitude: "",
        latitude: "",
      };
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
