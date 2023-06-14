import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import locationReducer from "../features/locationSlice";
import userReducer from "../features/userSlice";
import addressReducer from "../features/addressSlice";

export default configureStore({
  reducer: {
    admin: adminReducer,
    location: locationReducer,
    user: userReducer,
    address: addressReducer,
  },
});
