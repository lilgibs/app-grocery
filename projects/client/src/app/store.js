import { configureStore } from "@reduxjs/toolkit";
import adminReducer from "../features/adminSlice";
import userReducer from "../features/userSlice";

export default configureStore({
  reducer: {
    admin: adminReducer,
    user: userReducer,
  },
});
