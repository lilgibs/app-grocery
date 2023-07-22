import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash } from 'react-icons/fa';
import { Input, useDisclosure } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginAdmin } from '../features/adminSlice';
import AdminAddCategoryModal from '../components/AdminAddCategoryModal';
import AdminEditCategoryModal from '../components/AdminEditCategoryModal';
import { fetchCategories } from '../api/adminCategoryApi';
import AdminCategoryCard from '../components/AdminCategoryCard';
import AdminPagination from '../components/AdminPagination';
import Pagination from '../components/Pagination';
import CustomSpinner from '../components/Spinner';

function AdminCategories() {
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);
  const [totalCategories, setTotalCategories] = useState(null)
  const [searchCategory, setSearchCategory] = useState("");
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();

  const resetPage = () => setPage(1);
  const role = useSelector(state => state.admin.admin.role);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const getCategories = async (categoryName, page, limit) => {
    setLoading(true)
    const result = await fetchCategories(categoryName, page, limit);
    setCategories(result.formattedCategories);
    setTotalCategories(result.categoriesTotal[0].total)
    setLoading(false)
  };

  const handleSearchCategory = (e) => {
    e.preventDefault()
    setPage(1); // reset to page 1 when a new search is made
    getCategories(searchCategory, page, limit)
  }

  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  }

  useEffect(() => {
    if (role !== null) {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && role !== 99) {
      navigate('/');
    } else {
      getCategories(searchCategory, page, limit);
    }
  }, [role, navigate, page, limit]);

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      {loading && <CustomSpinner />}
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">
            Category Management
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <div className='flex gap-1'>
            <form onSubmit={handleSearchCategory}>
              <div className='flex'>
                <input
                  className='border-l border-b border-t rounded-s-md px-4 focus:border-pink-500 focus:outline-none'
                  type="text"
                  value={searchCategory}
                  onChange={(e) => setSearchCategory(e.target.value)}
                  placeholder="Search by category name..."
                />
                <button
                  className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 px-4 rounded-e-md"
                  type='submit'
                >
                  <FaSearch size={15} />
                </button>
              </div>
            </form>
          </div>
          <div
            onClick={onAddOpen}
            className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-2 px-4 rounded-md flex items-center gap-2 cursor-pointer"
          >
            <FaPlus size={15} className="" />
            <p className='hidden sm:block'>Add Category</p>
          </div>
          <AdminAddCategoryModal isOpen={isAddOpen} onClose={onAddClose} fetchCategories={getCategories} limit={limit} resetPage={resetPage} setLoading={setLoading}/>
        </div>
        <div className="flex flex-wrap justify-center gap-4">
          <AdminCategoryCard categories={categories} getCategories={getCategories} limit={limit} resetPage={resetPage} setLoading={setLoading}/>
        </div>
      </div>
      <div className='my-1'>
        <Pagination
          pageCount={Math.ceil(totalCategories / limit)}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          color='pink-500'
        />
      </div>
    </div >
  );
}

export default AdminCategories;
