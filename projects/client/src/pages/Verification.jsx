import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useToast } from "@chakra-ui/react";

function Verification() {
  let { token } = useParams();
  const navigate = useNavigate();
  const toast = useToast();
  const [result, setResult] = useState(null);
  const successImageUrl =
    process.env.REACT_APP_API_UPLOAD_URL + "/success-image.png";
  const errorImageUrl =
    process.env.REACT_APP_API_UPLOAD_URL + "/error-image.png";

  const tokenVerification = async () => {
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
          toast({
            title: "Success",
            description: "Your email is verified.",
            position: "top",
            status: "success",
            duration: 5000,
            isClosable: true,
          });
          setResult(true);
        }
      }
    } catch (error) {
      toast({
        title: "Verification link expired.",
        description: error.response.data,
        position: "top",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
      setResult(false);
    }
  };

  useEffect(() => {
    tokenVerification();
  }, []);

  return (
    <div>
      {result && (
        <div className="flex flex-col justify-center items-center mt-8 gap-3">
          <img className="w-52 mb-6" src={successImageUrl} alt="" />
          <p className="font-bold text-2xl">
            You are verified! You can login now
          </p>
          <button
            className="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 rounded-md"
            onClick={() => {
              navigate("/login");
            }}
          >
            Login
          </button>
        </div>
      )}
      {!result && (
        <div className="flex flex-col justify-center items-center mt-8 gap-3">
          <img className="w-52 mb-6" src={errorImageUrl} alt="" />
          <p className="font-bold text-2xl">
            Your verification link has expired! Ask for a new verification Email
          </p>
          <button
            className="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 rounded-md"
            onClick={() => {
              navigate("/verification/email");
            }}
          >
            Send new Email
          </button>
        </div>
      )}
    </div>
  );
}

export default Verification;
