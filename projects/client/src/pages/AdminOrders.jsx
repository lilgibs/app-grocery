import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Card, CardHeader, CardBody, CardFooter, Text, Heading, Box, StackDivider } from "@chakra-ui/react";
import { Button, Stack } from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import { setOrderItems } from "../features/orderSlice";

import axios from "axios";

const AdminOrders = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const adminGlobal = useSelector((state) => state.admin.admin);
  const orderGlobal = useSelector((state) => state.order.order);
  const orderItems = orderGlobal.order_items;
  const storeId = adminGlobal.store_id;

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const handlePaginatePrev = () => {
    if (currentPage === 1) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage - 1);
    }
  };

  const handlePaginateNext = () => {
    if (currentPage === totalPages) {
      setCurrentPage(currentPage);
    } else {
      setCurrentPage(currentPage + 1);
    }
  };

  // sort by
  const [sortBy, setSortBy] = useState("desc");
  //......

  // status filter
  const [selectedStatus, setSelectedStatus] = useState("All");
  const statuses = ["All", "Waiting for payment", "Waiting for confirmation", "Processed", "Out for delivery", "Delivered", "Canceled"];

  const handleStatus = async (status) => {
    try {
      setSelectedStatus(status);

      if (status === "All") {
        let response = await axios.get(`http://localhost:8000/api/admin/order/?storeId=${storeId}`);
        if (response) {
          console.log(response.data.orders);
          console.log(response.data.max);
          dispatch(setOrderItems(response.data.orders));
          setTotalPages(response.data.maxPages);
        }
      } else {
        let response = await axios.get(`http://localhost:8000/api/admin/order/by-status/?storeId=${storeId}&orderStatus=${selectedStatus}`);
        if (response) {
          console.log(response.data.orders);
          console.log(response.data.max);
          dispatch(setOrderItems(response.data.orders));
          setTotalPages(response.data.maxPages);
        }
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  // paginate listener
  useEffect(() => {
    console.log(currentPage);
    const renderPaginate = async () => {
      try {
        if (selectedStatus === "All") {
          let response = await axios.get(`http://localhost:8000/api/admin/order/?storeId=${storeId}&page=${currentPage}`);
          if (response) {
            console.log(response.data.orders);
            dispatch(setOrderItems(response.data.orders));
            setTotalPages(response.data.maxPages);
          }
        } else {
          let response = await axios.get(`http://localhost:8000/api/admin/order/by-status/?storeId=${storeId}&orderStatus=${selectedStatus}`);
          if (response) {
            console.log(response.data.orders);
            console.log(response.data.maxPages);
            dispatch(setOrderItems(response.data.orders));
            setTotalPages(response.data.maxPages);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    renderPaginate();
    setSortBy("desc");
  }, [currentPage]);

  // status listener
  useEffect(() => {
    setCurrentPage(1);
    handleStatus(selectedStatus);
  }, [selectedStatus]);

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
      <div className="grid grid-cols-5 gap-5 m-10">
        <div className="flex flex-col gap-5">
          <h1 className="text-3xl pt-5 font-semibold tracking-tight text-pink-500 ">Orders</h1>
          {selectedStatus} - Page: {currentPage}
          {adminGlobal.role == 99 ? <div className="my-2">All Stores</div> : <></>}
          <div className="flex flex-col gap-3">
            {/* status starts */}
            {statuses.map((x) => (
              <div
                className={`flex border px-4 py-2 rounded-md items-center cursor-pointer hover:translate-x-1 duration-100
                    ${selectedStatus === x ? "font-semibold border-pink-500 text-pink-500" : ""}`}
                onClick={() => {
                  handleStatus(x);
                }}
              >
                <p className="">{x}</p>
              </div>
            ))}
            {/* status ends */}
          </div>
        </div>

        <div className="col-span-4 flex flex-col gap-6">
          {/* Pagination starts */}
          <div className="flex gap-3 mb-2">
            <Button
              size="xs"
              onClick={() => {
                handlePaginatePrev();
              }}
            >
              Prev
            </Button>
            <span>
              {currentPage} out of {totalPages}
            </span>
            <Button
              size="xs"
              onClick={() => {
                handlePaginateNext();
              }}
            >
              Next
            </Button>
          </div>
          {/* Pagination ends */}
          <div className="flex flex-col gap-6">{renderOrderItems()}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminOrders;
