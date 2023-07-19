import React, { useState } from "react";
import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import { useToast } from "@chakra-ui/react";
import { reSendVerificationEmail } from "../api/authApi";
import CustomSpinner from "../components/Spinner";

const EmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false);
  const toast = useToast();

  const ValidationSchema = Yup.object().shape({
    email: Yup.string()
      .email("Invalid email format")
      .required("Please input your email"),
  });

  const handleSubmit = async (value) => {
    setIsLoading(true);
    let result = await reSendVerificationEmail(value);
    if (result === true) {
      toast({
        title: "Email sent.",
        description: "Please check your email.",
        position: "top",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
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
    setIsLoading(false);
  };

  return (
    <div className="flex flex-row items-start justify-around m-8">
      {isLoading && <CustomSpinner />}
      <div className="flex flex-initial w-96 flex-col shadow-xl rounded-lg p-5">
        <div className="">
          <img
            className="mx-auto h-10 w-auto"
            src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600"
            alt="Your Company"
          />
          <h2 className="mt-6 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">
            Account Verification Email
          </h2>
        </div>

        <div className="mt-6">
          <Formik
            initialValues={{ email: "" }}
            validationSchema={ValidationSchema}
            onSubmit={(value) => {
              handleSubmit(value);
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
                    <button
                      type="submit"
                      className="flex w-full justify-center rounded-md bg-green-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-green-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                    >
                      Send Email
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

export default EmailVerification;
