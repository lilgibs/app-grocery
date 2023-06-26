import React, { useEffect } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { useDispatch, useSelector } from "react-redux";

const CartItem = ({ product, price, quantity }) => {
  return (
    <Tr>
      <Td>{product}</Td>
      <Td>{price}</Td>
      <Td>
        <NumberInput defaultValue={quantity} max={15} min={0} clampValueOnBlur={false} w="80px">
          <NumberInputField />
          <NumberInputStepper>
            <NumberIncrementStepper />
            <NumberDecrementStepper />
          </NumberInputStepper>
        </NumberInput>
      </Td>
      <Td>Total</Td>
      <Td>
        <Button colorScheme="red" variant="ghost">
          X
        </Button>
      </Td>
    </Tr>
  );
};

export default CartItem;
