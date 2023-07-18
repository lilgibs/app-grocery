import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";

export const voucherSlice = createSlice({
  name: "vouchers",
  initialState: {
    voucher: [],
  },
  reducers: {
    setVoucher: (state, action) => {
      state.voucher = action.payload;
    },
    resetVoucher: (state) => {
      state.voucher = null;
    },
  },
});

export const { setVoucher, resetVoucher } = voucherSlice.actions;
export default voucherSlice.reducer;

export function getVoucher(store_id, token) {
  return async (dispatch) => {
    try {
      const response = await Axios.get(
        `${process.env.REACT_APP_API_BASE_URL}/admin/vouchers/${store_id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        dispatch(setVoucher(response.data.data));
      }
    } catch (error) {
      console.log(error.response.data);
    }
  };
}
