import axios from "axios";

export async function fetchProducts(storeId) {
  console.log(storeId)
  let url = `http://localhost:8000/api/products`;
  if (storeId) {
    url += `?storeId=${storeId}`;
  }
  try {
    url
    const response = await axios.get(url)
    if (storeId) {
      url += `storeId=${storeId}`
    }
    console.log(response)
    const products = response.data.products
    return products
  } catch (error) {
    console.error(error)
  }
}