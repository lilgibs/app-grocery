import axios from "axios";

export async function fetchCity() {
  try {
    const response = await axios.get("http://localhost:8000/api/cities/");
    const data = response.data.data;

    return data;
  } catch (error) {
    console.error("Gagal mendapatkan data kota:", error);
  }
}
