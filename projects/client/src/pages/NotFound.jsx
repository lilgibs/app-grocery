import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const nav = useNavigate();

  return (
    <div className="flex flex-col justify-center items-center m-7 gap-8">
      <img
        src={process.env.REACT_APP_API_UPLOAD_URL + `/404-icon.png`}
        alt="404 Error"
        className="w-80"
      />
      <p className="font-bold text-3xl">PAGE NOT FOUND</p>
      <p className="font-light text-2xl">
        We couldn't find the page you're looking for. Either you
        <span className="font-bold"> mistype</span>, or you
        <span className="font-bold"> haven't login</span> yet.
      </p>
      <div className="flex gap-5">
        <button
          className="bg-green-600 hover:bg-green-700 font-semibold text-white py-2 px-4 rounded-md"
          onClick={() => {
            nav("/");
          }}
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}

export default NotFound;
