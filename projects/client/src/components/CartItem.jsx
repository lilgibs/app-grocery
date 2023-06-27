import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import { fetchCart } from "../features/cartSlice";
import axios from "axios";

const CartItem = ({ cart_id, product_id, product, price, quantity, stock, subtotal }) => {
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
      const response = await axios.delete("http://localhost:8000/api/cart/deletefromcart", { data: cart });
      dispatch(fetchCart(userGlobal));
      alert(response.data.message);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to delete item from cart:", error);
    }
  };

  const handleAddCartQty = async () => {
    try {
      let cart = {
        cart_id: cart_id,
        product_id: product_id,
        quantity: quantity,
        method: "add",
      };

      // console.log(cart);
      const response = await axios.post("http://localhost:8000/api/cart/updatecart", cart);
      dispatch(fetchCart(userGlobal));
      alert(response.data.message);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to add cart quantity:", error);
    }
  };

  return (
    <Tr>
      <Td>
        {/* {cart_id}  */}
        {/* {product_id} */}
        {product}
      </Td>
      <Td>{formatRupiah(price)}</Td>
      <Td>
        <NumberInput defaultValue={quantity} max={stock} min={1} clampValueOnBlur={true} isDisabled={true} w="80px">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
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
