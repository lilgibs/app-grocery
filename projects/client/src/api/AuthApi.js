import axios from "axios";

export async function resetPasswordEmail(data) {
  try {
    let response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`,
      data
    );
    if (response) {
      return response.data.message;
    }
  } catch (error) {
    return error.response.data;
  }
}

export async function changePassword(data, user_id, token) {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/auth/change-password/${user_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      return true;
    }
  } catch (error) {
    return error.response.data;
  }
}

export async function resetPassword(data, token) {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/auth/reset-password`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      return true;
    }
  } catch (error) {
    return error.response.data;
  }
}

export async function tokenVerification(token) {
  try {
    if (token) {
      const response = await axios.post(
        `${process.env.REACT_APP_API_BASE_URL}/auth/verification`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (response) {
        return true;
      }
    }
  } catch (error) {
    return false;
  }
}

export async function reSendVerificationEmail(data) {
  try {
    const response = await axios.post(
      `${process.env.REACT_APP_API_BASE_URL}/auth/re-verification`,
      data
    );
    if (response) {
      return true;
    }
  } catch (error) {
    return error.response.data;
  }
}
