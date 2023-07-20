import React from 'react'
import { useNavigate } from 'react-router-dom'

function ProductNotFound() {

  const navigate = useNavigate()
  return (
    <div className="flex flex-col mx-auto items-center w-full">
      <img className="w-28 sm:w-40" src={process.env.REACT_APP_API_UPLOAD_URL + `/product_not_found.png`} alt="" />
      <div className="text-center font-bold text-2xl sm:text-4xl">
        <p className="text-red-500">Sorry!</p>
        <p className="font-semibold">No product found</p>
        <button
          className='border-2 border-green-500 text-green-500 rounded-full text-sm sm:text-lg font-semibold px-4 py-1 hover:bg-green-500 hover:text-white'
          onClick={() => navigate('/products')}
          >
          See all products
        </button>
      </div>
    </div>
  )
}

export default ProductNotFound