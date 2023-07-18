import React, { useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginUser } from "../features/userSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useToast } from "@chakra-ui/react";

const Login = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();
  const toast = useToast();

  const userGlobal = useSelector((state) => state.user.user);

  const LoginSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Please input your email"),
    password: Yup.string()
      .min(3, "Password must be 3 characters or longer")
      .required("Please input your password"),
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
            User Login
          </h2>
        </div>

        <div className="mt-6">
          <Formik
            initialValues={{ email: "", password: "" }}
            validationSchema={LoginSchema}
            onSubmit={(value, { setSubmitting }) => {
              dispatch(loginUser(value)).then((result) => {
                setSubmitting(false);
                if (result === true) {
                  toast({
                    title: "Login Success",
                    position: "top",
                    status: "success",
                    duration: 5000,
                    isClosable: true,
                  });
                  window.location.reload();
                } else {
                  toast({
                    title: "Error",
                    description: result,
                    position: "top",
                    status: "error",
                    duration: 5000,
                    isClosable: true,
                  });
                }
              });
            }}
          >
            {(props) => {
              return (
                <Form className="space-y-6">
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
                    <div className="flex items-center justify-between">
                      <label
                        htmlFor="password"
                        className="block text-sm font-medium leading-6 text-gray-900"
                      >
                        Password
                      </label>
                      <div className="text-sm">
                        <a
                          href="/reset-password"
                          className="font-semibold text-indigo-600 hover:text-indigo-500"
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>
                    <div className="mt-2">
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
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Login
                    </button>
                  </div>
                </Form>
              );
            }}
          </Formik>

          <p className="mt-8 text-center text-sm text-gray-500">
            Haven't register yet?{" "}
            <a
              href="/register"
              className="font-semibold leading-6 text-green-600 hover:text-green-500"
            >
              Register
            </a>
          </p>

          <p className="mt-1 text-center text-sm text-gray-500">
            <a
              href="/adminLogin"
              className="font-semibold leading-6 text-green-600 hover:text-green-500"
            >
              Login as an admin
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
