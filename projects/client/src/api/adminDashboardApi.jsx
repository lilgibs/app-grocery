import axios from "axios";
import moment from 'moment';

export async function fetchBranchStores() {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/dashboard/stores')
    const options = response.data.data.map((store) => ({
      value: store.store_id,
      label: store.store_name,
    }));
    const totalStores = response.data.total

    return { options, totalStores };
  } catch (error) {
    console.log(error)
  }
}

export async function fetchProducts(storeId) {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/dashboard/products')
    return response.data.data.length
  } catch (error) {
    console.log(error)
  }
}

export async function fetchWeeklySales(storeId) {
  const adminToken = localStorage.getItem("admin_token");

  // Dapatkan tanggal awal dan akhir pekan ini
  const startOfWeek = moment().startOf('week').format('YYYY-MM-DD');
  const endOfWeek = moment().endOf('week').format('YYYY-MM-DD');

  try {
    // Kirim request ke API dengan startOfWeek dan endOfWeek sebagai bagian dari body request
    const response = await axios.get(`http://localhost:8000/api/admin/dashboard/daily-sales`, {
      params: {
        startOfWeek,
        endOfWeek,
        storeId
      },
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    // Dapatkan array tanggal dalam seminggu
    const weekDays = Array(7).fill().map((_, i) => moment().startOf('week').add(i, 'days').format('DD-MM-YYYY'));

    // Dapatkan total penjualan per hari
    const salesData = weekDays.map(day => {
      const salesOnThisDay = response.data.data.filter(sale => moment(sale.order_date).format('DD-MM-YYYY') === day);
      const totalSalesOnThisDay = salesOnThisDay.reduce((total, sale) => total + Number(sale.total_price), 0);
      return totalSalesOnThisDay;
    });

    const totalSalesData = salesData;

    return { weekDays, totalSalesData }
  } catch (error) {
    console.log(error)
    return {}
  }
};

export async function fetchMonthlySales(storeId) {
  const adminToken = localStorage.getItem("admin_token");
  const year = moment().year();
  const monthNames = moment.months()
  const currentMonth = moment().month()

  try {
    const salesData = [];

    for (let i = 0; i < 12; i++) {
      const startOfMonth = moment().year(year).month(i).startOf('month').format('YYYY-MM-DD');
      const endOfMonth = moment().year(year).month(i).endOf('month').format('YYYY-MM-DD');

      const response = await axios.get(`http://localhost:8000/api/admin/dashboard/monthly-sales`, {
        params: {
          startOfMonth,
          endOfMonth,
          storeId
        },
        headers: {
          Authorization: `Bearer ${adminToken}`
        }
      });

      salesData.push(response.data.data);
    }

    const totalSalesData = salesData.map(data => data.reduce((total, sale) => total + Number(sale.total_price), 0));
    const revenueThisMonth = totalSalesData[currentMonth]

    return { monthNames, totalSalesData, revenueThisMonth }
  } catch (error) {
    console.log(error)
  }
}

export async function fetchProductsSold(storeId) {
  const adminToken = localStorage.getItem("admin_token");
  const startOfMonth = moment().startOf('month').format('YYYY-MM-DD');
  const endOfMonth = moment().endOf('month').format('YYYY-MM-DD');

  try {
    const response = await axios.get(`http://localhost:8000/api/admin/dashboard/products-sold`, {
      params: {
        startOfMonth,
        endOfMonth,
        storeId
      },
      headers: {
        Authorization: `Bearer ${adminToken}`
      }
    });

    return  response.data.data
  } catch (error) {
    console.log(error)
  }
}
