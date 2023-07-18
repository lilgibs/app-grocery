import axios from "axios";

export async function uploadProfilePhoto(file, user_id, token) {
  try {
    const formData = new FormData();
    formData.append("profile_picture", file);

    let response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/profiles/profile-picture/${user_id}`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (response) {
      alert(response.data.message);
    }
  } catch (error) {
    alert(error.response.data);
  }
}

export async function editUserProfile(data, user_id, token) {
  try {
    let response = await axios.put(
      `${process.env.REACT_APP_API_BASE_URL}/profiles/${user_id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response) {
      alert(response.data.message);
    }
  } catch (error) {
    alert(error.response.data);
  }
}
