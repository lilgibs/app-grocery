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
      nearestStore: "",
    },
    isLoaded: false,
  },
  reducers: {
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setNearestStore: (state, action) => {
      state.location.nearestStore = action.payload;
    },
    resetLocation: (state) => {
      state.location = {
        lat: 0,
        long: 0,
        city: "",
        nearestStore: "",
      };
    },
    setLoaded: (state, action) => {
      state.isLoaded = action.payload;
    },
  },
});

export function getCityStore(latitude, longitude) {
  return async (dispatch) => {
    try {
      let response = await Axios.get(
        `https://api.opencagedata.com/geocode/v1/json?q=${latitude},${longitude}&key=a79e4746db0e4c60969ae10f96ce7bb2&language=en&pretty=1`
      );
      if (response) {
        let city = response.data.results[0].components.city;

        let location = {
          lat: latitude,
          long: longitude,
          city: city,
          nearestStore: "",
        };

        dispatch(setLocation(location));
      }

      let stores = await Axios.get("http://localhost:8000/api/stores");
      if (stores) {
        let storeArray = stores.data.data;
        let storeDistances = [];

        storeArray.forEach((x) => {
          let lat1 = latitude;
          let lon1 = longitude;
          let lat2 = x.latitude;
          let lon2 = x.longitude;

          const R = 6371e3;
          const p1 = (lat1 * Math.PI) / 180;
          const p2 = (lat2 * Math.PI) / 180;
          const deltaLon = lon2 - lon1;
          const deltaLambda = (deltaLon * Math.PI) / 180;
          const d =
            Math.acos(
              Math.sin(p1) * Math.sin(p2) +
                Math.cos(p1) * Math.cos(p2) * Math.cos(deltaLambda)
            ) * R;
          storeDistances.push(d);
        });

        let nearestDistance = Math.min(...storeDistances);
        let nearestStore = storeDistances.indexOf(nearestDistance);

        dispatch(setNearestStore(storeArray[nearestStore]));
      }
    } catch (error) {
      console.error(error.response);
    } finally {
      dispatch(setLoaded(true));
    }
  };
}

export const { setLocation, resetLocation, setNearestStore, setLoaded } =
  locationSlice.actions;
export default locationSlice.reducer;
