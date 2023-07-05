import React from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { changePassword } from "../api/AuthApi";

const ChangePassword = () => {
  const nav = useNavigate();

  const userGlobal = useSelector((state) => state.user.user);
  const userToken = localStorage.getItem("user_token");

  const changePasswordSchema = Yup.object().shape({
    oldPassword: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Please input your password")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter"),
    newPassword: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Please input your password")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter"),
    repeatNewPassword: Yup.string()
      .required("Please re-type your password")
      .oneOf([Yup.ref("newPassword")], "Passwords does not match"),
  });

  return (
    <div className="flex flex-row items-start justify-around m-8">
      <div className="flex flex-initial w-96 flex-col shadow-xl rounded-lg p-5">
        <div className="">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Change Password
          </h2>
        </div>
        <div className="mt-6">
          <Formik
            initialValues={{
              oldPassword: "",
              newPassword: "",
              repeatNewPassword: "",
            }}
            validationSchema={changePasswordSchema}
            onSubmit={async (value) => {
              const response = await changePassword(
                value,
                userGlobal.user_id,
                userToken
              );
              console.log(response);
              if (response) {
                nav("/profile");
              }
            }}
          >
            {(props) => {
              return (
                <Form className="space-y-6">
                  <div>
                    <label
                      htmlFor="oldPassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Old Password
                    </label>
                    <Field
                      type="password"
                      name="oldPassword"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      component="div"
                      name="oldPassword"
                      style={{ color: "red" }}
                    />
                    <div className="mt-2"></div>
                  </div>

                  <div>
                    <label
                      htmlFor="newPassword"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      New Password
                    </label>
                    <Field
                      type="password"
                      name="newPassword"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      component="div"
                      name="newPassword"
                      style={{ color: "red" }}
                    />
                    <div className="mt-2"></div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="repeatNewPassword"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Confirm New Password
                      </label>
                    </div>
                    <div className="mt-2">
                      <Field
                        type="password"
                        name="repeatNewPassword"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        component="div"
                        name="repeatNewPassword"
                        style={{ color: "red" }}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Change Password
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
