import React, { useState } from 'react'
import { FaPen, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { formatRupiah } from '../utils/formatRupiah'
import axios from 'axios';
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, Button } from "@chakra-ui/react"

function AdminProductCard({ products, getProductsData, page, setPage }) {
  const [isModalOpen, setModalOpen] = useState(false);
  const [toBeDeleted, setToBeDeleted] = useState(null);

  const navigate = useNavigate();

  const adminToken = localStorage.getItem("admin_token");

  const handleDeleteProduct = (id) => {
    setToBeDeleted(id);
    setModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    // Close the modal first
    setModalOpen(false);

    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/products/${toBeDeleted}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );

      console.log(response.data);
      alert(response.data.message);
      getProductsData();
    } catch (error) {
      console.error(error);
    }

    setToBeDeleted(null); // Reset the toBeDeleted state
    setPage(1);
  };

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
            <div className="w-[80%] md:w-3/4 flex flex-row border-gray-200 rounded overflow-hidden gap-2 px-1">
              <img
                className="w-16 h-16 rounded-md my-auto"
                src={"http://localhost:8000/" + product.image_url}
                alt=""
              />
              <div className='w-1/2 md:w-1/3'>
                <p className="md:text-lg font-semibold text-pink-500 truncate">{product.product_name}</p>
                <p className="text-sm font-semibold text-gray-400">{formatRupiah(product.product_price)}</p>
                <p className="text-sm font-medium text-gray-400">{product.product_category_name}</p>
              </div>
              <div className='w-1/3 h-full hidden sm:block'>
                <p className="text-lg font-semibold ">Description:</p>
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
                className="px-2 py-2 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => navigate(`/admin/products/${product.product_id}`)}
              >
                <FaPen size={15} />
                <p className='hidden md:block'>Edit</p>
              </div>
              <div
                className="px-2 py-2 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
                onClick={() => handleDeleteProduct(product.product_id)}
              >
                <FaTrash size={15} />
                <p className='hidden md:block'>Delete</p>
              </div>
            </div>
          </div>
        </div>
      ))}
      <Modal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Deletion</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to delete this product?
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDeleteProduct}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}

export default AdminProductCard