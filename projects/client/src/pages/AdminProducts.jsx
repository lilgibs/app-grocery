import React, { useEffect, useRef, useState } from 'react';
import { FaPen, FaPlus, FaSearch, FaTrash, FaFilter } from 'react-icons/fa';
import { Input, useDisclosure, Drawer, DrawerOverlay, DrawerContent, DrawerHeader, DrawerBody, Button, Box, FormLabel } from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from 'react-redux';
import { checkLoginAdmin } from '../features/adminSlice';
import { fetchCategories } from '../api/adminApi';
import Select from 'react-select';
import AdminProductCard from '../components/AdminProductCard';

function AdminProducts() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(2)
  const [totalProducts, setTotalProducts] = useState(null)
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
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
    const loadData = async () => {
      const categories = await fetchCategories();
      setCategoryOptions(categories);
    };
    loadData();
  }, []);

  const fetchProducts = async () => {
    try {
      let url = `http://localhost:8000/api/admin/products/inventory?page=${page}&limit=${limit}&search=${searchText}&category=${selectedCategory ? selectedCategory.value : ''}`;
      if (sortType && sortOrder) {
        url += `&sortType=${sortType}&sortOrder=${sortOrder}`;
      }
      const response = await axios.get(url,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      console.log(response)
      setProducts(response.data.products);
      setTotalProducts(response.data.total);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSearch = () => {
    setPage(1); // Reset the page to 1 when performing a new search
    fetchProducts();
  };

  const handleDeleteProduct = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:8000/api/admin/products/${id}`,
        {
          headers: {
            'Authorization': `Bearer ${adminToken}`
          }
        }
      );
      console.log(response.data);
      alert(response.data.message);
      fetchProducts();
    } catch (error) {
      console.error(error);
    }
  };

  const handleNextPage = () => {
    if (page < Math.ceil(totalProducts / limit)) {
      setPage(page => page + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage(page => page - 1);
    }
  };

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
  ];

  const handleSortChange = (selectedOption) => {
    if (selectedOption) {
      const [sortType, sortOrder] = selectedOption.value.split('_');
      setSortType(sortType);
      setSortOrder(sortOrder);
      console.log('Sort type', sortType)
    } else {
      setSortType(null);
      setSortOrder(null);
    }
    // Then fetch the products
    fetchProducts();
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
      fetchProducts();
    }
  }, [role, navigate, loading]);

  useEffect(() => {
    fetchProducts();
  }, [page, selectedCategory, sortType, sortOrder, categoryOptions])

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-[95%] flex-col sm:max-w-2xl md:max-w-4xl mx-auto mt-5">
      <div className="p-4 bg-white border shadow-md rounded">
        <div className="w-full bg-slate-100 text-center py-6 rounded-md mb-10">
          <p className="font-semibold text-pink-500 text-lg">Products Management</p>
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
          <div className='flex gap-1'>
            <Input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Search by product name..."
            />
            <button
              className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 px-4 rounded-md"
              onClick={handleSearch}
            >
              <FaSearch size={15} />
            </button>
          </div>
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
        <Drawer isOpen={isFilterVisible} placement="rigth" onClose={() => setFilterVisible(false)}>
          <DrawerOverlay>
            <DrawerContent>
              <DrawerHeader borderBottomWidth="1px">Filter Products</DrawerHeader>
              <DrawerBody>
                {FilterComponent}
                <Select
                  className=''
                  id="product_sort_id"
                  name="product_sort_id"
                  placeholder="Sort by"
                  options={sortOptions}
                  onChange={handleSortChange}
                />
              </DrawerBody>
            </DrawerContent>
          </DrawerOverlay>
        </Drawer>
        <div className="flex flex-wrap justify-center gap-4">
          <AdminProductCard products={products} handleDeleteProduct={handleDeleteProduct} />
        </div>
      </div>
      <div className='flex gap-2 justify-center'>
        <button onClick={handlePrevPage}>Previous</button>
        <p>{page} of {Math.ceil(totalProducts / limit)}</p>
        <button onClick={handleNextPage}>Next</button>
      </div>
    </div>
  );
}

export default AdminProducts;
