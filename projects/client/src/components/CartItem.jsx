import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";

const CartItem = ({ cart_id, product, price, quantity, stock, subtotal }) => {
  return (
    <Tr>
      <Td>
        {/* {cart_id}  */}
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
        <Button colorScheme="red" variant="ghost">
          X
        </Button>
      </Td>
    </Tr>
  );
};

export default CartItem;
