import React from "react";
import { useSelector } from "react-redux";
import { useState } from "react";
import {
  Spinner,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

function Setting() {
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);
  const userToken = localStorage.getItem("user_token");
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto my-5">
      <div className="px-8 py-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-4 rounded-md mb-8">
          <p className="font-semibold text-green-500 text-lg">Settings</p>
        </div>
        <button
          className="bg-blue-500 hover:bg-blue-600 font-semibold text-white py-2 px-4 rounded-md"
          onClick={async () => {
            nav("/change-password");
          }}
        >
          Change Password
        </button>
        {isLoading && (
          <Modal isOpen={true} isCentered>
            <ModalOverlay />
            <ModalContent bg="transparent" boxShadow="none">
              <ModalBody textAlign="center">
                <Spinner size="xl" />
              </ModalBody>
            </ModalContent>
          </Modal>
        )}
      </div>
    </div>
  );
}

export default Setting;
