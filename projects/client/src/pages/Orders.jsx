import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Button, Stack, Input, Text, Select, Divider } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import OrderItem from "../components/OrderItem";
import axios from "axios";
import { setOrderItems } from "../features/orderSlice";

const Orders = () => {
  const nav = useNavigate();
  const dispatch = useDispatch();
  const userGlobal = useSelector((state) => state.user.user);
  const orderGlobal = useSelector((state) => state.order.order);
  const orderItems = orderGlobal.order_items;

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

  const handleSortChange = (event) => {
    const selectedValue = event.target.value;
    const orderItems = [...orderGlobal.order_items];

    setSortBy(selectedValue);
    if (selectedValue === "desc") {
      const sortDesc = orderItems.sort((a, b) => b.order_id - a.order_id);
      dispatch(setOrderItems(sortDesc));
    } else if (selectedValue === "asc") {
      const sortAsc = orderItems.sort((a, b) => a.order_id - b.order_id);
      dispatch(setOrderItems(sortAsc));
    }
  };

  // id filter
  const [selectedId, setSelectedId] = React.useState("");
  const handleIdChange = (event) => setSelectedId(event.target.value);

  const handleId = async () => {
    try {
      console.log(selectedId);
      let response = await axios.get(`http://localhost:8000/api/order/by-invoice/?userId=${userGlobal.user_id}&orderId=${selectedId}`);
      if (response.data.data.length === 0) {
        alert("Order not found");
      } else {
        dispatch(setOrderItems(response.data.data));
        console.log(response.data.data[0].order_status);
        setSelectedStatus(response.data.data[0].order_status);
      }
    } catch (error) {
      alert(error.response.data);
    }
  };

  // status filter
  const [selectedStatus, setSelectedStatus] = useState("All");
  const statuses = ["All", "Waiting for payment", "Waiting for confirmation", "Processed", "Out for delivery", "Delivered", "Canceled"];

  const handleStatus = async (status) => {
    try {
      setSelectedStatus(status);

      if (status === "All") {
        let response = await axios.get(`http://localhost:8000/api/order/?userId=${userGlobal.user_id}`);
        if (response) {
          console.log(response.data.orders);
          console.log(response.data.max);
          dispatch(setOrderItems(response.data.orders));
          setTotalPages(response.data.maxPages);
        }
      } else {
        let response = await axios.get(`http://localhost:8000/api/order/by-status/?userId=${userGlobal.user_id}&orderStatus=${status}`);
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

  // date filter
  const [startValue, setStartValue] = useState("");
  const [endValue, setEndValue] = useState("");
  const [minEndDate, setMinEndDate] = useState("");

  const handleStartChange = (e) => {
    const selectedStartDate = e.target.value;
    setStartValue(selectedStartDate);
    setMinEndDate(selectedStartDate); // Set the minimum end date as the selected start date
    if (endValue < selectedStartDate) {
      setEndValue(selectedStartDate); // Reset the end date if it's earlier than the new start date
    }
  };

  const handleEndChange = (e) => {
    const selectedEndDate = e.target.value;
    if (selectedEndDate >= startValue) {
      setEndValue(selectedEndDate);
    }
  };

  const formatDate = (dateString) => {
    const dateObj = new Date(dateString);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, "0");
    const day = String(dateObj.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }; //format date for sql

  const handleDate = async () => {
    try {
      const startDate = formatDate(startValue);
      const endDate = formatDate(endValue);

      const response = await axios.get(`http://localhost:8000/api/order/by-date/?userId=${userGlobal.user_id}&page=${currentPage}&startDate="${startDate}"&endDate="${endDate}"`);

      console.log(response.data);
      if (response.data.orders.length == 0) {
        alert("Orders not found");
      }
      dispatch(setOrderItems(response.data.orders));
      setTotalPages(response.data.maxPages);
      setSelectedStatus("All");
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    console.log(currentPage);
    const renderPaginate = async () => {
      try {
        if (selectedStatus === "All") {
          let response = await axios.get(`http://localhost:8000/api/order/?userId=${userGlobal.user_id}&page=${currentPage}`);
          if (response) {
            console.log(response.data.orders);

            dispatch(setOrderItems(response.data.orders));
            setTotalPages(response.data.maxPages);
          }
        } else {
          let response = await axios.get(`http://localhost:8000/api/order/by-status/?userId=${userGlobal.user_id}&orderStatus=${selectedStatus}&page=${currentPage}`);
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

  useEffect(() => {
    setCurrentPage(1);
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
      {/* <Input placeholder="Select Date and Time" size="md" type="datetime-local" value={date} onChange={handleChange} /> */}

      {userGlobal.user_id > 0 ? (
        <>
          <div className="grid grid-cols-5 m-10 gap-5">
            <div className="flex flex-col gap-5">
              <h1 className="text-3xl pt-5 font-semibold tracking-tight text-gray-900">Orders</h1>
              <div className="flex flex-col gap-3">
                {/* status starts */}
                {statuses.map((x) => (
                  <div
                    className={`flex border px-4 py-2 rounded-md items-center cursor-pointer hover:translate-x-1 duration-100
                    ${selectedStatus === x ? "font-semibold border-green-500 text-green-500" : ""}`}
                    onClick={() => {
                      handleStatus(x);
                    }}
                  >
                    <p className="">{x}</p>
                  </div>
                ))}
                {/* status ends */}
                {/* Filter starts */}
                <Divider />
                <Text className="font-semibold text-green-600">Sort and Filter</Text>
                <div className="flex flex-col gap-3">
                  <div>
                    <Select placeholder="Sort by" size="sm" value={sortBy} onChange={handleSortChange}>
                      <option value="desc">Latest to oldest</option>
                      <option value="asc">Oldest to latest</option>
                    </Select>
                  </div>
                  <div className="grid grid-cols-3 gap-1">
                    <Input className="col-span-2" type="number" value={selectedId} onChange={handleIdChange} placeholder="Find order by id" size="sm" />
                    <Button className="col-span-1" size="sm" onClick={handleId}>
                      Find
                    </Button>
                  </div>

                  <div className="flex flex-col gap-2">
                    <div className="grid grid-cols-4">
                      <Text>Start</Text>
                      <Input className="col-span-3" placeholder="Select Date and Time" size="sm" type="datetime-local" value={startValue} onChange={handleStartChange} />
                    </div>
                    <div className="grid grid-cols-4">
                      <Text>End</Text>
                      <Input
                        className="col-span-3"
                        placeholder="Select Date and Time"
                        size="sm"
                        type="datetime-local"
                        value={endValue}
                        onChange={handleEndChange}
                        min={minEndDate} // Set the minimum allowed value for the end date
                      />
                    </div>
                    <Button size="sm" onClick={handleDate}>
                      Find order by date
                    </Button>
                  </div>
                </div>
                {/* Filter ends */}
              </div>
            </div>

            {orderItems.length === 0 ? (
              <div className="col-span-4 pt-7">No orders found</div>
            ) : (
              <>
                <div className="col-span-4">
                  {/* Pagination starts */}

                  <div className="flex gap-3 mb-2">
                    <Button size="xs" onClick={handlePaginatePrev}>
                      Prev
                    </Button>
                    <span>
                      {currentPage} out of {totalPages}
                    </span>
                    <Button size="xs" onClick={handlePaginateNext}>
                      Next
                    </Button>
                  </div>

                  {/* Pagination ends */}
                  <div className="flex flex-col gap-6">{renderOrderItems()}</div>
                </div>
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
