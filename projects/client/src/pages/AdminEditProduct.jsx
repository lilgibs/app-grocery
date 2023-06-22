import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { deleteImage, fetchProduct, updateProduct, uploadImage } from '../features/productSlice';
import { checkLoginAdmin } from '../features/adminSlice';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { fetchCategories } from '../api/adminApi';
import Select from 'react-select';

function AdminEditProduct() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const role = useSelector(state => state.admin.admin.role);
  const product = useSelector(state => state.product.product);
  const adminToken = localStorage.getItem('admin_token');

  const [images, setImages] = useState(Array(3).fill(null));

  const validationSchema = Yup.object().shape({
    product_id: Yup.string().required('Required'),
    product_name: Yup.string().required('Required'),
    product_description: Yup.string().required('Required'),
    product_price: Yup.number().required('Required')
  });

  const handleImageUpload = async (event, index) => {
    const file = event.target.files[0];

    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      alert('Only JPEG/JPG/PNG files are supported');
      return;
    }

    if (file.size > 1000000) { // size limit 1MB
      alert('Maximum size is 1MB');
      return;
    }

    const imageId = images[index]?.product_image_id; // Get the image id, if it exists
    dispatch(uploadImage(file, productId, imageId)); // dispatch the thunk
  }

  useEffect(() => {
    adminToken ? dispatch(checkLoginAdmin(adminToken)) : setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (role !== null) {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && (role !== 99 && role !== 1)) {
      navigate('/');
    } else {
      dispatch(fetchProduct(productId));
    }
  }, [role, navigate, loading, productId, dispatch]);

  useEffect(() => {
    if (product) {
      const imagesArray = [...product.product_images, ...Array(3 - product.product_images.length).fill(null)];
      setImages(imagesArray);
    }
  }, [product]);

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategories(result);
    };

    getCategories();
  }, []);

  const CustomInput = ({ label, name, type = 'text', disabled = false, options = null }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
      <div className="mb-4 md:flex md:flex-row">
        <label className="md:w-1/4 block text-gray-700 text-sm font-bold mb-2 " htmlFor={name}>
          {label}
        </label>
        <div className='md:w-3/4'>
          {options ? (
            <Select
              className="basic-single"
              classNamePrefix="select"
              isDisabled={false}
              isLoading={false}
              isClearable={true}
              isRtl={false}
              isSearchable={true}
              name={name}
              options={options}
              value={options.find(option => option.value === values[name])}
              onChange={option => setFieldValue(name, option.value)}
            />
          ) : (
            <Field
              className={`w-full shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${disabled ? 'disabled:bg-neutral-100 flex-grow' : ''}`}
              type={type}
              name={name}
              disabled={disabled ? true : null}
            />
          )}
          <ErrorMessage name={name} component="div" className="text-red-500 text-xs italic" />
        </div>
      </div>
    );
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <h1 className="font-semibold text-pink-500 text-lg">Edit Product</h1>
        </div>
        {/* Product Detail - START */}
        {product && (
          <>
            <Formik
              enableReinitialize
              validationSchema={validationSchema}
              initialValues={product}
              onSubmit={values => {
                dispatch(updateProduct(productId, values))
              }}
            >
              {formik => (
                <Form>
                  {/* You may want to add more fields here, depending on what properties your product object has */}
                  <h2 className='font-semibold text-pink-500 text-lg'>Product Detail</h2>
                  <div className='border rounded-md p-5'>
                    <CustomInput label="Product Category" name="product_category_id" options={categories} />
                    <CustomInput label="Product Name" name="product_name" type="text" />
                    <CustomInput label="Product Description" name="product_description" type="text" />
                    <CustomInput label="Product Price" name="product_price" type="text" />
                    <CustomInput label="Product Stock" name="quantity_in_stock" type="text" disabled={true} />
                    {/* Submit button */}
                    <div className="">
                      <button type="submit" className="bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
                        Save
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            {/* Product Detail - END */}

            {/* product image - START*/}
            <div>
              <h2 className='font-semibold text-pink-500 text-lg'>Product Image(s)</h2>
              <div className='flex w-full justify-between'>
                {images.map((image, index) => (
                  image ? (
                    <div key={index} className="card border shadow-md rounded">
                      <img src={'http://localhost:8000/' + image.image_url} alt={`Product ${index + 1}`} className="w-full h-48 object-cover rounded-t" />
                      <div className="p-4">
                        <h3 className="font-semibold">Image {index + 1}</h3>
                        <button className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                          onClick={() => dispatch(deleteImage(image.product_image_id, productId))}
                        >
                          Delete
                        </button>
                        <div>
                          <button
                            onClick={() => { document.getElementById(`fileInput-${index}`).click(); }}
                            className="mt-2 bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded">
                            Edit
                          </button>
                          <input
                            id={`fileInput-${index}`}
                            type="file"
                            className="hidden"
                            onChange={(event) => handleImageUpload(event, index)}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="card border shadow-md rounded">
                      <div className="p-4">
                        <h3 className="font-semibold">Upload New Image</h3>
                        <input
                          type="file"
                          className="mt-2 text-white font-bold py-2 px-4 rounded"
                          onChange={(event) => handleImageUpload(event, index)}
                        />
                      </div>
                    </div>
                  )
                ))}
              </div>
            </div>
            {/* product image - END*/}
          </>
        )}
      </div>
    </div >
  );
}

export default AdminEditProduct;
