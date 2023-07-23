import axios from "axios";

export async function deleteAddress(address_id, token) {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/addresses/${address_id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    console.error(error);
  }
}

export async function addAddress(data, token) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/addresses`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return true;
  } catch (error) {
    return error.response.data;
  }
}

export async function editAddress(address_id, data, token) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/addresses/${address_id}`,
      data,
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

export async function setMainAddress(address_id, user_id, token) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/addresses/main-address/${user_id}/${address_id}`,
      {},
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
