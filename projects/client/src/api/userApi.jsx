import axios from "axios";

export async function fetchProducts(storeId) {
  let url = `http://localhost:8000/api/products`;
  if (storeId) {
    url += `?storeId=${storeId}`;
  }
  
  try {
    const response = await axios.get(url)
    if (storeId) {
      url += `storeId=${storeId}`
    }
    console.log(response.data.products)
    const products = response.data.products
    return products
  } catch (error) {
    console.error(error)
  }
}