import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const discountSlice = createSlice({
  name: "discounts",
  initialState: {
    discount: [],
  },
  reducers: {
    setDiscount: (state, action) => {
      state.discount = action.payload;
    },
    resetDiscount: (state) => {
      state.discount = null;
    },
  },
});

export const { setDiscount, resetDiscount } = discountSlice.actions;
export default discountSlice.reducer;

export function getDiscount(store_id, token) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(
        `http://localhost:8000/api/admin/discounts/${store_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setDiscount(response.data.data));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
}
