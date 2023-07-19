import axios from "axios";

export async function fetchSalesReportByStoreId(
  token,
  storeId,
  startDate,
  endDate,
  page,
  limit,
  sortType,
  sortOrder
) {
  const params = {
    page: page,
    limit: limit,
  };

  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  if (sortType && sortOrder) {
    params.sortOrder = sortOrder;
    params.sortType = sortType;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/admin/sales-reports/${storeId}`,
      {
        params: params,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function fetchSalesReportDetail(orderId, token) {
  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/admin/sales-reports/details/${orderId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data.data;
  } catch (error) {
    console.error(error);
  }
}
