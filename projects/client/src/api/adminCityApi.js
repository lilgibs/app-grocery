import axios from "axios";

export async function fetchCity(adminToken, city) {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/auth/cities`, {
      params: {
        city
      },
      headers: {
        'Authorization': `Bearer ${adminToken}`
      }
    });
    const cities = response.data.data;
    const formattedCities = cities.map((city) => ({
      value: city.city_id,
      label: city.city_name,
    }));

    return formattedCities
  } catch (error) {
    console.error(error);
  }
}
