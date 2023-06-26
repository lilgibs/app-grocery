import React, { useEffect } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { loginAdmin } from "../features/adminSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

const AdminLogin = () => {
  const dispatch = useDispatch();
  const nav = useNavigate();

  const adminGlobal = useSelector((state) => state.admin.admin);

  const LoginAdminSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Please input your email"),
    password: Yup.string().min(3, "Password must be 3 characters or longer").required("Please input your password"),
  });

  useEffect(() => {
    if (adminGlobal.id > 0) nav("/admin/dashboard");
  }, [adminGlobal]);

  return (
    <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-sm">
        {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
        <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Admin Login</h2>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
        <Formik
          initialValues={{ email: "", password: "" }}
          validationSchema={LoginAdminSchema}
          onSubmit={(value) => {
            //alert("testing ");
            dispatch(loginAdmin(value));
          }}
        >
          {(props) => {
            // console.log(props);
            return (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium leading-6 text-gray-900">
                    Email address
                  </label>
                  <Field
                    type="text"
                    name="email"
                    className="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                  <ErrorMessage component="div" name="email" style={{ color: "red" }} />
                  <div className="mt-2"></div>
                </div>

                <div>
                  <div className="flex items-center justify-between">
                    <label htmlFor="password" className="block text-sm font-medium leading-6 text-gray-900">
                      Password
                    </label>
                    <div className="text-sm">
                      <a href="/" className="font-semibold text-green-600 hover:text-green-500">
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
                    <ErrorMessage component="div" name="password" style={{ color: "red" }} />
                  </div>
                </div>

                <div>
                  <button
                    type="submit"
                    className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-green-600"
                  >
                    Login
                  </button>
                </div>
              </Form>
            );
          }}
        </Formik>

        <p className="mt-10 text-center text-sm text-gray-500">
          Not an admin?{" "}
          <a href="/login" className="font-semibold leading-6 text-green-600 hover:text-green-500">
            Login as a user
          </a>
        </p>
      </div>
    </div>
  );
};

export default AdminLogin;
