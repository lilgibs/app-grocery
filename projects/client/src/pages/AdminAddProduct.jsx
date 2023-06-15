import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { useDispatch, useSelector } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { addProduct } from '../features/productSlice';
import CreatableSelect from 'react-select/creatable';
import { IoMdRemoveCircle } from 'react-icons/io';

import Select from 'react-select';
import axios from 'axios';

function AddProduct() {
  const [loading, setLoading] = useState(true);
  const [productOptions, setProductOptions] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isClearable, setIsClearable] = useState(true);
  const [isNewOption, setIsNewOption] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const adminStoreId = useSelector(state => state.admin.admin.store_id);
  const dispatch = useDispatch()

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/products/categories/');
      console.log(response.data.data)

      const categories = response.data.data

      const options = categories.map((category) => ({
        value: category.product_category_id,
        label: category.product_category_name,
      }));
      setCategoryOptions(options);
    } catch (error) {
      console.error(error);
    }
  };

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
      // setProductOptions(products.map(({ product_id, product_name }) => ({ value: product_id, label: product_name })));
    } catch (error) {
      console.error(error);
    }
  };

  const handleImageRemove = (index, values, setFieldValue) => {
    const newImagePreviews = [...imagePreviews];
    newImagePreviews.splice(index, 1);
    setImagePreviews(newImagePreviews);

    // Untuk file gambar asli
    const newImages = [...values.product_images];
    newImages.splice(index, 1);
    setFieldValue('product_images', newImages);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('admin_token');

  //   if (token) { // check if the admin is logged in
  //     dispatch(checkLoginAdmin(token));
  //   }
  //   else { // set loading to false if no token is found     
  //     setLoading(false);
  //   }
  // }, [dispatch]);

  // useEffect(() => {
  //   if (role !== null) {
  //     setLoading(false);
  //   }
  // }, [role]);

  // // useEffect(() => {
  // //   if (!loading && role !== 1) {
  // //     navigate('/');
  // //   }
  // else {
  // fetchCategories();
  // fetchProductOptions(); 
  // }
  // // }, [role, navigate, loading]);

  useEffect(() => {
    fetchCategories();
    fetchProductOptions(); // Memuat data produk dari database saat komponen dimount
  }, []);


  const getValidationSchema = () => {
    if (isNewOption) {
      return Yup.object().shape({
        store_id: Yup.number()
          .required('Required'),
        product_category_id: Yup.number()
          .required('Required'),
        product_name: Yup.string()
          .required('Required'),
        product_description: Yup.string()
          .required('Required'),
        product_price: Yup.number()
          .required('Required'),
        quantity_in_stock: Yup.number()
          .required('Required'),
        product_images: Yup.array()
          .required('Required')
          .min(1, 'At least one image is required')
          .max(3, 'You can only upload up to 3 images')
      });
    } else {
      return Yup.object().shape({
        store_id: Yup.number()
          .required('Required'),
        product_name: Yup.string()
          .required('Required'),
        quantity_in_stock: Yup.number()
          .required('Required')
      });
    }
  }

  const CustomInput = ({ name, type, label, disabled }) => (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor={name}>
        {label}
      </label>
      <Field className="disabled:bg-neutral-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline" type={type} name={name} disabled={disabled} />
      <ErrorMessage name={name} component="div" className="text-red-500 text-xs italic" />
    </div>
  );

  return (
    <div className="w-[95%] sm:max-w-md md:max-w-xl flex-col mx-auto mt-5">
      <Formik
        enableReinitialize
        initialValues={{
          store_id: adminStoreId || '',
          product_category_id: null,
          product_name: null,
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
        {({ isSubmitting, values, setFieldValue }) => (
          <Form className="bg-white border shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
              <p className="font-semibold text-pink-500 text-lg">Add Product</p>
            </div>
            <CustomInput name="store_id" type="number" label="Store ID" disabled={adminStoreId} />
            {/* <CustomInput name="product_category_id" type="text" label="Product Category ID" /> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_category_id">
                Product Category
              </label>
              <Select
                id="product_category_id"
                name="product_category_id"
                isClearable={isClearable}
                isDisabled={!isNewOption}
                options={categoryOptions}
                onChange={(selectedOption) => {
                  setFieldValue('product_category_id', selectedOption ? selectedOption.value : '');
                }}
              />
              <ErrorMessage name="product_category_id" component="div" className="text-red-500 text-xs italic" />
            </div>
            {/* <CustomInput name="product_name" type="text" label="Product Name" /> */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="product_name">
                Product Name
              </label>
              <CreatableSelect
                id="product_name"
                name="product_name"
                isClearable={isClearable}
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
              <ErrorMessage name="product_name" component="div" className="text-red-500 text-xs italic" />
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
                className="disabled:bg-neutral-100 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                type="file"
                id="product_images"
                name="product_images"
                onChange={(event) => {
                  setFieldValue("product_images", [...event.currentTarget.files]);
                  const fileUrls = Array.from(event.currentTarget.files).map((file) =>
                    URL.createObjectURL(file)
                  );
                  setImagePreviews(fileUrls);
                }}
                multiple
              />
              <ErrorMessage name="product_images" component="div" className="text-red-500 text-xs italic" />
              <div className='flex flex-row gap-2 mt-2'>
                {imagePreviews.map((preview, index) => (
                  <div className='w-16 sm:w-20 border-2 relative'>
                    <img key={index} src={preview} alt={`Preview ${index}`} />
                    <button
                      className='absolute right-0 top-0 focus:outline-none bg-white rounded-full'
                      onClick={() => handleImageRemove(index, values, setFieldValue)}
                    >
                      <IoMdRemoveCircle color='red' size={20} />
                    </button>
                  </div>
                ))}
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

export default AddProduct
