import axios from "axios";

export async function getDiscounts(store_id, token) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/admin/discounts/${store_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      return response.data.data;
    }
  } catch (error) {
    console.log(error.response.data);
  }
}

export async function addDiscount(data, token) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/admin/discounts`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (error) {
    return error.response.data;
  }
}

export async function editDiscount(discount_id, data, token) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/admin/discounts/${discount_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(response.data.message);
    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function deleteDiscount(discount_id, token) {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/admin/discounts/${discount_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.message;
  } catch (error) {
    return error.response.data;
  }
}
