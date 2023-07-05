import axios from "axios";

export async function deleteAddress(address_id, token) {
  try {
    const response = await axios.delete(
      `http://localhost:8000/api/addresses/${address_id}`,
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

export async function addAddress(data, token) {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/addresses",
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

export async function editAddress(address_id, data, token) {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/addresses/${address_id}`,
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

export async function setMainAddress(address_id, user_id, token) {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/addresses/main-address/${user_id}/${address_id}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    alert(response.data.message);
  } catch (error) {
    alert(error.response.data);
  }
}
