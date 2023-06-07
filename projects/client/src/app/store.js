import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import locationReducer from "../features/locationSlice";

export default configureStore({
  reducer: {
    admin: adminReducer,
    location: locationReducer,
  },
});
