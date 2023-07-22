import React from 'react'
import { useNavigate } from 'react-router-dom'

function AdminProductNotFound() {
  const navigate = useNavigate()
  return (
    <div className="flex flex-col mx-auto items-center w-full">
      <img className="w-28" src={process.env.REACT_APP_API_UPLOAD_URL + `/product_not_found.png`} alt="" />
      <div className="text-center font-bold text-2xl">
        <p className="text-red-500">Sorry!</p>
        <p className="font-semibold">No product found</p>
        {/* <button
          className='border-2 border-pink-500 text-pink-500 rounded-full text-sm font-semibold px-4 py-1 hover:bg-pink-500 hover:text-white'
          onClick={() => navigate('/admin/products')}
        >
          See all products
        </button> */}
      </div>
    </div>
  )
}

export default AdminProductNotFound