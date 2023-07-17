import { Formik, Form, Field, ErrorMessage, useFormikContext } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { checkLoginAdmin, createBranchAdmin } from '../features/adminSlice';
import { useNavigate } from 'react-router-dom';
import { fetchCity } from '../api/adminCityApi';
import AsyncSelect from 'react-select/async';

function UserManagementSettings() {
  const [latLong, setLatLong] = useState({ lat: '', lng: '' })
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const token = localStorage.getItem('admin_token');
  const role = useSelector(state => state.admin.admin.role);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const loadCityOptions = (inputValue, callback) => {
    if (inputValue.length > 2) {
      fetchCity(token, inputValue).then((results) => callback(results));
    }
  }

  const getCoordinates = async (storeLocation, setFieldValue) => {
    try {
      const response = await axios.get('https://api.opencagedata.com/geocode/v1/json', {
        params: {
          key: '2f4f0ad57fa84f479b636bf7d556b763',
          q: storeLocation,
        }
      });
      const data = response.data
      if (data.results && data.results.length > 0) {
        const { lat, lng } = data.results[0].geometry;
        setLatLong({ lat, lng })
        setFieldValue('latitude', lat);
        setFieldValue('longitude', lng);
      } else {
        alert('Location not found!'); // Data lokasi tidak ditemukan
        setLatLong({ lat: '', lng: '' });
      }
    } catch (error) {
      console.error(error);
      alert('There was an error fetching the coordinates.');
    }
  }

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
    store_name: Yup.string()
      .required('Required'),
    store_location: Yup.string()
      .required('Required'),
    latitude: Yup.number()
      .typeError('Latitude must be a number')
      .required('Required'),
    longitude: Yup.number()
      .typeError('Longitude must be a number')
      .required('Required')
  });

  const CustomInput = ({ name, type, label, children }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <div className='flex flex-row gap-1'>
        <Field className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type={type} name={name} />
        {children}
      </div>
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs italic" />
    </div>
  );

  useEffect(() => {
    if (role !== null) {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && role !== 99) {
      navigate('/');
    }
  }, [role, navigate, loading]);


  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full max-w-xs flex-col sm:max-w-xl mx-auto mt-5">
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
          role: 1,
          store_name: '',
          store_location: '',
          latitude: '',
          longitude: '',
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          dispatch(createBranchAdmin({
            ...values,
            latitude: latLong.lat,
            longitude: latLong.lng
          }))
          resetForm();
          setLatLong({ lat: '', lng: '' })
          setSubmitting(false);
        }}
      >
        {({ isSubmitting, setFieldValue, setFieldTouched }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
              <p className="font-semibold text-pink-500 text-lg">Branch Admin</p>
            </div>
            <div className='flex flex-col sm:flex-row sm:gap-4'>
              <div className='sm:w-1/2'>
                <CustomInput name="name" type="text" label="Name" />
                <CustomInput name="email" type="email" label="Email" />
                <CustomInput name="password" type="password" label="Password" />
              </div>
              <div className='sm:w-1/2'>
                <CustomInput name="store_name" type="text" label="Store Name" />
                <div className="mb-4">

                  <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="store_location">
                    Store Location
                  </label>
                  <AsyncSelect
                    cacheOptions
                    loadOptions={loadCityOptions}
                    defaultOptions
                    onInputChange={setInputValue}
                    onChange={(selectedOption) => {
                      if (selectedOption) {
                        setFieldValue('store_location', selectedOption.label);
                        getCoordinates(selectedOption.label, setFieldValue);
                      }
                      else {
                        setFieldValue('store_location', '');
                      }
                    }}
                    onBlur={() => setFieldTouched('store_location', true)}
                  />
                  <ErrorMessage name='store_location' component="div" className="text-red-500 text-xs italic" />
                </div>
                <div className='flex flex-row gap-2'>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="latitude">
                      Latitude
                    </label>
                    <Field
                      className="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="latitude"
                      value={latLong.lat}
                      disabled
                    />
                    <ErrorMessage name="latitude" component="div" className="text-red-500 text-xs italic" />
                  </div>
                  <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="longitude">
                      Longitude
                    </label>
                    <Field
                      className="bg-gray-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                      type="text"
                      name="longitude"
                      value={latLong.lng}
                      disabled
                    />
                    <ErrorMessage name="longitude" component="div" className="text-red-500 text-xs italic" />
                  </div>
                </div>
              </div>
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