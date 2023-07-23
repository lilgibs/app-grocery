import React, { useEffect, useState } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Divider,
  Radio,
  RadioGroup,
  Stack,
  Text,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";
import moment from "moment";
import Select from "react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter } from "react-icons/fa";
import { fetchSalesReportByStoreId } from "../api/salesReportApi";
import { fetchBranchStores } from "../api/adminDashboardApi";
import { useCustomToast } from "../hooks/useCustomToast";

function AdminSalesReport() {
  const navigate = useNavigate();
  const { showErrorToast } = useCustomToast();
  const adminToken = localStorage.getItem("admin_token");
  const adminData = useSelector((state) => state.admin.admin);
  const [branchStores, setBranchStores] = useState([]);
  const [salesReports, setSalesReports] = useState([]);
  const [sortType, setSortType] = useState(null); // 'date' or 'price'
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [TotalSalesReports, setTotalSalesReports] = useState(null);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [selectedBranchStore, setSelectedBranchStore] = useState(null);

  const sortOptions = [
    { value: "date_desc", label: "Newest" },
    { value: "date_asc", label: "Oldest" },
    { value: "price_asc", label: "Lowest price" },
    { value: "price_desc", label: "Highest price" },
  ];

  const totalPages = Math.ceil(TotalSalesReports / limit);

  const handleSetDate = (event) => {
    event.preventDefault();
    if (endDate < startDate) {
      showErrorToast("End date can't be lower than start date");
      return;
    }
    searchParams.set("start_date", startDate);
    searchParams.set("end_date", endDate);
    setSearchParams(new URLSearchParams(searchParams.toString()));
  };

  const handleSortChange = (selectedOption) => {
    if (selectedOption) {
      const [sortType, sortOrder] = selectedOption.split("_");
      setSortType(sortType);
      setSortOrder(sortOrder);
      searchParams.set("sort_type", sortType);
      searchParams.set("sort_order", sortOrder);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    } else {
      setSortType(null);
      setSortOrder(null);
      searchParams.delete("sort_type");
      searchParams.delete("sort_order");
      setSearchParams(new URLSearchParams(searchParams.toString()));
    }
  };

  const handleFilterSubmit = (event) => {
    handleSetDate(event);
  };

  const handlePageClick = (data) => {
    let selected = data.selected + 1; // react-paginate mulai dari 0
    searchParams.set("page", selected);
    setSearchParams(new URLSearchParams(searchParams.toString()));
  };

  useEffect(() => {
    const getSalesReports = async () => {
      const startDateParam = searchParams.get("start_date");
      const endDateParam = searchParams.get("end_date");
      const sortTypeParam = searchParams.get("sort_type");
      const sortOrderParam = searchParams.get("sort_order");
      const pageParam = Number(searchParams.get("page"));
      let result;
      setPage(pageParam || 1);
      if (selectedBranchStore) {
        result = await fetchSalesReportByStoreId(
          adminToken,
          selectedBranchStore,
          startDateParam,
          endDateParam,
          pageParam,
          limit,
          sortTypeParam,
          sortOrderParam
        );
      } else {
        result = await fetchSalesReportByStoreId(
          adminToken,
          adminData.store_id,
          startDateParam,
          endDateParam,
          pageParam,
          limit,
          sortTypeParam,
          sortOrderParam
        );
      }
      setSalesReports(result.data);
      setTotalSalesReports(result.total);
    };
    getSalesReports();
  }, [searchParams, adminToken, adminData, selectedBranchStore]);

  useEffect(() => {
    if (adminData.role == 99) {
      const getBranchStores = async () => {
        const response = await fetchBranchStores();
        setBranchStores(response.options);
      };
      getBranchStores();
    }
  }, [adminData, selectedBranchStore]);

  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-5">
      <h1
        className="text-4xl pt-5 font-semibold tracking-tight text-pink-500 cursor-pointer"
        onClick={() => navigate("/admin/sales-report")}
      >
        Sales Report
      </h1>
      {/* Content - START */}
      <div className="flex flex-col gap-5">
        {/* Content Header - START */}
        <div className="flex lg:justify-end">
          {/* Filter - START */}
          <div className="lg:hidden">
            <div
              onClick={() => setFilterVisible(true)}
              className=" hover:bg-green-500 text-green-500 hover:text-white border-2 border-green-500 px-4 py-1 rounded-full flex items-center gap-1 cursor-pointer duration-150"
            >
              <FaFilter size={15} />
              <p className="font-semibold">Filter</p>
            </div>
            <Drawer
              isOpen={isFilterVisible}
              placement="bottom"
              onClose={() => setFilterVisible(false)}
            >
              <DrawerOverlay />
              <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader className="bg-green-500 text-white">
                  Filter
                </DrawerHeader>
                <DrawerBody>
                  <RadioGroup
                    onChange={handleSortChange}
                    value={
                      sortType && sortOrder ? `${sortType}_${sortOrder}` : ""
                    }
                  >
                    <Text className="font-semibold text-lg">Sort by</Text>
                    <Divider mb={"2"} />
                    <Stack direction="column">
                      <Radio value="" colorScheme="green">
                        Default
                      </Radio>
                      <Radio value="date_desc" colorScheme="green">
                        Newest
                      </Radio>
                      <Radio value="date_asc" colorScheme="green">
                        Oldest
                      </Radio>
                      <Radio value="price_desc" colorScheme="green">
                        Highest Price
                      </Radio>
                      <Radio value="price_asc" colorScheme="green">
                        Lowest Price
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <form onSubmit={handleFilterSubmit}>
                    <Box>
                      <Text className="font-semibold text-lg mt-5">Date</Text>
                      <Divider mb={"2"} />
                      <div className="flex">
                        <div className="flex items-center gap-1 border p-1">
                          <label htmlFor="start-date">Start Date:</label>
                          <input
                            className="border rounded p-1"
                            type="date"
                            id="start-date"
                            name="start-date"
                            value={startDate}
                            onChange={(e) => setStartDate(e.target.value)}
                          />

                          <label htmlFor="end-date">End Date:</label>
                          <input
                            className="border rounded p-1"
                            type="date"
                            id="end-date"
                            name="end-date"
                            value={endDate}
                            onChange={(e) => setEndDate(e.target.value)}
                          />
                        </div>
                      </div>
                    </Box>
                    <button className="mt-5 border rounded py-2 px-3 bg-pink-500 hover:bg-pink-600 font-semibold text-white">
                      Filter
                    </button>
                  </form>
                </DrawerBody>
                <DrawerFooter></DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          {/* Filter - END */}
          <div className="hidden lg:flex gap-3 items-center">
            {adminData.role == 99 && (
              <form>
                <Select
                  placeholder="Select branch store"
                  options={branchStores}
                  isClearable="true"
                  onChange={(selectedOption) => {
                    setSelectedBranchStore(
                      selectedOption ? selectedOption.value : ""
                    );
                  }}
                />
              </form>
            )}

            <form className="flex" onSubmit={handleSetDate}>
              <div className="flex items-center gap-1 border rounded-s p-1">
                <label htmlFor="start-date">Start Date:</label>
                <input
                  className="border rounded p-1"
                  type="date"
                  id="start-date"
                  name="start-date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                />

                <label htmlFor="end-date">End Date:</label>
                <input
                  className="border rounded p-1"
                  type="date"
                  id="end-date"
                  name="end-date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                />
              </div>
              <button
                className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 px-4 rounded-e-md"
                type="submit"
              >
                <FaFilter size={15} />
              </button>
            </form>
            <Select
              className=""
              id="product_sort_id"
              name="product_sort_id"
              placeholder="Sort by"
              options={sortOptions}
              isClearable="true"
              onChange={(selectedOption) =>
                handleSortChange(selectedOption ? selectedOption.value : "")
              }
            />
          </div>
        </div>
        {/* Content Header - END */}
        {/* Content Body - START */}
        <TableContainer variant="striped" colorScheme="blue">
          <Table variant="striped" colorScheme="blue">
            <Thead>
              <Tr>
                <Th>Order ID</Th>
                <Th>User Name</Th>
                <Th>Total Price</Th>
                <Th>Order Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {salesReports.map((salesReport) => (
                <Tr>
                  <Td>{salesReport.order_id}</Td>
                  <Td>{salesReport.name}</Td>
                  <Td>{salesReport.total_price}</Td>
                  <Td w="1px">
                    {moment(salesReport.order_date).format("MMMM DD YYYY")}
                  </Td>
                  <Td
                    w="1px"
                    className="text-xs cursor-pointer text-blue-700 underline"
                    onClick={() => {
                      navigate(`/admin/sales-report/${salesReport.order_id}`);
                    }}
                  >
                    Show Details
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {/* Content Body - END */}
        <div>
          <div>
            {TotalSalesReports > limit && (
              <ReactPaginate
                previousLabel={<IoIosArrowBack />}
                nextLabel={<IoIosArrowForward />}
                breakLabel={"..."}
                breakClassName={"break-me"}
                pageCount={totalPages}
                marginPagesDisplayed={2}
                pageRangeDisplayed={5}
                onPageChange={handlePageClick}
                containerClassName={
                  "pagination flex justify-center gap-4 items-center"
                }
                pageLinkClassName={"px-1"}
                previousLinkClassName={"previous-link"}
                previousClassName="pt-1"
                nextClassName="pt-1"
                nextLinkClassName={"next-link"}
                disabledClassName={"disabled"}
                activeClassName={
                  "active font-semibold border-b-2 border-w text-green-500 border-b-green-500"
                }
                forcePage={page - 1} // react-paginate mulai dari 0
              />
            )}
          </div>
        </div>
      </div>
      {/* Content - END */}
    </div>
  );
}

export default AdminSalesReport;
