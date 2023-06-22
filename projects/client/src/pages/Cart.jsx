import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Thead, Tbody, Tfoot, Tr, Th, Td, TableCaption, TableContainer } from "@chakra-ui/react";
import { Button, ButtonGroup } from "@chakra-ui/react";
import { NumberInput, NumberInputField, NumberInputStepper, NumberIncrementStepper, NumberDecrementStepper } from "@chakra-ui/react";
import { Card, CardHeader, CardBody, CardFooter, Heading, Stack, StackDivider, Box, Text } from "@chakra-ui/react";
import { Icon, Select } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { GrUpdate } from "react-icons/gr";

const Cart = () => {
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);

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

                  <Tbody>
                    <Tr>
                      <Td>Product 1</Td>
                      <Td>Rp30.000,00</Td>
                      <Td>
                        <NumberInput defaultValue={2} max={15} min={0} clampValueOnBlur={false} w="80px">
                          <NumberInputField />
                          <NumberInputStepper>
                            <NumberIncrementStepper />
                            <NumberDecrementStepper />
                          </NumberInputStepper>
                        </NumberInput>
                      </Td>
                      <Td>Rp60.000,00</Td>
                      <Td>
                        <Button colorScheme="red" variant="ghost">
                          X
                        </Button>
                      </Td>
                    </Tr>
                  </Tbody>

                  <TableCaption className="pt-10">
                    <div className="flex flex-row justify-between">
                      <Button bg="green.100" color="green.500">
                        ← Continue Shopping
                      </Button>

                      <Button bg="orange.400" color="white">
                        <Icon as={GrUpdate} mr="2" />
                        Update cart
                      </Button>
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
                      Rp60.000,00
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Discount</Heading>
                      Rp0
                    </Box>
                    <Box className="flex justify-between">
                      <Heading size="sm">Shipping</Heading>
                      Rp15.000,00
                    </Box>
                    <Box className="flex justify-between font-bold text-lg">
                      <Heading size="md">Total</Heading>
                      <Text>Rp75.000,00</Text>
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

          <div className="mt-5">
            <div>
              <Card>
                <CardHeader>
                  <Heading size="md">Shipping option</Heading>
                </CardHeader>

                <CardBody className="grid grid-rows-2 gap-2">
                  <div>
                    <Select placeholder="Address">
                      <option value="option1">Address 1</option>
                    </Select>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <Select placeholder="Courier">
                      <option value="option1">POS Indonesia</option>
                    </Select>

                    <Select placeholder="Service">
                      <option value="option1">POS Sameday</option>
                      <option value="option1">POS Kargo</option>
                    </Select>
                  </div>
                </CardBody>

                <CardFooter className="flex text-sm gap-1">
                  <Text>Estimated arrival date:</Text>
                  <Text className="text-green-500 font-bold">13 July 2023</Text>
                </CardFooter>
              </Card>
            </div>
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
