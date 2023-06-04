import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";

export default configureStore({
  reducer: {
    admin: adminReducer,
  },
});
