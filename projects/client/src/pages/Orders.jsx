import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

const Orders = () => {
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);

  return (
    <div className="mx-20">
      {userGlobal.user_id > 0 ? (
        <>
          <div>
            <h1 className="text-3xl mt-10 mb-5 font-semibold tracking-tight text-gray-900 ">Order List</h1>
          </div>

          <Tabs variant="soft-rounded" colorScheme="green">
            <TabList>
              <Tab>To Pay</Tab>
              <Tab>To Deliver</Tab>
              <Tab>In-Delivery</Tab>
              <Tab>Delivered</Tab>
            </TabList>
            <TabPanels>
              <TabPanel className="flex flex-col gap-5">
                {/* Waiting for Payment */}
                <Card>
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <Heading size="md" mb="2">
                        Order #1
                      </Heading>
                      <Text className="text-orange-400 font-bold">Waiting for Payment</Text>
                    </div>

                    <Text className="text-sm text-gray-400">Order made: 13 July 2023</Text>
                  </CardHeader>

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

                  <CardFooter className="flex gap-3">
                    <Button variant="solid" colorScheme="orange">
                      Upload Payment Proof
                    </Button>

                    <Button variant="solid" colorScheme="red">
                      Cancel Order
                    </Button>
                  </CardFooter>
                </Card>
              </TabPanel>

              <TabPanel className="flex flex-col gap-5">
                {/* Waiting for Admin to Deliver */}
                <Card>
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <Heading size="md" mb="2">
                        Order #1
                      </Heading>
                      <Text className="text-gray-400 font-bold">Waiting for Admin to Deliver</Text>
                    </div>

                    <Text className="text-sm text-gray-400">Order made: 13 July 2023</Text>
                  </CardHeader>

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
                    <Button variant="solid" colorScheme="gray">
                      See Payment Proof
                    </Button>
                  </CardFooter>
                </Card>
              </TabPanel>

              <TabPanel className="flex flex-col gap-5">
                {/* In-Delivery */}
                <Card>
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <Heading size="md" mb="2">
                        Order #1
                      </Heading>
                      <Text className="text-green-600 font-bold">In-Delivery</Text>
                    </div>

                    <Text className="text-sm text-gray-400">Order made: 13 July 2023</Text>
                  </CardHeader>

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
                    <Button variant="solid" colorScheme="green">
                      Delivery Confirmed
                    </Button>
                  </CardFooter>
                </Card>
              </TabPanel>

              <TabPanel className="flex flex-col gap-5">
                {/* Delivered */}
                <Card>
                  <CardHeader className="flex flex-row justify-between">
                    <div className="flex gap-3">
                      <Heading size="md" mb="2">
                        Order #1
                      </Heading>
                      <Text className="text-sky-300 font-bold">Delivered</Text>
                    </div>

                    <Text className="text-sm text-gray-400">Order made: 13 July 2023</Text>
                  </CardHeader>

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
                </Card>
              </TabPanel>
            </TabPanels>
          </Tabs>

          <div className="flex flex-col gap-5"></div>
        </>
      ) : (
        <>
          <div>
            <h1 className="text-3xl my-10 font-semibold tracking-tight text-gray-900 ">Order List</h1>
          </div>

          <div className="text-center mx-7 py-5">
            <p className="mt-8 text-gray-600 text-md md:text-xl">Login to view your orders</p>
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

export default Orders;
