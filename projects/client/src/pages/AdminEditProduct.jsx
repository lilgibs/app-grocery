import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProduct, updateProduct, uploadImage } from '../features/productSlice';
import { checkLoginAdmin } from '../features/adminSlice';
import { ErrorMessage, Field, Form, Formik, useFormikContext } from 'formik';
import * as Yup from 'yup';
import { fetchCategories } from '../api/adminCategoryApi';
import Select from 'react-select';
import { useDisclosure } from '@chakra-ui/react'
import AdminIncreaseStockModal from '../components/AdminIncreaseStockModal';
import AdminDecreaseStockModal from '../components/AdminDecreaseStockModal';
import { FaSave } from 'react-icons/fa';
import AdminImageCard from '../components/AdminImageCard';

function AdminEditProduct() {
  const { productId } = useParams();
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState(null);

  const { isOpen: isIncreaseOpen, onOpen: onIncreaseOpen, onClose: onIncreaseClose } = useDisclosure();
  const { isOpen: isDecreaseOpen, onOpen: onDecreaseOpen, onClose: onDecreaseClose } = useDisclosure();

  const dispatch = useDispatch();
  const navigate = useNavigate()
  const role = useSelector(state => state.admin.admin.role);
  const product = useSelector(state => state.product.product);
  const productIsLoading = useSelector(state => state.product);

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
      setCategories(result.formattedCategories);
    };

    getCategories();
  }, []);

  const CustomInput = ({ label, name, type = 'text', disabled = false, options = null, children }) => {
    const { setFieldValue, values } = useFormikContext();
    return (
      <div className="mb-4 md:flex md:flex-row">
        <label className="md:w-1/4 block text-gray-700 text-sm font-bold mb-2 " htmlFor={name}>
          {label}
        </label>
        <div className='md:w-3/4'>
          {options ? (
            <Select
              className="basic-single shadow"
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
            <div className='flex gap-2'>
              <Field
                className={`${children ? 'w-[50%]' : 'w-full'} shadow appearance-none border rounded py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${disabled ? 'disabled:bg-neutral-100 flex-grow' : ''}`}
                type={type}
                name={name}
                disabled={disabled ? true : null}
              />
              {children}
            </div>
          )}
          <ErrorMessage name={name} component="div" className="text-red-500 text-xs italic" />
        </div>
      </div>
    );
  };

  if (!product.product_id && !product.productIsLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <h1 className="font-semibold text-pink-500 text-lg">Edit Product</h1>
        </div>

        {product && (
          <div className='flex flex-col gap-5'>
            {/* Product Detail - START */}
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
                    <div className='border-b'>
                      <CustomInput label="Product Category" name="product_category_id" options={categories} />
                      <CustomInput label="Product Name" name="product_name" type="text" />
                      <CustomInput label="Product Description" name="product_description" type="text" />
                      <CustomInput label="Product Price" name="product_price" type="text" />
                      <CustomInput label="Product Weight (gram)" name="product_weight" type="text" />
                      <CustomInput label="Product Stock" name="quantity_in_stock" type="text" disabled={true}>
                        <div className='flex gap-2'>
                          <div onClick={onDecreaseOpen} className='px-4 py-2 bg-rose-500 hover:bg-rose-600 text-white font-semibold rounded cursor-pointer flex gap-2'>-<span className='hidden sm:block'>Decrease</span></div>
                          <AdminDecreaseStockModal isOpen={isDecreaseOpen} onClose={onDecreaseClose} productId={product.product_id} currStock={product.quantity_in_stock} storeInventoryId={product.store_inventory_id} />
                          <div onClick={onIncreaseOpen} className='px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded cursor-pointer flex gap-2'>+ <span className='hidden sm:block'>Increase</span></div>
                          <AdminIncreaseStockModal isOpen={isIncreaseOpen} onClose={onIncreaseClose} productId={product.product_id} currStock={product.quantity_in_stock} />
                        </div>
                      </CustomInput>
                    </div>

                    {/* Submit button */}
                    <div className="flex justify-start mt-3">
                      <div className="flex justify-center items-center gap-2 w-full md:w-auto bg-pink-500 hover:bg-pink-600 text-white font-bold py-2 px-4 rounded">
                        <FaSave />
                        <button type="submit">
                          Save
                        </button>
                      </div>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
            {/* Product Detail - END */}

            {/* product image - START*/}
            <div>
              <h2 className='font-semibold text-pink-500 text-lg'>Product Image(s)</h2>
              <AdminImageCard images={images} productId={productId} />
            </div>
            {/* product image - END*/}
          </div>
        )}
      </div>
    </div >
  );
}

export default AdminEditProduct;
