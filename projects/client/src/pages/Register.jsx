import React, { useState, useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

const Register = () => {
  const userGlobal = useSelector((state) => state.user.user);
  const nav = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(false);

  const registerUser = async (data) => {
    try {
      setIsLoading(true);
      setIsDisabled(true);
      let response = await Axios.post(
        "http://localhost:8000/api/auth/register",
        data
      );
      if (response) {
        alert(response.data.message);
        nav("/login");
      }
    } catch (error) {
      alert(error.response.data);
      setIsLoading(false);
      setIsDisabled(false);
    }
  };

  const RegisterSchema = Yup.object().shape({
    name: Yup.string().required("Name is required"),
    email: Yup.string()
      .email("Invalid email format")
      .required("Please input your email"),
    password: Yup.string()
      .min(8, "Password must be 8 characters or longer")
      .required("Please input your password")
      .matches(/[0-9]/, "Password requires a number")
      .matches(/[a-z]/, "Password requires a lowercase letter")
      .matches(/[A-Z]/, "Password requires an uppercase letter"),
    phone: Yup.string().required("Phone number is required"),
  });

  useEffect(() => {
    if (userGlobal.user_id > 0) nav("/");
  }, [userGlobal]);

  return (
    <div className="flex flex-row items-start justify-around m-8">
      <div className="flex-initial w-96 max-md:hidden">
        <img
          src="https://freepngimg.com/thumb/ecommerce/1-2-ecommerce-png.png"
          alt=""
          className=""
        />
      </div>
      <div className="flex flex-initial w-96 flex-col shadow-xl rounded-lg p-5">
        <div className="">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Register New Account
          </h2>
        </div>

        <div className="mt-6">
          <Formik
            initialValues={{ name: "", email: "", password: "", phone: "" }}
            validationSchema={RegisterSchema}
            onSubmit={(value) => {
              registerUser(value);
              console.log(value); //checker
            }}
          >
            {(props) => {
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
                      htmlFor="password"
                      className="block text-sm font-medium leading-6 text-gray-900"
                    >
                      Password
                    </label>
                    <Field
                      type="password"
                      name="password"
                      className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                    />
                    <ErrorMessage
                      component="div"
                      name="password"
                      style={{ color: "red" }}
                    />
                    <div className="mt-2"></div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="phone"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Phone Number
                      </label>
                    </div>
                    <div className="mt-2">
                      <Field
                        type="text"
                        name="phone"
                        className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                      />
                      <ErrorMessage
                        component="div"
                        name="phone"
                        style={{ color: "red" }}
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                      disabled={isDisabled}
                    >
                      {isLoading ? "Loading..." : "Submit"}
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

export default Register;
