import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import { FaBox, FaBoxOpen, FaHome, FaShoppingBasket, FaStore } from "react-icons/fa";
import { IoPersonCircle } from "react-icons/io5";
import { AiFillDollarCircle } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { formatRupiah } from "../utils/formatRupiah";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { fetchBranchStores, fetchMonthlySales, fetchProducts, fetchProductsSold, fetchUsers, fetchWeeklySales } from "../api/adminDashboardApi";
import { useNavigate } from "react-router-dom";
import Select from "react-select";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const AdminDashboard = () => {
  const [branchStores, setBranchStores] = useState([]);
  const [users, setUsers] = useState(null);
  const [totalStores, setTotalStores] = useState(null);
  const [totalProducts, setTotalProducts] = useState(null);
  const [totalProductsSold, setTotalProductsSold] = useState(null);
  const [revenue, setRevenue] = useState(null);
  const [selectedBranchStore, setSelectedBranchStore] = useState(null);
  const [dailySalesData, setDailySalesData] = useState([]);
  const [monthlySalesData, setMonthlySalesData] = useState([]);
  const [haveData, setHaveData] = useState(false); //here
  const [isClearable, setIsClearable] = useState(true);

  const nav = useNavigate();

  const adminToken = localStorage.getItem("admin_token");
  const adminGlobal = useSelector((state) => state.admin.admin);
  
  const AdminDashboardCard = ({ icon, title, titleDesc, value, bgColor }) => {
    return (
      <div className="h-16 xl:h-24  rounded-md flex flex-row items-center px-3 lg:px-5 gap-2 lg:gap-3 shadow-md text-neutral-500 border">
        <div className=" text-3xl xl:text-6xl">{icon}</div>
        <div className="flex flex-col">
          <p className="text-neutral-400 text-xs xl:text-base font-semibold ">
            {title} <span className="text-xs text-pink-500">{titleDesc}</span>
          </p>
          <p className="font-bold xl:text-2xl">{value}</p>
        </div>
      </div>
    );
  };

  const data = {
    dailySalesData: dailySalesData,
    monthlySalesData: monthlySalesData,
  };

  const options = {
    responsive: true,
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  // useEffect(() => {
  //   if (adminGlobal.id < 0) nav("/");
  // }, [adminGlobal]);

  useEffect(() => {
    const getWeeklySales = async () => {
      const { weekDays, totalSalesData } = await fetchWeeklySales(selectedBranchStore);
      setDailySalesData({
        labels: weekDays,
        datasets: [
          {
            data: totalSalesData,
            label: "Daily Sales",
            borderColor: "#e91e63",
            fill: false,
          },
        ],
      });
    };

    const getMonthlySales = async () => {
      const { monthNames, totalSalesData, revenueThisMonth } = await fetchMonthlySales(selectedBranchStore);
      setMonthlySalesData({
        labels: monthNames,
        datasets: [
          {
            data: totalSalesData,
            label: "Monthly Sales",
            borderColor: "#e91e63",
            fill: false,
          },
        ],
      });

      setRevenue(revenueThisMonth);
    };

    const getBranchStores = async () => {
      const response = await fetchBranchStores(adminToken);
      setBranchStores(response.options);
      setTotalStores(response.totalStores);
    };

    const getUsers = async () => {
      const response = await fetchUsers(adminToken);
      setUsers(response);
    };

    const getProducts = async () => {
      const response = await fetchProducts(adminToken);
      setTotalProducts(response);
    };

    const getProductsSold = async () => {
      const response = await fetchProductsSold(selectedBranchStore, adminToken);
      setTotalProductsSold(response);
    };

    if (adminGlobal.role == 99) {
      getBranchStores();
    }

    getUsers()
    getProducts();
    getWeeklySales();
    getMonthlySales();
    getProductsSold();
  }, [selectedBranchStore]);

  return (
    <div className="w-[95%] xl:max-w-screen-2xl mx-auto text-neutral-500">
      {/* <div className="h-20 w-20 fixed bg-pink-50"></div> */}
      <div className="flex flex-row w-full">
        {/* Content */}
        <div className="mt-5 rounded-md w-full flex flex-col gap-5">
          <div className="flex flex-row justify-between items-center w-full p-3 lg:p-5 border rounded-md shadow-md">
            <div>
              <p className="font-bold lg:text-xl">
                Hello, <span className="text-pink-500">{adminGlobal.name}</span>
              </p>
            </div>
            {adminGlobal.role == 99 && (
              <div>
                <Select
                  className="w-full"
                  id="product_sort_id"
                  name="product_sort_id"
                  placeholder="Select branch store"
                  options={branchStores}
                  isClearable={isClearable}
                  onChange={(selectedOption) => {
                    setSelectedBranchStore(selectedOption ? selectedOption.value : "");
                  }}
                />
              </div>
            )}
          </div>

          <div className="w-full grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
            {adminGlobal.role == 99 ? (
              <AdminDashboardCard icon={<FaStore className="text-red-500" />} title="Branch Stores" value={totalStores} />
            ) : (
              <AdminDashboardCard icon={<IoPersonCircle className="text-cyan-500" />} title="Users" value={users} />
            )}
            <AdminDashboardCard icon={<FaShoppingBasket className="text-zinc-500" />} title="Products" value={totalProducts} />
            <AdminDashboardCard icon={<AiFillDollarCircle className="text-green-500" />} title="Revenue" titleDesc="Monthly" value={formatRupiah(revenue)} />
            <AdminDashboardCard icon={<FaBoxOpen className="text-yellow-600" />} title="Products sold" titleDesc="Monthly" value={totalProductsSold} />
          </div>

          {/* Chart */}
          <div className="w-full flex flex-col lg:flex-row gap-5">
            <div className="w-full border shadow-md rounded-md flex justify-center px-2 max-h-80">{dailySalesData.labels ? <Line data={data.dailySalesData} options={options} /> : <div>Loading...</div>}</div>
            <div className="w-full border shadow-md rounded-md flex justify-center px-2 max-h-80">{monthlySalesData.labels ? <Line data={data.monthlySalesData} options={options} /> : <div>Loading...</div>}</div>
          </div>
        </div>
        {/* Content */}
      </div>
    </div>
  );
};

export default AdminDashboard;
