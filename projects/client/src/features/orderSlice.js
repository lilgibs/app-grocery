import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const orderSlice = createSlice({
  name: "order",
  initialState: {
    order: {
      order_items: [],
    },
  },
  reducers: {
    setOrderItems: (state, action) => {
      state.order.order_items = action.payload;
    },
    resetOrder: (state) => {
      state.order = {
        order_items: [],
      };
    },
  },
});

export const { setOrderItems, resetOrder } = orderSlice.actions;
export default orderSlice.reducer;

export function fetchOrder(user) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/order/?userId=${user}`);
      let orderItems = response.data.orders;

      dispatch(setOrderItems(orderItems));
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchStoreOrder(store) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/order/?storeId=${store}`);
      let orderItems = response.data.orders;

      dispatch(setOrderItems(orderItems));
    } catch (error) {
      console.error(error);
    }
  };
}

export function fetchAllOrder() {
  return async (dispatch) => {
    try {
      const response = await Axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/order/all`);
      let orderItems = response.data;

      dispatch(setOrderItems(orderItems));
    } catch (error) {
      console.error(error);
    }
  };
}
