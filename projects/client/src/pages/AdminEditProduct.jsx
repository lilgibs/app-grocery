import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchProduct } from '../features/productSlice';

function AdminEditProduct() {
  const [product, setProduct] = useState(null)
  const { product_id } = useParams();

  const dispatch = useDispatch();
  const productId = useSelector(state => state.product.product.product_id);
  const productCategoryId = useSelector(state => state.product.product.product_category_id);
  const productName = useSelector(state => state.product.product.product_name);
  const productDescription = useSelector(state => state.product.product.product_description);
  const productPrice = useSelector(state => state.product.product.product_price);
  const productImages = useSelector(state => state.product.product.product_images);


  useEffect(() => {
    dispatch(fetchProduct(product_id));
  }, [dispatch, product_id]);

  return (
    <div>
      <p>Product ID: {productId}</p>
      <p>Product Category ID: {productCategoryId}</p>
      <p>Product Name: {productName}</p>
      <p>Product Description: {productDescription}</p>
      <p>Product Price: {productPrice}</p>
      <p>Product Images:</p>
      {productImages && productImages.map((image, index) => (
        <li key={index}>
          Image ID: {image.product_image_id}, Image URL: {image.image_url}
        </li>
      ))}

    </div>
  )
}

export default AdminEditProduct