import axios from "axios";

export async function fetchProvince() {
  try {
    const response = await axios.get("http://localhost:8000/api/provinces/");
    const data = response.data.data;

    return data;
  } catch (error) {
    console.error("Gagal mendapatkan data provinsi:", error);
  }
}
