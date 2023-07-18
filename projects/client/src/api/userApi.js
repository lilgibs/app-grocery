import axios from "axios";

export async function fetchProducts(
  storeId,
  search,
  category,
  page,
  limit,
  sortType,
  sortOrder
) {
  const params = {
    page: page,
    limit: limit,
  };

  if (storeId) {
    params.storeId = storeId;
  }

  if (search) {
    params.search = search;
  }

  if (category) {
    params.productCategory = category;
  }

  if (sortType && sortOrder) {
    params.sortType = sortType;
    params.sortOrder = sortOrder;
  }

  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/products`, {
      params,
    });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}
