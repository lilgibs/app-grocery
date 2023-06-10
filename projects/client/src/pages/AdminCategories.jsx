import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { Button, useDisclosure, Modal, ModalOverlay, ModalContent, ModalHeader, ModalCloseButton, ModalBody, FormControl, FormLabel, Input, ModalFooter } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"

function AdminCategories() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const initialRef = useRef();
  const navigate = useNavigate()

  const role = 'super admin'

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:8000/api/admin/products/categories/');
      setCategories(response.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteCategory = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/products/categories/${id}`
      );
      console.log(response.data);
      alert(response.data.message);
      fetchCategories();
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditCategory = (category) => {
    setSelectedCategory(category);
    onEditOpen();
  };

  useEffect(() => {
    // If the role is not 'super admin', redirect the user to a different page
    if (role !== 'super admin') {
      navigate('/');
    } else {
      fetchCategories();
    }
  }, [role, navigate]);

  const renderCategories = () => {
    return categories.map((category) => (
      <div
        key={category.id}
        className="w-full md:w-[48%] lg:w-[49%] p-2 border border-pink-500 rounded-md  shadow-md"
      >
        <div className="flex">
          <div className="flex flex-row items-center border-gray-200 rounded overflow-hidden w-1/2 gap-2 px-1">
            <img
              className="w-16 h-16 rounded-md"
              src={"http://localhost:8000/" + category.product_category_image}
              alt=""
            />
            <div>
              <p className="text-lg font-semibold text-pink-500 ">Kategori:</p>
              <p className="text-md font-medium">
                {category.product_category_name}
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-center gap-1 items-center w-1/2 border-l-2">
            <div
              className="px-2 py-1 rounded bg-teal-500 hover:bg-teal-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => handleEditCategory(category)}
            >
              <FaPen size={15} />
              <p>Edit</p>
            </div>
            <div
              className="px-2 py-1 rounded bg-rose-500 hover:bg-rose-600 font-semibold text-white w-1/2 flex items-center justify-center gap-1 cursor-pointer"
              onClick={() => handleDeleteCategory(category.product_category_id)}
            >
              <FaTrash size={15} />
              <p>Delete</p>
            </div>
          </div>
        </div>
      </div>
    ));
  };

  const ModalAddCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null);

    const handleSubmit = async () => {
      const formData = new FormData();
      formData.append('product_category_name', categoryName);
      formData.append('image', categoryImage);

      try {
        const response = await axios.post(
          'http://localhost:8000/api/admin/products/categories/',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert(response.data.message);
        onAddClose();
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    };

    return (
      <Modal initialFocusRef={initialRef} isOpen={isAddOpen} onClose={onAddClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category Image</FormLabel>
              <Input
                type="file"
                onChange={(e) => setCategoryImage(e.target.files[0])}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" onClick={onAddClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  const ModalEditCategory = () => {
    const [categoryName, setCategoryName] = useState('');
    const [categoryImage, setCategoryImage] = useState(null)

    const handleSubmit = async () => {
      const formData = new FormData()
      formData.append('product_category_name', categoryName)
      formData.append('product_category_image', categoryImage)

      try {

        const response = await axios.put(
          `http://localhost:8000/api/admin/products/categories/${selectedCategory.product_category_id}`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }
        );
        alert(response.data.message);
        onEditClose();
        fetchCategories();
      } catch (error) {
        console.error(error);
      }
    };

    useEffect(() => {
      if (selectedCategory) {
        setCategoryName(selectedCategory.product_category_name);
      }
    }, [selectedCategory]);

    return (
      <Modal initialFocusRef={initialRef} isOpen={isEditOpen} onClose={onEditClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Edit Category</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <FormControl>
              <FormLabel>Category Name</FormLabel>
              <Input
                ref={initialRef}
                placeholder="Enter Category Name"
                value={categoryName}
                onChange={(e) => setCategoryName(e.target.value)}
              />
            </FormControl>
            <FormControl>
              <FormLabel>Category Image</FormLabel>
              <Input
                type='file'
                onChange={(e) => setCategoryImage(e.target.files[0])}
              />
            </FormControl>
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="green" mr={3} onClick={handleSubmit}>
              Save
            </Button>
            <Button colorScheme="red" onClick={onEditClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">
            Categories Management
          </p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={onAddOpen}
            className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md mb-2 flex items-center"
          >
            <FaPlus size={15} className="mr-2" /> Add Category
          </button>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          {renderCategories()}
          <ModalAddCategory />
          <ModalEditCategory />
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
