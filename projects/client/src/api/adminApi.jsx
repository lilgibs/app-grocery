import axios from 'axios';

export async function fetchCategories() {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/products/categories/');
    const categories = response.data.data;
    console.log(categories)
    
    const options = categories.map((category) => ({
      value: category.product_category_id,
      label: category.product_category_name,
      image: category.product_category_image
    }));
    return options;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export async function fetchProduct() {
  try {
    const response = await axios.get('http://localhost:8000/api/admin/products/'); // Ganti dengan endpoint yang sesuai untuk mengambil data produk dari database
    console.log(response)

    const products = response.data.products;

    const options = products.map((product) => ({
      value: product.product_id,
      label: product.product_name,
    }));
    setProductOptions(options);
    // setProductOptions(products.map(({ product_id, product_name }) => ({ value: product_id, label: product_name })));
  } catch (error) {
    console.error(error);
  }
};
