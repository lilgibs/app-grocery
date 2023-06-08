import axios from "axios";
import React, { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

function Verification() {
  let { token } = useParams();
  const navigate = useNavigate();

  const tokenVerification = async () => {
    try {
      if (token) {
        const response = await axios.post(
          "http://localhost:8000/api/auth/verification",
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        if (response) {
          alert(response.data.message);
          navigate("/login");
        }
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  useEffect(() => {
    tokenVerification();
  }, []);

  return (
    <div>
      <p>Your account is being verified</p>
      <p>{token}</p>
    </div>
  );
}

export default Verification;
