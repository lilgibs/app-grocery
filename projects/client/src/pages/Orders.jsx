import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";

const Orders = () => {
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // Image upload and preview
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

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
                    <Button variant="solid" colorScheme="orange" onClick={onOpen}>
                      Upload Payment Proof
                    </Button>

                    <Button variant="solid" colorScheme="red">
                      Cancel Order
                    </Button>
                  </CardFooter>
                </Card>

                <Modal isOpen={isOpen} onClose={onClose}>
                  <ModalOverlay />
                  <ModalContent>
                    <ModalHeader>Upload payment proof</ModalHeader>
                    <ModalCloseButton />

                    <ModalBody>
                      <div>
                        <label htmlFor="cover-photo" className="block text-sm font-medium leading-6 text-gray-900">
                          Payment proof
                        </label>
                        <div className="mt-2 flex justify-center rounded-lg border border-dashed border-gray-900/25 px-6 py-10">
                          {previewImage ? (
                            <img src={previewImage} alt="Preview" className="mx-auto h-32 w-32 object-cover rounded" />
                          ) : (
                            <div className="text-center">
                              {/* <PhotoIcon className="mx-auto h-12 w-12 text-gray-300" aria-hidden="true" /> */}
                              <div className="mt-4 flex text-sm leading-6 text-gray-600">
                                <label
                                  htmlFor="file-upload"
                                  className="relative cursor-pointer rounded-md bg-white font-semibold text-green-600 focus-within:outline-none focus-within:ring-2 focus-within:ring-indigo-600 focus-within:ring-offset-2 hover:text-indigo-500"
                                >
                                  <span>Upload a file</span>
                                  <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleImageUpload} />
                                </label>
                                <p className="pl-1">or drag and drop</p>
                              </div>
                              <p className="text-xs leading-5 text-gray-600">PNG, JPG, GIF up to 10MB</p>
                            </div>
                          )}
                        </div>
                      </div>
                    </ModalBody>

                    <ModalFooter>
                      <Button colorScheme="orange" mr={3}>
                        Upload
                      </Button>
                      <Button variant="ghost" onClick={onClose}>
                        Cancel
                      </Button>
                    </ModalFooter>
                  </ModalContent>
                </Modal>
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
