import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export const productSlice = createSlice({
  name: "product",
  initialState: {
    product: {
      product_id: null,
      product_category_id: null,
      product_name: null,
      product_description: null,
      product_price: null,
      product_images: [],
    }
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload
    }
  }
})

export const { setProduct } = productSlice.actions
export default productSlice.reducer

export function fetchProduct(productId) {
  return async (dispatch) => {
    try {
      const response = await axios.get(`http://localhost:8000/api/admin/products/${productId}`);
      console.log(response)
      dispatch(setProduct(response.data.product));
    } catch (error) {
      console.error(error);
    }
  };
}

export function addProduct(product) {
  return async (dispatch) => {
    try {
      console.log(product)

      let formData = new FormData()
      formData.append("store_id", product.store_id);
      formData.append("product_category_id", product.product_category_id);
      formData.append("product_name", product.product_name);
      formData.append("product_description", product.product_description);
      formData.append("product_price", product.product_price);
      formData.append("quantity_in_stock", product.quantity_in_stock);

      if (product.product_images) {
        Array.from(product.product_images).forEach((image, index) => {
          formData.append(`product_images`, image)
        })
      }

      let response = await axios.post("http://localhost:8000/api/admin/products/add-product", formData)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }
}
