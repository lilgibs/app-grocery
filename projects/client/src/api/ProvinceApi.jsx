import axios from "axios";

export async function fetchProvince() {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/provinces`
    );
    const data = response.data.data;

    return data;
  } catch (error) {
    console.error("Gagal mendapatkan data provinsi:", error);
  }
}
