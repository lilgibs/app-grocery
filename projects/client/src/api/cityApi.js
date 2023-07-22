import axios from "axios";

export async function fetchCity() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/cities`
    );
    const data = response.data.data;

    return data;
  } catch (error) {
    console.error("Gagal mendapatkan data kota:", error);
  }
}
