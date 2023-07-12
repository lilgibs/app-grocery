import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import moment from "moment";

export const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: {
      cart_count: 0,
      cart_items: [],
      shipping_courier_cart: null,
      shipping_address: null,
      shipping_option: null,
    },
  },
  reducers: {
    setCart: (state, action) => {
      state.cart = action.payload;
    },
    setCartItems: (state, action) => {
      state.cart.cart_items = action.payload;
    },
    setShippingAddress: (state, action) => {
      state.cart.shipping_address = action.payload;
    },
    setShippingCourierCart: (state, action) => {
      state.cart.shipping_courier_cart = action.payload;
    },
    setShippingOption: (state, action) => {
      state.cart.shipping_option = action.payload;
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
        shipping_courier_cart: null,
        shipping_address: null,
        shipping_option: null,
      };
    },
  },
});

export const { setCart, setShippingCourierCart, setShippingOption, setShippingAddress, resetCart, setCartItems, updateCartCount, resetCartItems } = cartSlice.actions;
export default cartSlice.reducer;

export function fetchCart(user) {
  return async (dispatch) => {
    try {
      //console.log(user);
      const response = await Axios.get(`http://localhost:8000/api/cart/?userId=${user}`);
      let cartItems = response.data.cart;
      console.log(cartItems);

      dispatch(setCartItems(cartItems));
      dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}
