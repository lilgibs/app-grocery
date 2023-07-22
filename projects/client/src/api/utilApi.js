import axios from "axios";

export async function getCoordinates(storeLocation) {
  try {
    const response = await axios.get(
      "https://api.opencagedata.com/geocode/v1/json",
      {
        params: {
          key: "9f48b305cf314d489b980f43d69e0cab",
          q: storeLocation,
        },
      }
    );
    const data = response.data;
    if (data.results && data.results.length > 0) {
      return data.results[0].geometry;
    } else {
      // Data lokasi tidak ditemukan
      alert("Location not found!");
    }
  } catch (error) {
    console.error(error);
    alert("There was an error fetching the coordinates.");
  }
}
