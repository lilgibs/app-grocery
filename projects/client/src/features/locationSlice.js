import { createSlice } from "@reduxjs/toolkit";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    location: {
      long: 0,
      lang: 0,
    },
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    resetLocation: (state) => {
      state.location = {
        long: 0,
        lang: 0,
      };
    },
  },
});

export const { setLocation, resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
