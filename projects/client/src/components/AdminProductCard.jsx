import React from 'react'
import { FaPen, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function AdminProductCard({ products, handleDeleteProduct }) {
  const navigate = useNavigate();

  if (!products || products.length === 0) {
    return <p>No products found.</p>;
  }
  
  return (
    <>
      {products.map((product) => (
        <div
          key={product.store_inventory_id}
          className="w-full p-2 border border-pink-500 rounded-md  shadow-md"
        >
          <div className="flex">
            <div className="w-[80%] md:w-3/4 flex flex-row items-center  border-gray-200 rounded overflow-hidden  gap-2 px-1">
              <img
                className="w-16 h-16 rounded-md"
                src={"http://localhost:8000/" + product.image_url}
                alt=""
              />
              <div className='w-1/2 md:w-1/3'>
                <p className="text-lg font-semibold text-pink-500 truncate">{product.product_name}</p>
                <p className="text-sm font-medium text-gray-400">{product.product_price}</p>
                <p className="text-base font-medium text-gray-400">{product.product_category_name}</p>
              </div>
              <div className='w-1/3 h-full hidden sm:block'>
                <p className="text-lg font-semibold ">Description:</p>
                <p className="text-sm font-medium text-gray-400 line-clamp-2">
                  {/* {product.product_description} */}
                  Lorem, ipsum dolor sit amet consectetur adipisicing elit. Natus facere est alias accusantium commodi explicabo sint ea accusamus, obcaecati nobis saepe similique distinctio minima id repellat nesciunt! Molestias, non explicabo?
                </p>
              </div>
              <div className='w-1/4 md:w-1/6 h-full'>
                <p className="text-lg font-semibold ">Stock:</p>
                <p className="text-md font-normal  text-gray-400">{product.quantity_in_stock}</p>
              </div>
            </div>
            <div className="w-[20%] md:w-1/4 flex flex-col justify-center gap-1 items-center border-l-2">
              <div
                className="px-2 py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => navigate(`/admin/products/${product.product_id}`)}
              >
                <FaPen size={15} />
                <p className='hidden md:block'>Edit</p>
              </div>
              <div
                className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleDeleteProduct(product.product_id)}
              >
                <FaTrash size={15} />
                <p className='hidden md:block'>Delete</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </>
  )
}

export default AdminProductCard