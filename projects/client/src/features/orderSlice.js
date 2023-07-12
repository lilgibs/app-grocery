import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: {
      order_items: [],
      page: 1,
      max_item: 3,
      max_page: 1,
      date_filter_start: "",
      date_filter_end: "",
    },
  },
  reducers: {
    setOrderItems: (state, action) => {
      state.order.order_items = action.payload;
    },
    setOrderPage: (state, action) => {
      state.order.page = action.payload;
    },
    setMaxPage: (state) => {
      state.order.max_page = Math.ceil(state.order.order_items.length / state.order.max_item);
    },
    resetOrder: (state) => {
      state.order = {
        order_items: [],
        page: 1,
        max_item: 3,
        max_page: 1,
        date_filter_start: "",
        date_filter_end: "",
      };
    },
  },
});

export const { setOrderItems, setOrderPage, setMaxPage, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

export function fetchOrder(user) {
  return async (dispatch) => {
    try {
      // console.log(user);
      const response = await Axios.get(`http://localhost:8000/api/order/?userId=${user}`);
      let orderItems = response.data.orders;

      // console.log(orderItems);
      dispatch(setOrderItems(orderItems));
      dispatch(setMaxPage());
      //   dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchStoreOrder(store) {
  return async (dispatch) => {
    try {
      // console.log(user);
      const response = await Axios.get(`http://localhost:8000/api/admin/order/?storeId=${store}`);
      let orderItems = response.data;

      // console.log(orderItems);
      dispatch(setOrderItems(orderItems));
      //   dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchAllOrder() {
  return async (dispatch) => {
    try {
      const response = await Axios.get(`http://localhost:8000/api/admin/order/all`);
      let orderItems = response.data;

      // console.log(orderItems);
      dispatch(setOrderItems(orderItems));
      //   dispatch(updateCartCount());
    } catch (error) {
      console.error(error);
    }
  };
}
