import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { fetchProduct, fetchProductUser } from "../features/productSlice";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { fetchCart } from "../features/cartSlice";

function Product() {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState();

  const { productName } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user_id } = useSelector((state) => state.user.user);
  const product = useSelector((state) => state.product.product);
  const { isLoading } = useSelector((state) => state.product);
  const { store_id, store_name } = useSelector((state) => state.location.location.nearestStore);
  const userGlobal = useSelector((state) => state.user.user);

  // fungsi untuk menambah quantity
  const increaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity === product.quantity_in_stock ? prevQuantity : prevQuantity + 1));
  };

  // fungsi untuk mengurangi quantity
  const decreaseQuantity = () => {
    setQuantity((prevQuantity) => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };

  // Handle manual input
  const handleInputChange = (event) => {
    const value = parseInt(event.target.value);
    const stock = product.quantity_in_stock;

    // Ensure value is a number and is at least 1
    let quantity = isNaN(value) ? 1 : value < 1 ? 1 : value;

    // Ensure quantity does not exceed stock
    quantity = Math.min(quantity, stock);

    setQuantity(quantity);
  };

  const handleAddToCart = async () => {
    try {
      let cart = {
        user_id: user_id,
        product_id: product.product_id,
        quantity: quantity,
        store_id: store_id,
        discount: product.discounted_price,
      };

      // console.log(object);
      const response = await axios.post(`${process.env.REACT_APP_API_BASE_URL}/cart/`, cart);

      dispatch(fetchCart(userGlobal.user_id, store_id));
      dispatch(fetchProductUser(productName, store_id));
      alert(response.data.message);
    } catch (error) {
      alert(`Add to cart fails. Amount in cart (${quantity}) exceeds product's stock`);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await dispatch(fetchProductUser(productName, store_id));
      } catch (error) {
        await alert(error.response.data);
        navigate("/products");
      }
    };

    fetchData();
  }, [productName, store_id]);

  useEffect(() => {
    if (product && product.product_images && product.product_images.length > 0) {
      setSelectedImage(`${process.env.REACT_APP_API_IMG_URL + product.product_images[0].image_url}`);
    }
  }, [product]);

  if (!isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col gap-5 lg:mt-10">
      <div className="md:w-[95%] xl:max-w-screen-lg mx-auto lg:border rounded-md p-5 ">
        <div className="flex flex-col sm:flex-row gap-5 h-auto">
          {/*  */}
          <div className=" md:w-[40%] flex flex-col-reverse lg:flex-row gap-3 justify-end">
            {/* Image List - START */}
            <div className="lg:w-1/5 flex flex-row lg:flex-col gap-2">
              {product.product_images.map((image, index) => (
                <div
                  key={index}
                  onClick={() => {
                    setSelectedImage(`${process.env.REACT_APP_API_IMG_URL + image.image_url}`);
                  }}
                  className={`rounded-md w-1/5 lg:w-full cursor-pointer ${selectedImage === `${process.env.REACT_APP_API_IMG_URL + image.image_url}` ? "outline outline-offset-2 outline-1 outline-green-500" : ""}`}
                >
                  <img className="w-full" src={`${process.env.REACT_APP_API_IMG_URL + image.image_url}`} alt="" />
                </div>
              ))}
            </div>
            {/* Image List - END */}

            {/* Preview */}
            <div className="w-full lg:w-4/5">
              <img className="w-full" src={selectedImage} alt="" />
            </div>
          </div>

          {/*  */}
          <div className="md:w-[60%] flex flex-col gap-5">
            <h2 className="font-semibold text-xl md:text-2xl">{product.product_name}</h2>
            {product.discounted_price ? (
              <div className="flex gap-2 bg-neutral-100  p-3 items-center rounded">
                <p className=" text-sm md:text-lg bg-neutral-100 text-neutral-500 line-through">{formatRupiah(product.product_price)}</p>
                <p className="font-semibold text-2xl md:text-3xl bg-neutral-100 rounded-md text-rose-500">{formatRupiah(product.discounted_price)}</p>
                {product.discount_value_type == "PERCENTAGE" ? <p className="bg-red-600 text-white px-1 rounded-sm text-xs font-bold">{parseInt(product.discount_value)}% OFF</p> : null}
              </div>
            ) : (
              <p className="font-semibold text-2xl md:text-3xl bg-neutral-100 rounded p-3 text-rose-500">{formatRupiah(product.product_price)}</p>
            )}

            <div>
              <p className="md:text-lg font-semibold">Description</p>
              <p className=" md:text-lg">{product.product_description}</p>
            </div>
            <div className="flex flex-col gap-2">
              <p className="md:text-lg font-semibold">Quantity</p>
              <div className="flex flex-col lg:flex-row gap-2">
                <div className="flex flex-row px-4 py-2 rounded-md border justify-between font-semibold">
                  <button onClick={decreaseQuantity}>-</button>
                  <input type="number" className="text-center mx-2" value={quantity} onChange={handleInputChange} />
                  <button onClick={increaseQuantity}>+</button>
                </div>
                <button
                  className="px-4 py-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white font-semibold rounded-md disabled:cursor-not-allowed"
                  disabled={!user_id || product.quantity_in_stock === 0}
                  onClick={() => {
                    handleAddToCart();
                  }}
                >
                  Add To Cart
                </button>
              </div>
              <div className="text-neutral-400">Stock: {product.quantity_in_stock}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
