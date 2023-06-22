import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom'
import { fetchProduct, fetchProductUser } from '../features/productSlice';
import { formatRupiah } from '../utils/formatRupiah';

function Product() {
  const [quantity, setQuantity] = useState(1)

  const { productId } = useParams();
  const dispatch = useDispatch()
  const navigate = useNavigate();

  const { user_id } = useSelector((state) => state.user.user);
  const product = useSelector(state => state.product.product)
  const { store_id, store_name } = useSelector(state => state.location.location.nearestStore)

  // fungsi untuk menambah quantity
  const increaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity + 1)
  }

  // fungsi untuk mengurangi quantity
  const decreaseQuantity = () => {
    setQuantity(prevQuantity => prevQuantity > 1 ? prevQuantity - 1 : 1)
  }

  // Handle manual input
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);

    // Ensure value is a number and is at least 1
    const quantity = isNaN(value) ? 1 : value < 1 ? 1 : value;

    setQuantity(quantity)
  }

  const handleAddToCart = async () => {
    try {
      // const response = await axios.post('http://localhost:3000/api/cart', {
      //   userId: user_id,
      //   storeInventoryId: product.store_inventory_id, //change product_id in table 'cart' to store_inventroy_id
      //   quantity: quantity,
      // });
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProductUser(productId, store_id));
      } catch (error) {
        alert(error.response.data)
        navigate('/products');
      }
    };

    fetchData();
  }, [dispatch, store_id, navigate, productId]);

  return (
    <div className='flex flex-col gap-5 mt-10'>
      <div className='md:w-[95%] xl:max-w-screen-lg mx-auto border rounded-md p-5 shadow-md'>
        <div className='flex gap-5 h-auto'>
          {/*  */}
          <div className=' w-[40%] flex gap-2'>
            <div className='w-1/5 flex flex-col gap-2'>
              <img className='w-full' src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
              <img className='w-full' src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
              <img className='w-full' src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
            </div>
            <div className='w-4/5'>
              <img className='w-full' src="https://webstyle.unicomm.fsu.edu/3.4/img/placeholders/ratio-pref-1-1.png" alt="" />
            </div>
          </div>

          {/*  */}
          <div className='w-[60%] flex flex-col gap-5'>
            <h2 className='font-semibold text-3xl'>{product.product_name}</h2>
            <p className='font-semibold text-4xl bg-neutral-50 rounded-md p-3 text-red-500'>{formatRupiah(product.product_price)}</p>
            <div>
              <p className='text-lg font-semibold'>Description</p>
              <p className=' text-lg'>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Sapiente, illo accusantium officia esse in id voluptas atque architecto quas distinctio magni facilis culpa sed iusto pariatur, itaque quo eligendi voluptatum!</p>
            </div>
            <div className='flex flex-col gap-2'>
              <p className='text-lg font-semibold'>Quantity</p>
              <div className='flex gap-2'>
                <div className='flex flex-row px-4 py-2 rounded-md border justify-between font-semibold'>
                  <button onClick={decreaseQuantity}>-</button>
                  <input type='number' className='text-center' value={quantity} onChange={handleInputChange} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <button
                  className='px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-md disabled:cursor-not-allowed'
                  disabled={!user_id}
                  onClick={''}
                >
                  Add To Cart
                </button>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>

  )
}

export default Product