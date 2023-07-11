import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { Modal, ModalOverlay, ModalContent, ModalHeader, ModalFooter, ModalBody, ModalCloseButton, useDisclosure } from "@chakra-ui/react";
import OrderItem from "../components/OrderItem";
import axios from "axios";

const AdminOrders = () => {
  const nav = useNavigate();
  const adminGlobal = useSelector((state) => state.admin.admin);
  const orderGlobal = useSelector((state) => state.order.order);
  const orderItems = orderGlobal.order_items;
  const storeId = adminGlobal.store_id;

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
      <div className="grid grid-cols-5 m-10">
        <div cl>
          <h1 className="text-3xl pt-5 font-semibold tracking-tight text-pink-500 ">Orders</h1>
          {adminGlobal.role == 99 ? <div className="my-2">All Stores</div> : <></>}
        </div>
        <div className="col-span-4 flex flex-col gap-6">{renderOrderItems()}</div>
      </div>
    </div>
  );
};

export default AdminOrders;
