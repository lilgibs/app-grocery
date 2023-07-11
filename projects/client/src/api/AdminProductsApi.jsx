import axios from "axios";

export const fetchProductsInventory = async (adminToken, page, limit, searchText, selectedCategory, sortType, sortOrder) => {
  const params = {
    page,
    limit,
    search: searchText,
    category: selectedCategory ? selectedCategory.value : ''
  };

  if (sortType && sortOrder) {
    params.sortType = sortType;
    params.sortOrder = sortOrder;
  }

  try {
    const response = await axios.get(`http://localhost:8000/api/admin/products/inventory`,
      {
        params,
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );

    return response.data;
  } catch (error) {
    console.error(error);
  }
};