import axios from 'axios';

export async function fetchCategories() {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/products/categories/');
    const categories = response.data.data;
    
    const options = categories.map((category) => ({
      value: category.product_category_id,
      label: category.product_category_name,
    }));
    return options;
  } catch (error) {
    console.error(error);
    return [];
  }
};
