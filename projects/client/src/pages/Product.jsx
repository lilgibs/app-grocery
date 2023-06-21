import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router-dom'
import { fetchProduct, fetchProductUser } from '../features/productSlice';

function Product() {
  const { productId } = useParams();
  const dispatch = useDispatch()

  const product = useSelector(state => state.product.product)
  const { store_id, store_name } = useSelector(state => state.location.location.nearestStore)

  useEffect(() => {
    dispatch(fetchProductUser(productId, store_id))
  }, [dispatch, store_id])
  

  return (
    <div>
      <h1>{productId}</h1>
    </div>
  )
}

export default Product