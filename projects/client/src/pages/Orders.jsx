import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import OrderItem from "../components/OrderItem";

const Orders = () => {
  const nav = useNavigate();
  const userGlobal = useSelector((state) => state.user.user);
  const orderGlobal = useSelector((state) => state.order.order);
  const orderItems = orderGlobal.order_items;

  const renderOrderItems = () => {
    // return console.log(orderItems);
    return orderItems.map((o, index) => {
      return (
        <OrderItem
          //
          key={index}
          order_id={o.order_id}
          order_date={o.order_date}
          shipping_courier={o.shipping_courier}
          shipping_type={o.shipping_type}
          shipping_price={o.shipping_price}
          total_price={o.total_price}
          payment_proof={o.payment_proof}
          order_status={o.order_status}
        />
      );
    });
  };

  return (
    <div className="mx-20">
      {userGlobal.user_id > 0 ? (
        <>
          <div className="grid grid-cols-5 m-10">
            <div cl>
              <h1 className="text-3xl pt-5 font-semibold tracking-tight text-gray-900 ">Orders</h1>
            </div>

            {orderItems.length === 0 ? (
              <div className="col-span-4 pt-7">You haven't made any orders yet</div>
            ) : (
              <>
                <div className="col-span-4 flex flex-col gap-6">{renderOrderItems()}</div>
              </>
            )}
          </div>
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
