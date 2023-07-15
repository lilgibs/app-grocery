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
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/products/inventory`,
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

export const fetchProducts = async (adminToken) => {
  try {
    const response = await axios.get(`${process.env.REACT_APP_API_BASE_URL}/admin/products`,
      {
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      }
    );
    const products = response.data.products;
    const options = products.map((product) => ({
      value: product.product_id,
      label: product.product_name,
    }));
    return options
    // setProductOptions(products.map(({ product_id, product_name }) => ({ value: product_id, label: product_name })));
  } catch (error) {
    console.error(error);
  }
};