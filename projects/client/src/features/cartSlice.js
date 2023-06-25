import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cart_id: 0,
      cart_count: 0,
      cart_item: [],
    },
    isLoaded: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    resetCart: (state) => {
      state.cart = {
        cart_count: 0,
        cart_item: [],
      };
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setCart, resetCart, setLoaded } = cartSlice.actions;
export default cartSlice.reducer;

export function fetchCart(userId) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(`http://localhost:8000/api/cart`, userId);
      console.log(response.data);
    } catch (error) {
      console.error(error);
    }
  };
}
