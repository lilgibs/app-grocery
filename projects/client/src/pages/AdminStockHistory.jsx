import React, { useEffect, useState, useRef } from "react";
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import moment from "moment";
import {
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
import Select from "react-select";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { FaFilter, FaSearch } from "react-icons/fa";
import { fetchStockHistory } from "../api/stockHistoryApi";

function AdminStockHistory() {
  const navigate = useNavigate();
  const adminToken = localStorage.getItem("admin_token");
  const adminData = useSelector((state) => state.admin.admin);
  const [stockHistories, setStockHistories] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [sortOrder, setSortOrder] = useState(null); // 'asc' or 'desc'
  const [isClearable, setIsClearable] = useState(true);
  const [searchParams, setSearchParams] = useSearchParams();
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [TotalStockHistories, setTotalStockHistories] = useState(null);
  const [isFilterVisible, setFilterVisible] = useState(false);
  const [searchText, setSearchText] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const endDateRef = useRef(null);

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    endDateRef.current.focus();
  };

  const sortOptions = [
    { value: "desc", label: "Newest" },
    { value: "asc", label: "Oldest" },
  ];

  const totalPages = Math.ceil(TotalStockHistories / limit);

  const handleSortChange = (selectedOption) => {
    console.log(selectedOption);
    if (selectedOption) {
      const sortOrder = selectedOption;
      setSortOrder(sortOrder);
      searchParams.set("sort_order", sortOrder);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    } else {
      setSortOrder(null);
      searchParams.delete("sort_order");
      setSearchParams(new URLSearchParams(searchParams.toString()));
    }
  };

  const handleSetCategory = (category) => {
    if (category) {
      setSelectedCategory(category);
      searchParams.set("product", category);
      setSearchParams(new URLSearchParams(searchParams.toString()));
    } else {
      setSelectedCategory(null);
      searchParams.delete("product");
      setSearchParams(new URLSearchParams(searchParams.toString()));
    }
  };

  const handleSetCategory1 = (event) => {
    event.preventDefault();
    searchParams.set("product", searchText);
    setSearchParams(new URLSearchParams(searchParams.toString()));
  };

  const handlePageClick = (data) => {
    let selected = data.selected + 1; // react-paginate mulai dari 0
    searchParams.set("page", selected);
    setSearchParams(new URLSearchParams(searchParams.toString()));
  };

  useEffect(() => {
    const getStockHistory = async () => {
      const productParam = searchParams.get("product");
      const startDateParam = searchParams.get("start_date");
      const endDateParam = searchParams.get("end_date");
      const sortOrderParam = searchParams.get("sort_order");
      const pageParam = Number(searchParams.get("page"));
      setPage(pageParam || 1);
      const result = await fetchStockHistory(
        adminToken,
        adminData.store_id,
        productParam,
        startDateParam,
        endDateParam,
        pageParam,
        limit,
        sortOrderParam
      );
      console.log(result);
      setStockHistories(result.data);
      setTotalStockHistories(result.total);
    };
    getStockHistory();
  }, [searchParams, adminToken, adminData]);
  return (
    <div className="flex flex-col md:w-[95%] xl:max-w-screen-xl mx-auto gap-5">
      <h1 className="text-4xl pt-5 font-semibold tracking-tight text-pink-500 ">
        Stock History
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
                    value={sortOrder ? sortOrder : ""}
                  >
                    <Text className="font-semibold text-lg">Sort by</Text>
                    <Divider mb={"2"} />
                    <Stack direction="column">
                      <Radio value="" colorScheme="green">
                        Default
                      </Radio>
                      <Radio value="desc" colorScheme="green">
                        Newest
                      </Radio>
                      <Radio value="asc" colorScheme="green">
                        Oldest
                      </Radio>
                    </Stack>
                  </RadioGroup>
                  <Box>
                    <Text className="font-semibold text-lg mt-5">Category</Text>
                    <Divider mb={"2"} />
                    <div className="flex flex-col gap-2 overflow-y-auto h-[300px] pr-2">
                      {categories.map((category) => (
                        <div
                          className={`flex border px-4 py-1 rounded-md gap-5 items-center cursor-pointer hover:translate-x-1 duration-100 ${
                            selectedCategory === category.label.toLowerCase()
                              ? "font-semibold border-green-500 text-green-500"
                              : ""
                          }`}
                          onClick={() =>
                            handleSetCategory(category.label.toLowerCase())
                          }
                        >
                          <img
                            className="h-5"
                            src={`http://localhost:8000/${category.image}`}
                            alt=""
                          />
                          <p className="">{category.label}</p>
                        </div>
                      ))}
                    </div>
                  </Box>
                </DrawerBody>
                <DrawerFooter></DrawerFooter>
              </DrawerContent>
            </Drawer>
          </div>
          {/* Filter - END */}
          <div className="hidden lg:flex  gap-2 items-center">
            <form onSubmit={handleSetCategory1}>
              <div className="flex">
                <div className="flex flex-col">
                  <label htmlFor="start-date">Start Date:</label>
                  <input
                    type="date"
                    id="start-date"
                    name="start-date"
                    value={startDate}
                    onChange={handleStartDateChange}
                  />

                  <label htmlFor="end-date">End Date:</label>
                  <input
                    type="date"
                    id="end-date"
                    name="end-date"
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    ref={endDateRef}
                  />
                </div>
                <input
                  className="border-l border-b border-t rounded-s-md px-4 focus:border-pink-500 focus:outline-none"
                  type="text"
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  placeholder="Search by product name..."
                />
                <button
                  className="bg-pink-500 hover:bg-pink-600 font-semibold text-white py-3 px-4 rounded-e-md"
                  type="submit"
                >
                  <FaSearch size={15} />
                </button>
              </div>
            </form>
            <Select
              className="w-full"
              id="product_sort_id"
              name="product_sort_id"
              placeholder="Sort by"
              options={sortOptions}
              isClearable={isClearable}
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
                <Th>Product Name</Th>
                <Th>Quantity</Th>
                <Th>Type</Th>
                <Th>Date</Th>
              </Tr>
            </Thead>
            <Tbody>
              {stockHistories.map((stockHistory) => (
                <Tr>
                  <Td>{stockHistory.product_name}</Td>
                  <Td>{stockHistory.quantity_change}</Td>
                  <Td>{stockHistory.change_type}</Td>
                  <Td>
                    {moment(stockHistory.change_date).format("MMMM DD YYYY")}
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
        {/* Content Body - END */}
        <div>
          <div>
            {TotalStockHistories > limit && (
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

export default AdminStockHistory;
