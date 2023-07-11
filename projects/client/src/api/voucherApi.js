import axios from "axios";

export async function addVoucher(data, token) {
  try {
    const response = await axios.post(
      "http://localhost:8000/api/admin/vouchers",
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

export async function editVoucher(voucher_id, data, token) {
  try {
    const response = await axios.put(
      `http://localhost:8000/api/admin/vouchers/${voucher_id}`,
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
      `http://localhost:8000/api/admin/vouchers/${voucher_id}`,
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
