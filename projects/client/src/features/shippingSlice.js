import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const shippingSlice = createSlice({
  name: "shipping",
  initialState: {
    shipping: {
      courier: "",
      services: [],
    },
  },
  reducers: {
    setShipping: (state, action) => {
      state.shipping = action.payload;
    },
    setShippingCourier: (state, action) => {
      state.shipping.courier = action.payload;
    },
    setShippingServices: (state, action) => {
      state.shipping.services = action.payload;
    },
    resetShipping: (state) => {
      state.shipping = {
        courier: "",
        services: [],
      };
    },
  },
});

export const { setShipping, setShippingCourier, setShippingServices, resetShipping } = shippingSlice.actions;
export default shippingSlice.reducer;
