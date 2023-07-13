import { createSlice } from "@reduxjs/toolkit";
import axios from "axios";

const adminToken = localStorage.getItem("admin_token");

function getConfig(isMultipart = false) {
  const adminToken = localStorage.getItem("admin_token");

  return {
    headers: {
      Authorization: `Bearer ${adminToken}`,
      "Content-Type": isMultipart ? "multipart/form-data" : "application/json",
    },
  };
}

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
    },
    isLoading: true,
  },
  reducers: {
    setProduct: (state, action) => {
      state.product = action.payload;
    },
    resetProduct: (state) => {
      state.product = null;
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setProduct, resetProduct, setLoading } = productSlice.actions;
export default productSlice.reducer;

export function fetchProduct(productId) {
  return async (dispatch) => {
    try {
      const response = await axios.get(
        `http://localhost:8000/api/admin/products/${productId}`,
        getConfig()
      );
      dispatch(setProduct(response.data.product));
      dispatch(setLoading(false));
    } catch (error) {
      console.error(error);
      dispatch(setLoading(false));
    }
  };
}

export function fetchProductUser(productName, storeId) {
  console.log(productName, storeId);

  return async (dispatch) => {
    productName = productName.replace(/-/g, " ");
    let url = `http://localhost:8000/api/products/${productName}?`;
    if (storeId) {
      url += `storeId=${storeId}`;
    }

    try {
      const response = await axios.get(url);
      console.log(response.data.product);
      dispatch(setProduct(response.data.product));
    } catch (error) {
      console.log(error)
      throw error;
    }
  };
}

export function addProduct(product) {
  return async (dispatch) => {
    try {

      let formData = new FormData();
      formData.append("store_id", product.store_id);
      formData.append("product_category_id", product.product_category_id);
      formData.append("product_name", product.product_name);
      formData.append("product_description", product.product_description);
      formData.append("product_price", product.product_price);
      formData.append("product_weight", product.product_weight);
      formData.append("quantity_in_stock", product.quantity_in_stock);

      if (product.product_images) {
        Array.from(product.product_images).forEach((image, index) => {
          formData.append(`product_images`, image);
        });
      }

      let response = await axios.post(
        "http://localhost:8000/api/admin/products",
        formData,
        getConfig(true)
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response.data);
    }
  };
}

export function updateProduct(productId, product) {
  console.log(product);
  return async (dispatch) => {
    try {
      const response = await axios.put(
        `http://localhost:8000/api/admin/products/${productId}`,
        product,
        getConfig()
      );
      console.log(response);
      response.status === 200 &&
        dispatch(fetchProduct(productId)) &&
        alert("Product updated");
    } catch (error) {
      console.error(error);
      alert(error.response.data);
    }
  };
}

export function uploadImage(file, productId, imageId) {
  return async (dispatch) => {
    const formData = new FormData();
    formData.append("product_id", productId);
    formData.append("product_image", file);

    try {
      let response;
      if (imageId) {
        // Jika gambar sudah ada, lakukan pembaruan
        response = await axios.put(
          `http://localhost:8000/api/admin/products/image/${imageId}`,
          formData,
          getConfig(true)
        );
      } else {
        // Jika tidak, unggah gambar baru
        response = await axios.post(
          "http://localhost:8000/api/admin/products/image",
          formData,
          getConfig(true)
        );
      }
      console.log(response);
      alert(response.data.message);
      dispatch(fetchProduct(productId));
    } catch (error) {
      console.log(error);
    }
  };
}

export function deleteImage(imageId, productId) {
  return async (dispatch) => {
    try {
      console.log(imageId);
      const response = await axios.delete(
        `http://localhost:8000/api/admin/products/image/${imageId}/permanently?productId=${productId}`,
        getConfig()
      );
      console.log(response);
      alert(response.data.message);
      dispatch(fetchProduct(productId));
    } catch (error) {
      console.log(error);
      alert(error.response.data.message);
      return null;
    }
  };
}
