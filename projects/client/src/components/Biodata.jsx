import React, { useRef } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
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
import moment from "moment";
import { useCustomToast } from "../hooks/useCustomToast";
import { editUserProfile, uploadProfilePhoto } from "../api/profileApi";

function Biodata() {
  const dispatch = useDispatch();
  const { showSuccessToast, showErrorToast } = useCustomToast();
  const userGlobal = useSelector((state) => state.user.user);
  const userToken = localStorage.getItem("user_token");

  const handleFileChange = async (event) => {
    const file = event.target.files[0];

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      showErrorToast("Only JPEG/JPG/PNG files are supported");
      return;
    }

    if (file.size > 1000000) {
      // size limit 1MB
      showErrorToast("Maximum size is 1MB");
      return;
    }

    const result = await uploadProfilePhoto(
      file,
      userGlobal.user_id,
      userToken
    );
    showSuccessToast(result);
    dispatch(checkLogin(userToken));
  };

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

  const ModalEditProfile = () => {
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
                const result = await editUserProfile(
                  value,
                  userGlobal.user_id,
                  userToken
                );
                onEditClose();
                showSuccessToast(result);
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
                        className="rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      >
                        Submit
                      </button>
                      <button
                        className="rounded-md bg-red-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-red-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
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

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto my-5">
      <div className="px-8 py-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-4 rounded-md mb-8">
          <p className="font-semibold text-green-500 text-lg">Biodata</p>
        </div>
        <div className="flex gap-10 items-center">
          <div className="flex flex-col items-center gap-6 p-6 border shadow rounded">
            <img
              className="w-52 h-52"
              src={
                userGlobal.profile_picture
                  ? `${process.env.REACT_APP_API_IMG_URL}${userGlobal.profile_picture}`
                  : `${process.env.REACT_APP_API_UPLOAD_URL}/default_profile_picture.jpg`
              }
              alt="profile picture"
            />
            <label htmlFor="profile_picture">
              <span className="bg-blue-500 hover:bg-blue-600 font-semibold text-white py-2 px-4 rounded-md cursor-pointer">
                Upload Photo
              </span>
              <input
                className="hidden"
                type="file"
                name="profile_picture"
                id="profile_picture"
                onChange={handleFileChange}
              />
            </label>
          </div>
          <div className="flex flex-col items-start gap-7">
            <p>Name: {userGlobal.name}</p>
            <p>Email: {userGlobal.email}</p>
            <p>Gender: {userGlobal.gender}</p>
            <p>
              Birthdate: {moment(userGlobal.birthdate).format("DD MMMM YYYY")}
            </p>
            <button
              className="bg-green-500 hover:bg-green-600 font-semibold text-white py-2 px-4 rounded-md mb-2"
              onClick={onEditOpen}
            >
              Edit
            </button>
            <ModalEditProfile />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Biodata;
