import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from '@chakra-ui/react';
import axios from 'axios';

function AdminCategories() {
  const [categories, setCategories] = useState([]);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const initialRef = useRef();

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/products/categories/');
      console.log(response.data.data);
      setCategories(response.data.data);
      console.log(categories)
    } catch (error) {
      console.error(error);
    }
  };

  const ModalAddCategory = () => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState(null);

    const handleSubmit = async () => {
      const formData = new FormData();
      formData.append('product_category_name', categoryName);
      formData.append('image', categoryImage);
      try {
        const response = await axios.post('http://localhost:8000/api/admin/products/categories/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        console.log(response.data);
        onClose();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Modal initialFocusRef={initialRef} isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input ref={initialRef} placeholder="Enter Category Name" value={categoryName} onChange={(e) => setCategoryName(e.target.value)} />
            </FormControl>
            <FormControl>
              <FormLabel>Category Image</FormLabel>
              <Input type="file" ref={initialRef} onChange={(e) => setCategoryImage(e.target.files[0])} />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const handleDeleteCategory = async (id) => {
    try {
      await axios.delete(`http://localhost:8000/api/admin/products/categories/${id}`);
      setCategories(categories.filter((category) => category.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const renderCategories = () => {
    return categories.map((category) => (
      <div key={category.id} className='w-full md:w-[48%] lg:w-[49%] p-2 border rounded-md shadow-md'>
        <div className='flex'>
          <div className='flex flex-row items-center border-gray-200 rounded overflow-hidden  w-1/2'>
            <img
              className='w-16 h-16'
              src="https://png.pngtree.com/element_our/png/20180930/food-icon-design-vector-png_120564.jpg"
              alt=""
            />
            <div>
              <p className='text-lg font-semibold'>Kategori:</p>
              <p className='text-md font-medium '>{category.product_category_name}</p>
            </div>
          </div>
          <div className='flex flex-col justify-center gap-1 items-center w-1/2 border-l-2'>
            <div className='px-2 py-1 rounded bg-teal-500 font-semibold text-white w-1/2 flex items-center justify-center gap-1'>
              <FaPen size={15} />
              <button>
                Edit
              </button>
            </div>
            <div className='px-2 py-1 rounded bg-rose-500 font-semibold text-white w-1/2 flex items-center justify-center gap-1'>
              <FaTrash size={15} />
              <button onClick={() => handleDeleteCategory(category.product_category_id)}>  {/* Attach click handler */}
                Delete
              </button>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className='w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5'>
      <div className='p-4 bg-white shadow-md rounded'>
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">Categories Management</p>
        </div>
        <div className='flex justify-end'>
          <button onClick={onOpen} className='bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center'>
            <FaPlus size={15} className="mr-2" /> Add Category
          </button>
          <ModalAddCategory />
        </div>
        <div className='flex flex-wrap justify-center gap-4'>
          {/* Component Start */}
          <div className='w-full md:w-[48%] lg:w-[49%] p-2 border rounded-md shadow-md'>
            <div className='flex'>
              <div className='flex flex-row items-center border-gray-200 rounded overflow-hidden  w-1/2'>
                <img
                  className='w-16 h-16'
                  src="https://png.pngtree.com/element_our/png/20180930/food-icon-design-vector-png_120564.jpg"
                  alt=""
                />
                <div>
                  <p className='text-lg font-semibold'>Kategori:</p>
                  <p className='text-md font-medium '>Makanan</p>
                </div>
              </div>
              <div className='flex flex-col justify-center gap-1 items-center w-1/2 border-l-2'>
                <div className='px-2 py-1 rounded bg-teal-500 font-semibold text-white w-1/2 flex items-center justify-center gap-1'>
                  <FaPen size={15} />
                  <button>
                    Edit
                  </button>
                </div>
                <div className='px-2 py-1 rounded bg-rose-500 font-semibold text-white w-1/2 flex items-center justify-center gap-1'>
                  <FaTrash size={15} />
                  <button>
                    Delete
                  </button>

                </div>
              </div>
            </div>
          </div>
          {/* Component End */}
          {/* Component Start */}
          <div className='w-full md:w-[48%] lg:w-[49%] p-2 border rounded-md shadow-md'>
            <div className='flex'>
              <div className='flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2'>
                <img
                  className='w-16 h-16'
                  src="https://png.pngtree.com/element_our/png/20180930/food-icon-design-vector-png_120564.jpg"
                  alt=""
                />
                <div>
                  <p className='text-lg font-semibold'>Kategori:</p>
                  <p className='text-md font-medium '>Makanan</p>
                </div>
              </div>
              <div className='flex flex-col justify-center gap-1 items-center  w-1/2 border-l-2'>
                <button className='px-2 py-1 rounded bg-teal-500 font-semibold text-white w-1/2'>Edit</button>
                <button className='px-2 py-1 rounded bg-rose-500 font-semibold text-white w-1/2'>Delete</button>
              </div>
            </div>
          </div>
          {/* Component End */}
          {renderCategories()}
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
