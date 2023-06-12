import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { addProduct } from '../features/productSlice';
import CreatableSelect from 'react-select/creatable';
import axios from 'axios';

function AddProduct() {
  const [productOptions, setProductOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isNewOption, setIsNewOption] = useState(false);


  const fetchProductOptions = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/products/'); // Ganti dengan endpoint yang sesuai untuk mengambil data produk dari database
      console.log(response)

      const products = response.data.products;

      const options = products.map((product) => ({
        value: product.product_id,
        label: product.product_name,
      }));

      setProductOptions(options);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchProductOptions(); // Memuat data produk dari database saat komponen dimount
  }, []);

  const dispatch = useDispatch()

  const getValidationSchema = () => {
    if (isNewOption) {
      return Yup.object().shape({
        store_id: Yup.number()
          .required('Required'),
        product_category_id: Yup.number()
          .required('Required'),
        product_description: Yup.string()
          .required('Required'),
        product_price: Yup.number()
          .required('Required'),
      });
    } else {
      return Yup.object().shape({
        store_id: Yup.number()
          .required('Required'),
        product_category_id: Yup.number()
          .required('Required'),
      });
    }
  }

  const CustomInput = ({ name, type, label, disabled }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <Field className="disabled:bg-slate-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type={type} name={name} disabled={disabled} />

      <ErrorMessage name={name} component="div" className="text-red-500 text-xs italic" />

    </div>
  );


  return (
    <div className="w-full max-w-xs flex-col sm:max-w-xl mx-auto mt-5">
      <Formik
        initialValues={{
          store_id: '',
          product_category_id: '',
          product_name: '',
          product_description: '',
          product_price: '',
          quantity_in_stock: '',
          product_images: []
        }}
        validationSchema={getValidationSchema()}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          setSubmitting(true);
          dispatch(addProduct(values))
          console.log(values)
          resetForm();
          setSubmitting(false);
        }}

      >
        {({ isSubmitting, setFieldValue }) => (
          <Form className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
              <p className="font-semibold text-pink-500 text-lg">Add Product</p>
            </div>
            <CustomInput name="store_id" type="number" label="Store ID" />
            <CustomInput name="product_category_id" type="text" label="Product Category ID" />
            {/* <CustomInput name="product_name" type="text" label="Product Name" /> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_name">
                Product Name
              </label>
              <CreatableSelect
                id="product_name"
                name="product_name"
                options={productOptions}
                onChange={(selectedOption) => {
                  setSelectedOption(selectedOption);
                  setIsNewOption(selectedOption && selectedOption.__isNew__);
                  setFieldValue('product_name', selectedOption ? selectedOption.label : '');
                }}
              // onBlur={() => {
              //   setFieldValue('product_name', '');
              // }}
              />
              {/* <ErrorMessage name="product_name" component="div" className="text-red-500 text-xs italic" /> */}
            </div>
            <CustomInput name="product_description" type="text" label="Product Description" disabled={!isNewOption} />
            <CustomInput name="product_price" type="number" label="Product Price" disabled={!isNewOption} />
            <CustomInput name="quantity_in_stock" type="number" label="Product Quantity" />
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_images" disabled={!isNewOption}>
                Product Images
              </label>
              <input
                disabled={!isNewOption}
                className="disabled:bg-slate-100  shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                id="product_images"
                name="product_images"
                onChange={(event) => {
                  setFieldValue("product_images", event.currentTarget.files);
                }}
                multiple
              />
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

export default AddProduct
