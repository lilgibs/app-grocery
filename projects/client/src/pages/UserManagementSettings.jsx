import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import React from 'react';

function UserManagementSettings() {

  const validationSchema = Yup.object().shape({
    name: Yup.string()
      .min(2, 'Too Short!')
      .max(50, 'Too Long!')
      .required('Required'),
    email: Yup.string()
      .email('Invalid email')
      .required('Required'),
    password: Yup.string()
      .min(8, 'Password is too short - should be 8 chars minimum.')
      .required('No password provided.'),
    role: Yup.string()
      .oneOf(['branch admin'], 'Invalid Role')
      .required('Required'),
    store_id: Yup.number()
      .positive('Invalid store id')
      .required('Required'),
  });

  const registerBranchAdmin = async (values, setSubmitting, resetForm) => {
    try {
      const res = await axios.post(`http://localhost:8000/admin/create`, values)
      console.log(res.data)
      resetForm();
    } catch (error) {
      console.error(error);
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="w-full max-w-xs sm:max-w-md mx-auto mt-5">
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          role: 'branch admin',
          store_id: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          registerBranchAdmin(values, setSubmitting, resetForm)
        }}
      >
        {({ isSubmitting }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
              <p className="font-semibold text-pink-500 text-lg">Branch Admin</p>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="name">
                Name
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="name" />
              <ErrorMessage name="name" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                Email
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="email" name="email" />
              <ErrorMessage name="email" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                Password
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="password" name="password" />
              <ErrorMessage name="password" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_id">
                Store ID
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="store_id" />
              <ErrorMessage name="store_id" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_name">
                Store Name
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="store_id" />
              <ErrorMessage name="store_id" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_location">
                Store Location
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="store_id" />
              <ErrorMessage name="store_id" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_location">
                Latitude
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="store_id" />
              <ErrorMessage name="store_id" component="div" className="text-red-500 text-xs italic" />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_location">
                Longitude
              </label>
              <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type="text" name="store_id" />
              <ErrorMessage name="store_id" component="div" className="text-red-500 text-xs italic" />
            </div>

            <div className="flex items-center justify-between">
              <button className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit" disabled={isSubmitting}>
                Create
              </button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  )
}

export default UserManagementSettings