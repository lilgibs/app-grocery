import { createSlice } from "@reduxjs/toolkit";
import Axios from "axios";
import { useDispatch } from "react-redux";

export const locationSlice = createSlice({
  name: "location",
  initialState: {
    location: {
      lat: 0,
      long: 0,
      city: "",
    },
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    resetLocation: (state) => {
      state.location = {
        lat: 0,
        long: 0,
        city: "",
      };
    },
  },
});

export function getLandingPageCity(latitude, longitude) {
  return async (dispatch) => {
    // console.log(latitude); //checker
    // console.log(longitude); //checker
    try {
      let response = await Axios.get(`https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=a79e4746db0e4c60969ae10f96ce7bb2&language=en&pretty=1`);
      if (response) {
        let city = response.data.results[0].components.city;

        let location = {
          lat: latitude,
          long: longitude,
          city: city,
        };

        console.log(location); //checker
        dispatch(setLocation(location));
      }
    } catch (error) {
      console.error(error.response);
    }
  };
}

export const { setLocation, resetLocation } = locationSlice.actions;
export default locationSlice.reducer;
