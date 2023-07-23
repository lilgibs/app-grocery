import React, { useEffect, useState } from "react";
import { fetchCategories } from "../api/adminCategoryApi";
import Select from "react-select";
import { fetchProducts } from "../api/userApi";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaFilter } from "react-icons/fa";
import ProductFilterDrawer from "../components/ProductFilterDrawer";
import ProductCard from "../components/ProductCard";
import ProductNotFound from "../components/ProductNotFound";
import Pagination from "../components/Pagination";
import { sortOptions } from '../utils/sortOptions';
import Footer from "../components/Footer";

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState(null); // 'price' or 'stock'
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [isClearable, setIsClearable] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [totalProducts, setTotalProducts] = useState(null);
  const [isFilterVisible, setFilterVisible] = useState(false);

  const { store_id, store_name } = useSelector((state) => state.location.location.nearestStore);
  const totalPages = Math.ceil(totalProducts / limit);

  const handleSortChange = (selectedOption) => {
    console.log(selectedOption);
    if (selectedOption) {
      const [sortType, sortOrder] = selectedOption.split("_");
      setSortType(sortType);
      setSortOrder(sortOrder);
      searchParams.set("sort_type", sortType);
      searchParams.set("sort_order", sortOrder);
      searchParams.set("page", 1);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    } else {
      setSortType(null);
      setSortOrder(null);
      searchParams.delete("sort_type");
      searchParams.delete("sort_order");
      searchParams.set("page", 1);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    }
  };

  const handleSetCategory = (category) => {
    setSelectedCategory(category);
    searchParams.set("category", category);
    searchParams.set("page", 1);
    setSearchParams(new URLSearchParams(searchParams.toString()));
  };

  const handlePageClick = (data) => {
    let selected = data.selected + 1; // react-paginate mulai dari 0
    searchParams.set("page", selected);
    setSearchParams(new URLSearchParams(searchParams.toString()));
    window.scrollTo(0, 0);
  };

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategories(result.formattedCategories);
    };

    const getProducts = async () => {
      const searchParam = searchParams.get("search");
      const categoryParam = searchParams.get("category");
      // setSelectedCategory(categoryParam)
      const sortTypeParam = searchParams.get("sort_type");
      const sortOrderParam = searchParams.get("sort_order");
      const pageParam = Number(searchParams.get("page"));
      setPage(pageParam || 1);
      const result = await fetchProducts(store_id, searchParam, categoryParam, pageParam, limit, sortTypeParam, sortOrderParam);
      setProducts(result.products);
      setTotalProducts(result.total);
    };
    getProducts();
    getCategories();
  }, [store_id, searchParams]);

  return (
    <div className="flex flex-col gap-5">
      <div className="w-full">
        <img className="hidden sm:block" src={process.env.REACT_APP_API_UPLOAD_URL + `/products_banner.jpg`} alt="" />
        <img className="sm:hidden" src={process.env.REACT_APP_API_UPLOAD_URL + `/products_banner2.jpg`} alt="" />
      </div>
      <div className="md:w-[95%] xl:max-w-screen-xl mx-auto w-full">
        <div className="flex gap-5 min-h-screen">
          {/* Sidebar - START */}
          <div className="hidden lg:flex flex-col w-[20%] gap-5">
            <div className="text-xl ">
              <p className="font-semibold">
                Store: <span className="text-green-500">{store_name}</span>
              </p>
            </div>
            <div className="flex flex-col gap-5">
              {/* Category - START */}
              <div className="flex flex-col gap-2 ">
                <p className="font-semibold text-lg border-b-2 border-neutral-200 pb-2 text-neutral-600">Category</p>
                <div className="flex flex-col gap-2 overflow-y-auto h-[300px] pr-2">
                  {categories.map((category) => (
                    <div
                      className={`flex border px-4 py-2 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100
                        ${selectedCategory === category.label.toLowerCase() ? "font-semibold border-green-500 text-green-500" : ""}`}
                      onClick={() => handleSetCategory(category.label.toLowerCase())}
                    >
                      <img className="h-5" src={`${process.env.REACT_APP_API_IMG_URL + category.image}`} alt="" />
                      <p className="">{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>
              {/* Category - END */}
            </div>
          </div>
          {/* Sidebar - END */}
          {/* Content - START */}
          <div className="flex flex-col gap-5 w-[90%] lg:w-[80%] mx-auto">
            {/* Content Header - START */}
            <div className="flex lg:justify-end">
              {/* Filter - START */}
              <div className="lg:hidden">
                <div onClick={() => setFilterVisible(true)} className=" hover:bg-green-500 text-green-500 hover:text-white border-2 border-green-500 px-4 py-1 rounded-full flex items-center gap-1 cursor-pointer duration-150">
                  <FaFilter size={15} />
                  <p className="font-semibold">Filter</p>
                </div>
                <ProductFilterDrawer
                  isOpen={isFilterVisible}
                  onClose={() => setFilterVisible(false)}
                  handleSortChange={handleSortChange}
                  sortType={sortType}
                  sortOrder={sortOrder}
                  categories={categories}
                  selectedCategory={selectedCategory}
                  handleSetCategory={handleSetCategory}
                />
              </div>
              {/* Filter - END */}
              <div className="hidden lg:flex w-[30%] gap-2 items-center">
                <p className="font-semibold">Urutkan: </p>
                <Select
                  className="w-full"
                  id="product_sort_id"
                  name="product_sort_id"
                  placeholder="Sort by"
                  options={sortOptions}
                  isClearable={isClearable}
                  onChange={(selectedOption) => handleSortChange(selectedOption ? selectedOption.value : "")}
                />
              </div>
            </div>
            {/* Content Header - END */}

            {/* Content Body - START */}
            {products.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-auto">
                {products.map((product) => (
                  <ProductCard product={product} key={product.product_id} />
                ))}
              </div>
            ) : (
              <ProductNotFound />
            )}
            {/* Content Body - END */}
            <div>
              <div>
                {totalProducts > limit && (
                  <Pagination
                    pageCount={totalPages}
                    onPageChange={handlePageClick}
                    forcePage={page - 1}
                  />
                )}
              </div>
            </div>
          </div>
          {/* Content - END */}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Products;
