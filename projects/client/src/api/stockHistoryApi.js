import axios from "axios";

export async function fetchStockHistory(
  token,
  storeId,
  product,
  startDate,
  endDate,
  page,
  limit,
  sortOrder
) {
  const params = {
    page: page,
    limit: limit,
  };

  if (product) {
    params.product = product;
  }

  if (startDate && endDate) {
    params.startDate = startDate;
    params.endDate = endDate;
  }

  if (sortOrder) {
    params.sortOrder = sortOrder;
  }

  try {
    const response = await axios.get(
      `${process.env.REACT_APP_API_BASE_URL}/admin/stock-histories/${storeId}`,
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
