import React, { useEffect, useState } from "react";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer, Center } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { Icon, Select } from "@chakra-ui/react";
import { GrUpdate } from "react-icons/gr";
import { fetchCart } from "../features/cartSlice";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import CartItem from "../components/CartItem";
import Shipping from "../components/Shipping";

const Cart = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const cartItemsGlobal = useSelector((state) => state.cart.cart.cart_items);
  const cartShippingOptionGlobal = useSelector((state) => state.cart.cart.shipping_option);
  const [subtotal, setSubtotal] = useState(0);
  const [total, setTotal] = useState(0);

  const updateCart = () => {
    // console.log("get cart items");
    dispatch(fetchCart(userGlobal));
  };

  useEffect(() => {
    let sumSubtotal = 0;
    cartItemsGlobal.forEach((x) => {
      sumSubtotal += Number(x.subtotal);
      setSubtotal(sumSubtotal); // get subtotal
    });

    let sumTotal = cartItemsGlobal.length == 0 ? 0 : cartShippingOptionGlobal == null ? subtotal : subtotal + cartShippingOptionGlobal.cost[0].value;

    setTotal(sumTotal); //get total
  });

  const renderCartItems = () => {
    return cartItemsGlobal.map((p, index) => {
      return (
        <CartItem
          //
          key={index}
          cart_id={p.cart_id}
          product_id={p.product_id}
          product={p.product_name}
          price={p.product_price}
          weight={p.weight}
          quantity={p.quantity}
          stock={p.quantity_in_stock}
          subtotal={p.subtotal}
        />
      );
    });
  };

  return (
    <div className="mx-20 my-10">
      {userGlobal.user_id > 0 ? (
        <>
          <div>
            <h1 className="text-3xl mb-10 font-semibold tracking-tight text-gray-900 ">Shopping Cart</h1>
          </div>

          <div className="grid grid-cols-3 gap-5">
            <div className="col-span-2">
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Product</Th>
                      <Th>Price</Th>
                      <Th>Quantity</Th>
                      <Th>Total</Th>
                      <Th></Th>
                    </Tr>
                  </Thead>

                  <Tbody>{renderCartItems()}</Tbody>

                  <TableCaption className="pt-10">
                    <div className="flex flex-row justify-between">
                      <Button bg="green.100" color="green.500">
                        ← Continue Shopping
                      </Button>

                      {/* <Button bg="orange.400" color="white" onClick={updateCart}>
                        <Icon as={GrUpdate} mr="2" />
                        Update cart
                      </Button> */}
                    </div>
                  </TableCaption>
                </Table>
              </TableContainer>
            </div>

            <div className=" flex flex-col gap-2">
              <Card>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing="4">
                    <Box className="flex justify-between">
                      <Heading size="sm">Subtotal</Heading>
                      {cartItemsGlobal.length == 0 ? <>Your cart is empty</> : <>{formatRupiah(subtotal)}</>}
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Discount</Heading>
                      No discount applied
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Shipping</Heading>
                      {cartShippingOptionGlobal == null ? <div className="text-green-500 font-bold">⚠ Select shipping option</div> : <>{formatRupiah(cartShippingOptionGlobal.cost[0].value)}</>}
                    </Box>
                    <Box className="flex justify-between font-bold text-3xl">
                      <Text>Total</Text>
                      <Text>{formatRupiah(total)}</Text>
                    </Box>
                  </Stack>
                </CardBody>

                <CardFooter>
                  <Button variant="solid" colorScheme="green" minW="100%">
                    Order
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>

          <div className="grid grid-cols-2 mt-5">
            <div>
              <Shipping />
            </div>
            <div></div>
          </div>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl my-10 font-semibold tracking-tight text-gray-900 ">Shopping Cart</h1>
          </div>

          <div className="text-center mx-7 py-5">
            <p className="mt-8 text-gray-600 text-md md:text-xl">Login to view your cart</p>
            <div className="mt-5 mx-5 flex flex-col items-center justify-center gap-2 md:flex-row">
              <Stack direction="row" spacing={2}>
                <Button
                  colorScheme="green"
                  variant="outline"
                  size="md"
                  onClick={() => {
                    nav("/login");
                  }}
                >
                  Login
                </Button>
                <Button
                  bg="green.400"
                  color="white"
                  variant="solid"
                  size="md"
                  onClick={() => {
                    nav("/register");
                  }}
                >
                  Register
                </Button>
              </Stack>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Cart;
