import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import { fetchCart } from "../features/cartSlice";
import axios from "axios";

const CartItem = ({ cart_id, product_id, product, price, discount_value, discounted_price, weight, quantity, stock, subtotal, buy1get1 }) => {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const storeId = useSelector((state) => state.location.location.nearestStore.store_id);

  const handleDeleteFromCart = async () => {
    try {
      let cart = {
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity,
      };

      // console.log(cart);
      const response = await axios.delete("http://localhost:8000/api/cart/", { data: cart });
      dispatch(fetchCart(userGlobal.user_id, storeId));
      alert(response.data.message);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
    }
  };

  const handleUpdateCart = async (method) => {
    try {
      let cart = {
        cart_id: cart_id,
        product_id: product_id,
        quantity: 1,
        method: method,
      };

      const response = await axios.patch("http://localhost:8000/api/cart/", cart);
      dispatch(fetchCart(userGlobal.user_id, storeId));
    } catch (error) {
      method == "add" ? alert("Not enough stock for this product") : alert("Minimum quantity in cart is 1");
    }
  };

  return (
    <Tr>
      <Td>
        {/* {cart_id}  */}
        {/* {product_id} */}
        {/* {weight}g */}

        {product}
      </Td>
      <Td>
        {discount_value === null ? (
          <span>{formatRupiah(price)} </span>
        ) : (
          <>
            <span className="text-gray-400 line-through mr-2">{formatRupiah(price)}</span> <span className="text-red-500 font-semibold">{formatRupiah(discounted_price)}</span>{" "}
          </>
        )}
        {buy1get1 === 1 ? <span className="text-red-500 font-semibold ml-3">BUY 1 GET 1</span> : <></>}
      </Td>

      {/* <Td>{formatRupiah(price)}</Td> */}
      <Td>
        <NumberInput>
          {buy1get1 === 1 ? (
            <>
              <span className="text-gray-400 line-through mr-2">{quantity / 2}</span> <span className="text-red-500 font-semibold">{quantity}</span>
            </>
          ) : (
            <> {quantity}</>
          )}
          {/* {quantity} */}
          <NumberInputStepper>
            <NumberIncrementStepper
              onClick={() => {
                handleUpdateCart("add");
              }}
            />
            <NumberDecrementStepper
              onClick={() => {
                handleUpdateCart("subs");
              }}
            />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td> {formatRupiah(subtotal)}</Td>
      <Td>
        <Button
          colorScheme="red"
          variant="ghost"
          onClick={() => {
            handleDeleteFromCart();
          }}
        >
          X
        </Button>
      </Td>
    </Tr>
  );
};

export default CartItem;
