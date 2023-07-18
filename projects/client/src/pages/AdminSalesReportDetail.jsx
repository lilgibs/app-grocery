import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { IoIosArrowBack } from "react-icons/io";
import { fetchSalesReportDetail } from "../api/salesReportApi";

function AdminSalesReportDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("admin_token");
  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    if (orderId) {
      const fetchOrderDetail = async () => {
        const result = await fetchSalesReportDetail(orderId, adminToken);
        setOrderDetail(result);
      };
      fetchOrderDetail();
    }
  }, [orderId]);

  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-10">
      <h1 className="text-4xl pt-5 font-semibold tracking-tight text-pink-500 cursor-pointer">
        Order {orderId} Details
      </h1>
      <div>
        <div
          className="flex items-center gap-2 bg-pink-500 text-white w-fit rounded px-3 py-1 cursor-pointer"
          onClick={() => {
            navigate("/admin/sales-report");
          }}
        >
          <IoIosArrowBack />
          <p className="text-lg font-semibold">Back</p>
        </div>
        <TableContainer variant="striped" colorScheme="blue">
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Product Name</Th>
                <Th>User Name</Th>
                <Th>Price</Th>
                <Th>Quantity</Th>
              </Tr>
            </Thead>
            <Tbody>
              {orderDetail.map((detail) => (
                <Tr>
                  <Td>{detail.product_name}</Td>
                  <Td>{detail.name}</Td>
                  <Td>{detail.product_price}</Td>
                  <Td>{detail.quantity}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </div>
  );
}

export default AdminSalesReportDetail;
