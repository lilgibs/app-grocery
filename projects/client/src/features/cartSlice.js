import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cart_count: 0,
      cart_items: [],
    },
    isLoaded: false,
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCartItems: (state, action) => {
      state.cart.cart_items = action.payload;
    },
    updateCartCount: (state, action) => {
      state.cart.cart_count = state.cart.cart_items.length;
    },
    resetCartItems: (state, action) => {
      state.cart.cart_items = [];
    },
    resetCart: (state) => {
      state.cart = {
        cart_count: 0,
        cart_items: [],
      };
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export const { setCart, resetCart, setCartItems, updateCartCount, resetCartItems, setLoaded } = cartSlice.actions;
export default cartSlice.reducer;

export function fetchCart(user) {
  return async (dispatch) => {
    try {
      //console.log(user);
      const response = await Axios.post("http://localhost:8000/api/cart", user);
      let cartItems = response.data.cart;
      // console.log(cartItems);

      dispatch(setCartItems(cartItems));
      dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}
