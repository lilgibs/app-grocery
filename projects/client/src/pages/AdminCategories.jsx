import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaTrash } from 'react-icons/fa';
import { useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginAdmin } from '../features/adminSlice';
import AdminAddCategoryModal from '../components/AdminAddCategoryModal';
import AdminEditCategoryModal from '../components/AdminEditCategoryModal';

function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure();

  const role = useSelector(state => state.admin.admin.role);
  const dispatch = useDispatch()
  const navigate = useNavigate()

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

  useEffect(() => {
    const token = localStorage.getItem('admin_token');

    if (token) { // check if the admin is logged in
      dispatch(checkLoginAdmin(token));
    }
    else { // set loading to false if no token is found     
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    if (role !== null) {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && role !== 99) {
      navigate('/');
    } else {
      fetchCategories();
    }
  }, [role, navigate, loading]);


  if (loading) {
    return <div>Loading...</div>;
  }

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
          <AdminAddCategoryModal isOpen={isAddOpen} onClose={onAddClose} fetchCategories={fetchCategories} />
          <AdminEditCategoryModal isOpen={isEditOpen} onClose={onEditClose} fetchCategories={fetchCategories} selectedCategory={selectedCategory} />
        </div>
      </div>
    </div>
  );
}

export default AdminCategories;
