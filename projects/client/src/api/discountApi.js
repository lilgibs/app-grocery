import axios from "axios";

export async function addDiscount(data, token) {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/admin/discounts",
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(response.data.message);
  } catch (error) {
    alert(error.response.data);
    console.error(error);
  }
}

export async function editDiscount(discount_id, data, token) {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/admin/discounts/${discount_id}`,
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
      `http://localhost:8000/api/admin/discounts/${discount_id}`,
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
