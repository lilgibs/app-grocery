import axios from "axios";

export async function resetPasswordEmail(data) {
  try {
    let response = await axios.post(
      `http://localhost:8000/api/auth/reset-password`,
      data
    );
    if (response) {
      alert(response.data.message);
    }
  } catch (error) {
    alert(error.response.data);
  }
}

export async function changePassword(data, user_id, token) {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/auth/change-password/${user_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      alert(response.data.message);
      return true;
    }
  } catch (error) {
    alert(error.response.data);
  }
}

export async function resetPassword(data, token) {
  try {
    let response = await axios.put(
      `http://localhost:8000/api/auth/reset-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      alert(response.data.message);
      return true;
    }
  } catch (error) {
    alert(error.response.data);
  }
}
