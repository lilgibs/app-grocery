import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import locationReducer from "../features/locationSlice";
import userReducer from "../features/userSlice";
import addressReducer from "../features/addressSlice";
import productReducer from "../features/productSlice";
import cartReducer from "../features/cartSlice";
import shippingReducer from "../features/shippingSlice";
import orderReducer from "../features/orderSlice";
import discountReducer from "../features/discountSlice";
import voucherReducer from "../features/voucherSlice";

export default configureStore({
  reducer: {
    admin: adminReducer,
    location: locationReducer,
    user: userReducer,
    address: addressReducer,
    product: productReducer,
    cart: cartReducer,
    shipping: shippingReducer,
    order: orderReducer,
    discount: discountReducer,
    voucher: voucherReducer,
  },
});
