import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import { fetchCart } from "../features/cartSlice";
import axios from "axios";

const CartItem = ({ cart_id, product_id, product, price, weight, quantity, stock, subtotal }) => {
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);

  const handleDeleteFromCart = async () => {
    try {
      let cart = {
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity,
      };

      // console.log(cart);
      const response = await axios.delete("http://localhost:8000/api/cart/", { data: cart });
      dispatch(fetchCart(userGlobal.user_id));
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
      dispatch(fetchCart(userGlobal.user_id));
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
      <Td>{formatRupiah(price)}</Td>
      <Td>
        <NumberInput>
          {quantity}
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
