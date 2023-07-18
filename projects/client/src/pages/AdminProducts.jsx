import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash, FaFilter } from 'react-icons/fa';
import { Input, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Button, Box, FormLabel } from '@chakra-ui/react';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginAdmin } from '../features/adminSlice';
import { fetchCategories } from '../api/adminCategoryApi';
import Select from 'react-select';
import AdminProductCard from '../components/AdminProductCard';
import AdminProductFilterDrawer from '../components/AdminProductFilterDrawer';
import { fetchProductsInventory } from '../api/adminProductApi';
import Pagination from '../components/Pagination';

function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(8)
  const [totalProducts, setTotalProducts] = useState(null)
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedSortOption, setSelectedSortOption] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [sortType, setSortType] = useState(null); // 'price' or 'stock'
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [isClearable, setIsClearable] = useState(true);
  const [isFilterVisible, setFilterVisible] = useState(false);

  const adminToken = localStorage.getItem("admin_token");
  const role = useSelector(state => state.admin.admin.role);
  const dispatch = useDispatch()
  const navigate = useNavigate()

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategoryOptions(result.formattedCategories);
    };
    getCategories();
  }, []);

  const getProductsData = async () => {
    const response = await fetchProductsInventory(adminToken, page, limit, searchText, selectedCategory, sortType, sortOrder);
    if (response) {
      setProducts(response.products);
      setTotalProducts(response.total);
    }
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1); // Reset the page to 1 when performing a new search
    getProductsData();
  };


  const handlePageChange = ({ selected }) => {
    setPage(selected + 1);
  }

  const FilterComponent = (
    <Select
      id="product_category_id"
      name="product_category_id"
      placeholder="Category"
      isClearable={isClearable}
      options={categoryOptions}
      onChange={(selectedOption) => {
        setSelectedCategory(selectedOption);
      }}
    />
  );

  const sortOptions = [
    { value: 'price_asc', label: 'Lowest price' },
    { value: 'price_desc', label: 'Highest price' },
    { value: 'stock_asc', label: 'Lowest Stock' },
    { value: 'stock_desc', label: 'Highest stock' },
    { value: 'name_asc', label: 'Name A-Z' },
    { value: 'name_desc', label: 'Name Z-A' },
  ];

  const handleSortChange = (selectedOption) => {
    setSelectedSortOption(selectedOption);
    if (selectedOption) {
      const [sortType, sortOrder] = selectedOption.value.split('_');
      setSortType(sortType);
      setSortOrder(sortOrder);
      setPage(1)
    } else {
      setSortType(null);
      setSortOrder(null);
      setPage(1)
    }
    // Then fetch the products
    getProductsData();
  };

  useEffect(() => {
    adminToken ? dispatch(checkLoginAdmin(adminToken)) : setLoading(false);
  }, [dispatch]);

  useEffect(() => {
    if (role !== null) {
      setLoading(false);
    }
  }, [role]);

  useEffect(() => {
    if (!loading && (role !== 99 && role !== 1)) {
      navigate('/');
    } else {
      // fetchProducts();
      getProductsData()
    }
  }, [role, navigate, loading]);

  useEffect(() => {
    getProductsData();
  }, [page, selectedCategory, sortType, sortOrder, categoryOptions])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">Product Management</p>
        </div>
        <div className='w-full flex justify-end'>
          <button
            onClick={() => navigate('/admin/products/add-product')}
            className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 md:py-2 px-4 rounded-md mb-2 flex items-center justify-center gap-2"
          >
            <FaPlus size={15} />
            <p className='hidden md:block'>Add Product</p>
          </button>
        </div>
        <div className="flex mb-2 justify-between w-full ">
          <form onSubmit={handleSearch}>
            <div className='flex'>
              <input
                className='border-l border-b border-t rounded-s-md px-4 focus:border-pink-500 focus:outline-none'
                type="text"
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                placeholder="Search by product name..."
              />
              <button
                className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 px-4 rounded-e-md"
                type='submit'
              >
                <FaSearch size={15} />
              </button>
            </div>
          </form>
          <div className='hidden flex-row justify-end gap-2 w-1/2 md:flex'>
            <div className='w-1/2'>
              {FilterComponent}
            </div>
            <Select
              className='w-1/2'
              id="product_sort_id"
              name="product_sort_id"
              isClearable={isClearable}
              placeholder="Sort by"
              options={sortOptions}
              onChange={handleSortChange}
            />
          </div>
          <div onClick={() => setFilterVisible(true)} className='md:hidden bg-pink-500 hover:bg-pink-600 px-4 py-2 rounded-md text-white flex items-center gap-1 cursor-pointer'>
            <FaFilter size={15} />
            <p className='font-semibold'>Filter</p>
          </div>
        </div>
        <AdminProductFilterDrawer
          isOpen={isFilterVisible}
          onClose={() => setFilterVisible(false)}
          FilterComponent={FilterComponent}
          sortOptions={sortOptions}
          handleSortChange={handleSortChange}
          selectedSortOption={selectedSortOption}
        />
        <div className="flex flex-wrap justify-center gap-4">
          <AdminProductCard products={products} getProductsData={getProductsData} page={page} setPage={setPage} />
        </div>
      </div>
      <div className='my-1'>
        <Pagination
          pageCount={Math.ceil(totalProducts / limit)}
          onPageChange={handlePageChange}
          forcePage={page - 1}
          color='pink-500'
        />
      </div>
    </div>
  );
}

export default AdminProducts;
