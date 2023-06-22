import React, { useEffect, useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { checkLogin } from "../features/userSlice";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from "@chakra-ui/react";

function Biodata() {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const userToken = localStorage.getItem("user_token");
  const nav = useNavigate();

  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure();

  const initialRef = useRef();

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please input your email"),
  });

  const editUserProfile = async (data) => {
    try {
      let response = await Axios.put(
        `http://localhost:8000/api/profiles/${userGlobal.user_id}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${userToken}`,
          },
        }
      );
      if (response) {
        alert(response.data.message);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  const ModalEditAddress = () => {
    return (
      <Modal
        initialFocusRef={initialRef}
        isOpen={isEditOpen}
        onClose={onEditClose}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Biodata</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <Formik
              initialValues={{
                name: userGlobal.name,
                email: userGlobal.email,
                gender: userGlobal.gender,
                birthdate: userGlobal.birthdate,
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (value) => {
                await editUserProfile(value);
                onEditClose();
                dispatch(checkLogin(userToken));
              }}
            >
              {(values) => {
                return (
                  <Form className="space-y-6">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Name
                      </label>
                      <Field
                        type="text"
                        name="name"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        component="div"
                        name="name"
                        style={{ color: "red" }}
                      />
                      <div className="mt-2"></div>
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Email address
                      </label>
                      <Field
                        type="text"
                        name="email"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        component="div"
                        name="email"
                        style={{ color: "red" }}
                      />
                      <div className="mt-2"></div>
                    </div>
                    <div>
                      <label
                        htmlFor="gender"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Gender
                      </label>

                      <div
                        className="flex gap-5"
                        role="group"
                        aria-labelledby="my-radio-group"
                      >
                        <label>
                          <Field type="radio" name="gender" value="Male" />
                          Male
                        </label>
                        <label>
                          <Field type="radio" name="gender" value="Female" />
                          Female
                        </label>
                        <ErrorMessage
                          component="div"
                          name="gender"
                          style={{ color: "red" }}
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <label
                          htmlFor="birthdate"
                          className="block text-sm font-medium leading-6 text-gray-900"
                        >
                          Birth Date
                        </label>
                      </div>
                      <div className="mt-2">
                        <Field
                          type="date"
                          name="birthdate"
                          className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                        />
                        <ErrorMessage
                          component="div"
                          name="birthdate"
                          style={{ color: "red" }}
                        />
                      </div>
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Submit
                      </button>
                      <button
                        className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        onClick={onEditClose}
                      >
                        Cancel
                      </button>
                    </div>
                  </Form>
                );
              }}
            </Formik>
          </ModalBody>
        </ModalContent>
      </Modal>
    );
  };

  useEffect(() => {
    let isUserGlobalUpdated = false;

    const checkLoginStatus = () => {
      if (isUserGlobalUpdated && userGlobal.user_id === "") {
        nav("/login");
      }
    };

    checkLoginStatus();

    const userGlobalUpdateListener = setInterval(() => {
      if (userGlobal.user_id !== null) {
        isUserGlobalUpdated = true;
        clearInterval(userGlobalUpdateListener);
        checkLoginStatus();
      }
    }, 500);

    return () => {
      clearInterval(userGlobalUpdateListener);
    };
  }, [userGlobal.user_id]);

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-green-500 text-lg">Biodata</p>
        </div>
        <div className="flex flex-col items-start gap-5">
          <p>Name: {userGlobal.name}</p>
          <p>Email: {userGlobal.email}</p>
          <p>Gender: {userGlobal.gender}</p>
          <p>Birthdate: {userGlobal.birthdate}</p>
          <button
            className="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
            onClick={onEditOpen}
          >
            Edit
          </button>
          <ModalEditAddress />
        </div>
      </div>
    </div>
  );
}

export default Biodata;
