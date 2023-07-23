import axios from "axios";

export async function getVoucher(store_id, token) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/admin/vouchers/${store_id}`,
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

export async function addVoucher(data, token) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/admin/vouchers`,
      data,
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

export async function editVoucher(voucher_id, data, token) {
  try {
    const response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/admin/vouchers/${voucher_id}`,
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

export async function deleteVoucher(voucher_id, token) {
  try {
    const response = await axios.delete(
      `${process.env.REACT_APP_API_BASE_URL}/admin/vouchers/${voucher_id}`,
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
