import { Box, Button, Card, CardBody, CardFooter, CardHeader, Divider, Heading, Image, Input, Radio, RadioGroup, Stack, Text, useDisclosure } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { fetchCategories } from '../api/adminApi';
import Select from 'react-select';
import { fetchProducts } from '../api/userApi';
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetProduct } from '../features/productSlice';
import { useDispatch, useSelector } from 'react-redux';
import { formatRupiah } from '../utils/formatRupiah';
import ReactPaginate from 'react-paginate';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { Drawer, DrawerBody, DrawerFooter, DrawerHeader, DrawerOverlay, DrawerContent, DrawerCloseButton, } from '@chakra-ui/react'
import { FaFilter } from 'react-icons/fa';

function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortType, setSortType] = useState(null); // 'price' or 'stock'
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [isClearable, setIsClearable] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams()
  const [page, setPage] = useState(1)
  const [limit, setLimit] = useState(2)
  const [totalProducts, setTotalProducts] = useState(null)
  const [isFilterVisible, setFilterVisible] = useState(false);

  // const { isOpen, onOpen, onClose } = useDisclosure()
  const navigate = useNavigate();
  const { store_id, store_name } = useSelector((state) => state.location.location.nearestStore);
  const totalPages = Math.ceil(totalProducts / limit);

  const sortOptions = [
    { value: "price_asc", label: "Lowest price" },
    { value: "price_desc", label: "Highest price" },
    // { value: "stock_asc", label: "Lowest Stock" },
    // { value: "stock_desc", label: "Highest stock" },
  ];

  const handleSortChange = (selectedOption) => {
    console.log(selectedOption)
    if (selectedOption) {
      const [sortType, sortOrder] = selectedOption.split('_');
      setSortType(sortType);
      setSortOrder(sortOrder);
      searchParams.set('sort_type', sortType);
      searchParams.set('sort_order', sortOrder);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    } else {
      setSortType(null);
      setSortOrder(null);
      searchParams.delete('sort_type');
      searchParams.delete('sort_order');
      setSearchParams(new URLSearchParams(searchParams.toString()));
    }
  };

  function formatProductName(productName) {
    return productName.replace(/\s+/g, '-').toLowerCase();
  }

  // useEffect(() => {
  //   const pageParam = Number(searchParams.get('page'));
  //   setPage(pageParam || 1);
  // }, [searchParams]);

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategories(result);
    };

    const getProducts = async () => {
      const categoryParam = searchParams.get('category')
      setSelectedCategory(categoryParam)
      const sortTypeParam = searchParams.get('sort_type')
      const sortOrderParam = searchParams.get('sort_order')
      const pageParam = Number(searchParams.get('page'));
      setPage(pageParam || 1);
      const result = await fetchProducts(store_id, categoryParam, page, limit, sortTypeParam, sortOrderParam);
      setProducts(result.products)
      setTotalProducts(result.total);
    };
    getProducts();
    getCategories();

  }, [store_idsearchParams, page]);

  return (
    <div className="flex flex-col gap-5">
      <div className="h-60 bg-sky-300"></div>
      <div className="md:w-[95%] xl:max-w-screen-xl mx-auto">
        <div className="flex gap-5 min-h-screen">
          {/* Sidebar - START */}
          <div className="hidden lg:flex flex-col w-[20%] gap-5">
            <div className="text-xl ">
              <p className="font-semibold">
                Store: <span className="text-green-500">{store_name}</span>
              </p>
            </div>
            <div className='flex flex-col gap-5'>
              <div className='flex flex-col gap-2 '>
                <p className='font-semibold text-lg border-b-2 border-neutral-200 pb-2 text-neutral-600'>Category</p>
                <div className='flex flex-col gap-2 overflow-y-auto h-[300px] pr-2'>
                  {categories.map(category => (
                    <div
                      className={`flex border px-4 py-2 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100
                        ${selectedCategory === category.label.toLowerCase() ? 'font-semibold border-green-500 text-green-500' : ''}`}
                      onClick={() => handleSetCategory((category.label).toLowerCase())}
                    >
                      <img className='h-5' src={`http://localhost:8000/${category.image}`} alt="" />
                      <p className=''>{category.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          {/* Sidebar - END */}
          {/* Content - START */}
          <div className='flex flex-col gap-5 w-[90%] lg:w-[80%] mx-auto'>
            {/* Content Header - START */}
            <div className='flex lg:justify-end'>
              {/* Filter - START */}
              <div className='lg:hidden'>
                <div onClick={() => setFilterVisible(true)} className=' hover:bg-green-500 text-green-500 hover:text-white border-2 border-green-500 px-4 py-1 rounded-full flex items-center gap-1 cursor-pointer duration-150'>
                  <FaFilter size={15} />
                  <p className='font-semibold'>Filter</p>
                </div>
                <Drawer
                  isOpen={isFilterVisible}
                  placement='bottom'
                  onClose={() => setFilterVisible(false)}
                >
                  <DrawerOverlay />
                  <DrawerContent>
                    <DrawerCloseButton />
                    <DrawerHeader className='bg-green-500 text-white'>Filter</DrawerHeader>
                    <DrawerBody>
                      <RadioGroup onChange={handleSortChange} value={sortType && sortOrder ? `${sortType}_${sortOrder}` : ""}>
                        <Text className='font-semibold text-lg'>Sort by</Text>
                        <Divider mb={'2'} />
                        <Stack direction="column">
                          <Radio value="" colorScheme='green'>Default</Radio>
                          <Radio value="price_asc" colorScheme='green'>Lowest price</Radio>
                          <Radio value="price_desc" colorScheme='green'>Highest price</Radio>
                        </Stack>
                      </RadioGroup>
                      <Box>
                        <Text className='font-semibold text-lg mt-5'>Category</Text>
                        <Divider mb={'2'} />
                        <div className='flex flex-col gap-2 overflow-y-auto h-[300px] pr-2'>
                          {categories.map(category => (
                            <div
                              className={`flex border px-4 py-1 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100 ${selectedCategory === category.label.toLowerCase() ? 'font-semibold border-green-500 text-green-500' : ''}`}
                              onClick={() => handleSetCategory((category.label).toLowerCase())}
                            >
                              <img className='h-5' src={`http://localhost:8000/${category.image}`} alt="" />
                              <p className=''>{category.label}</p>
                            </div>
                          ))}
                        </div>
                      </Box>
                    </DrawerBody>
                    <DrawerFooter>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
              </div>
              {/* Filter - END */}
              <div className='hidden lg:flex w-[30%] gap-2 items-center'>
                <p className='font-semibold'>Urutkan: </p>
                <Select
                  className='w-full'
                  id="product_sort_id"
                  name="product_sort_id"
                  placeholder="Sort by"
                  options={sortOptions}
                  isClearable={isClearable}
                  onChange={(selectedOption) => handleSortChange(selectedOption ? selectedOption.value : '')}
                />
              </div>
            </div>
            {/* Content Header - END */}
            {/* Content Body - START */}
            <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-auto'>
              {products.map(product => (
                <Card variant='elevated' className='cursor-pointer' onClick={() => navigate(`/products/${formatProductName(product.product_name)}`)}>
                  <Image
                    src='https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png'
                    alt='Green double couch with wooden legs'
                    borderTopRadius='lg'
                  />
                  <CardHeader padding={'2'}>
                    <Heading className='line-clamp-2' size='sm' fontWeight={'normal'}> {product.product_name}</Heading>
                  </CardHeader>
                  <CardBody padding={'2'}>
                    <Text className='font-semibold'>{formatRupiah(product.product_price)}</Text>
                  </CardBody>
                  <CardFooter></CardFooter>
                </Card>
              ))}
            </div>
            {/* Content Body - END */}
            <div>
              <div>
                {totalProducts > limit &&
                  <ReactPaginate
                    previousLabel={<IoIosArrowBack />}
                    nextLabel={<IoIosArrowForward />}
                    breakLabel={"..."}
                    breakClassName={"break-me"}
                    pageCount={totalPages}
                    marginPagesDisplayed={2}
                    pageRangeDisplayed={5}
                    onPageChange={handlePageClick}
                    containerClassName={"pagination flex justify-center gap-4 items-center"}
                    pageLinkClassName={"px-1"}
                    previousLinkClassName={"previous-link"}
                    previousClassName='pt-1'
                    nextClassName='pt-1'
                    nextLinkClassName={"next-link"}
                    disabledClassName={"disabled"}
                    activeClassName={"active font-semibold border-b-2 border-w text-green-500 border-b-green-500"}
                    forcePage={page - 1} // react-paginate mulai dari 0
                  />
                }
              </div>
            </div>
          </div>
          {/* Content - END */}
        </div>
      </div>
      <div className='h-60 bg-red-500' >
      </div>
    </div>
  )
}

export default Products;
