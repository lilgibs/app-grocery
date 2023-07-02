import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import { formatRupiah } from "../utils/formatRupiah";
import axios from "axios";
import { fetchOrder } from "../features/orderSlice";

const OrderItem = ({ order_id, order_date, shipping_courier, shipping_type, shipping_price, total_price, payment_proof, order_status }) => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const { isOpen, onOpen, onClose } = useDisclosure();

  // image upload and preview
  const [previewImage, setPreviewImage] = useState(null);

  const handleImageUpload = (event) => {
    const file = event.target.files[0];

    if (!["image/jpeg", "image/png", "image/jpg"].includes(file.type)) {
      alert("Only JPEG/JPG/PNG files are supported");
      return;
    }

    if (file.size > 1000000) {
      // size limit 1MB
      alert("Maximum size is 1MB");
      return;
    }

    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCancel = async () => {
    try {
      // console.log(cart);
      const response = await axios.put(`http://localhost:8000/api/order/cancelorder/?orderId=${order_id}`);
      dispatch(fetchOrder(userGlobal.user_id));
      alert(response.data.message);
      // console.log(response.data);
    } catch (error) {
      console.error("Failed to cancel order: ", error);
    }
  };

  return (
    <>
      {order_status != "Canceled" ? (
        <>
          <Card>
            <CardHeader className="flex flex-row justify-between">
              <div className="flex gap-3">
                <Heading size="md" mb="2">
                  Order #{order_id}
                </Heading>
                <Text className="text-gray-400 font-bold">{order_status}</Text>
              </div>

              <Text className="text-sm text-gray-400">Order made: {Date(order_date).toLocaleString("id-ID")}</Text>
            </CardHeader>

            <CardBody>
              <Stack divider={<StackDivider />} spacing="4">
                <Box className="flex justify-between">
                  <Heading size="sm">Subtotal</Heading>
                  {formatRupiah(total_price - shipping_price)}
                </Box>

                <Box className="flex justify-between">
                  <Heading size="sm">Shipping</Heading>
                  <div>
                    {formatRupiah(shipping_price)}
                    <div className="text-xs font-bold text-green-500 ">
                      {shipping_courier.toUpperCase()} - {shipping_type}
                    </div>
                  </div>
                </Box>

                <Box className="flex justify-between font-bold text-lg">
                  <Heading size="md">Total</Heading>
                  <Text>{formatRupiah(total_price)}</Text>
                </Box>
              </Stack>
            </CardBody>

            <CardFooter className="flex gap-3">
              {payment_proof === null ? (
                <>
                  <Button variant="solid" colorScheme="orange" onClick={onOpen}>
                    Upload Payment Proof
                  </Button>
                  <Button variant="ghost" colorScheme="red" onClick={handleCancel}>
                    Cancel Order
                  </Button>
                </>
              ) : (
                <>
                  <div>Waiting for shipment by admin</div>
                </>
              )}
            </CardFooter>
          </Card>

          <Modal closeOnOverlayClick={false} isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>Upload payment proof</ModalHeader>
              {/* <ModalCloseButton /> */}

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
                        <p className="text-xs leading-5 text-gray-600">JPEG, JPG, PNG up to 1MB</p>
                      </div>
                    )}
                  </div>
                </div>
              </ModalBody>

              <ModalFooter>
                <Button colorScheme="orange" mr={3}>
                  Upload
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    onClose();
                    setPreviewImage(null);
                  }}
                >
                  Cancel
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </>
      ) : (
        <></>
      )}
    </>
  );
};

export default OrderItem;
