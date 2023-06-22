import { Button, Card, CardBody, CardFooter, CardHeader, Heading, Image, Text } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { fetchCategories } from '../api/adminApi';
import Select from 'react-select';
import { fetchProducts } from '../api/userApi';
import { useNavigate } from 'react-router-dom'
import { resetProduct } from '../features/productSlice';
import { useDispatch, useSelector } from 'react-redux';


function Products() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const navigate = useNavigate()
  const { store_id, store_name } = useSelector(state => state.location.location.nearestStore)

  const FilterComponent = (
    <Select
      id="product_category_id"
      name="product_category_id"
      placeholder="Category"
      // isClearable={isClearable}
      options={categories}
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

  // const handleSortChange = (selectedOption) => {
  //   if (selectedOption) {
  //     const [sortType, sortOrder] = selectedOption.value.split('_');
  //     setSortType(sortType);
  //     setSortOrder(sortOrder);
  //     console.log('Sort type', sortType)
  //   } else {
  //     setSortType(null);
  //     setSortOrder(null);
  //   }
  //   // Then fetch the products
  //   fetchProducts();
  // };

  function formatProductName(productName) {
    return productName.replace(/\s+/g, '-').toLowerCase();
  }

  useEffect(() => {
    const getCategories = async () => {
      const result = await fetchCategories();
      setCategories(result);
    };

    const getProducts = async () => {
      const result = await fetchProducts(store_id)
      setProducts(result)
    }
    getProducts()
    getCategories();
  }, [store_id, ]);

  return (
    <div className='flex flex-col gap-5'>
      <div className='h-60 bg-sky-300'></div>
      <div className='md:w-[95%] xl:max-w-screen-xl mx-auto'>
        <div className='flex gap-5'>
          {/* Sidebar */}
          <div className='hidden lg:flex flex-col w-[20%] gap-5'>
            <div className='bg-pink-100 h-16 text-xl'>
              <p className='font-semibold'>Store: <span className='text-green-500'>{store_name}</span></p>
            </div>
            <div className='h-screen flex flex-col gap-5'>
              <div className='flex flex-col gap-2 '>
                <p className='font-semibold text-lg border-b-2 border-neutral-200 pb-2 text-neutral-600'>Category</p>
                <div className='flex flex-col gap-2 overflow-y-auto h-[300px] pr-2'>
                  {categories.map(category => (
                    <div className='flex border px-4 py-2 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100'>
                      <img className='h-5' src={`http://localhost:8000/${category.image}`} alt="" />
                      <p className=''>{category.label}</p>
                    </div>
                  ))}
                  <div className='flex border px-4 py-2 rounded-sm gap-5 items-center'>
                    <p>Kategori</p>
                  </div>
                  <div className='flex border px-4 py-2 rounded-sm gap-5 items-center'>
                    <p>Kategori</p>
                  </div><div className='flex border px-4 py-2 rounded-sm gap-5 items-center'>
                    <p>Kategori</p>
                  </div><div className='flex border px-4 py-2 rounded-sm gap-5 items-center'>
                    <p>Kategori</p>
                  </div>
                </div>
                <div>
                </div>
              </div>

              <div>
                <p className='font-semibold text-xl border-b-2 text-gray-400 border-neutral-200 pb-2 border-b-green-500'>Sort</p>

              </div>
            </div>
          </div>
          {/* Sidebar - END */}
          {/* Content - START */}
          <div className='flex flex-col gap-5 w-[95%] md:w-[80%] mx-auto'>
            <div className='bg-blue-100 h-16'></div>
            <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-5 h-auto'>
              {products.map(product => (
                <Card variant='elevated' className='cursor-pointer' onClick={() => navigate(`/products/${formatProductName(product.product_name)}`)}>
                  <Image
                    src='https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1770&q=80'
                    alt='Green double couch with wooden legs'
                    borderTopRadius='lg'
                  />
                  <CardHeader padding={'2'}>
                    <Heading size='sm' fontWeight={'normal'}> {product.product_name}</Heading>
                  </CardHeader>
                  <CardBody padding={'2'}>
                    <Text className='font-semibold'>{product.product_price}</Text>
                  </CardBody>
                  <CardFooter>
                  </CardFooter>
                </Card>
              ))}
            </div>
            <div className='bg-green-300 h-16'>

            </div>
          </div>
          {/* Content - END */}
        </div>

      </div>
    </div>


  )
}

export default Products