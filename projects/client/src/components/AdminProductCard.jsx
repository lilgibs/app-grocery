import React, { useState } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../utils/formatRupiah'
import axios from 'axios';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import AdminProductNotFound from "../components/AdminProductNotFound";
import { useCustomToast } from '../hooks/useCustomToast';

function AdminProductCard({ products, getProductsData, page, setPage, setIsLoading }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);

  const navigate = useNavigate();
  const { showSuccessToast, showErrorToast } = useCustomToast();

  const adminToken = localStorage.getItem("admin_token");

  const handleDeleteProduct = (id) => {
    setToBeDeleted(id);
    setModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    // Close the modal first
    setModalOpen(false);
    try {
      setIsLoading(true)
      const response = await axios.delete(`${process.env.REACT_APP_API_BASE_URL}/admin/products/${toBeDeleted}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      setIsLoading(false)
      showSuccessToast("Product successfully deleted.");
      getProductsData();
    } catch (error) {
      setIsLoading(false)
      showErrorToast("Unable to delete product.");
      console.error(error);
    }

    setToBeDeleted(null); // Reset the toBeDeleted state
    setPage(1);
  };

  if (!products || products.length === 0) {
    return <AdminProductNotFound />
  }

  return (
    <>
      {products.map((product) => (
        <div
          key={product.store_inventory_id}
          className="w-full p-2 border border-pink-500 rounded-md  shadow-md"
        >
          <div className="flex">
            <div className="w-[80%] md:w-3/4 flex flex-row border-gray-200 rounded overflow-hidden gap-2 px-1">
              <img
                className="w-16 h-16 rounded-md my-auto"
                src={process.env.REACT_APP_API_IMG_URL + product.image_url}
                alt=""
              />
              <div className='w-1/2 md:w-1/3'>
                <p className="md:text-lg font-semibold text-pink-500 truncate">{product.product_name}</p>
                <p className="text-sm font-semibold text-gray-400">{formatRupiah(product.product_price)}</p>
                <p className="text-sm font-medium text-gray-400">{product.product_category_name}</p>
              </div>
              <div className='w-1/3 h-full hidden md:block'>
                <p className="md:text-lg font-semibold ">Description:</p>
                <p className="text-sm font-medium text-gray-400 line-clamp-2">
                  {product.product_description}
                </p>
              </div>
              <div className='w-1/4 md:w-1/6 h-full'>
                <p className="md:text-lg font-semibold ">Stock:</p>
                <p className="md:text-sm font-semibold  text-gray-400">{product.quantity_in_stock}</p>
              </div>
            </div>
            <div className="w-[20%] md:w-1/4 flex flex-col justify-center gap-1 items-center border-l-2">
              <div
                className="px-2 py-2 md:py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => navigate(`/admin/products/${product.product_id}`)}
              >
                <FaPen size={15} />
                <p className='hidden md:block'>Edit</p>
              </div>
              <div
                className="px-2 py-2 md:py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleDeleteProduct(product.product_id)}
              >
                <FaTrash size={15} />
                <p className='hidden md:block'>Delete</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <DeleteConfirmationModal isOpen={isModalOpen} onClose={() => setModalOpen(false)} onConfirm={confirmDeleteProduct}
      />
    </>
  )
}

export default AdminProductCard