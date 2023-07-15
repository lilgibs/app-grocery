const { db, query } = require("../config/db");

const countProducts = async (adminStoreId, searchText = '', productCategoryId) => {
  let productCountQuery = `SELECT COUNT(*) as total
    FROM products p
    JOIN store_inventory si ON p.product_id = si.product_id
    WHERE (si.is_deleted = 0 OR si.is_deleted IS NULL) AND si.store_id = ${db.escape(adminStoreId)}`;

  if (searchText !== '') productCountQuery += ` AND p.product_name LIKE ${db.escape('%' + searchText + '%')}`;
  if (productCategoryId) productCountQuery += ` AND p.product_category_id = ${db.escape(productCategoryId)}`;
  return await query(productCountQuery);
};

const getProductById = async (product_id) => {
  const sqlProductQuery = `SELECT * FROM products WHERE product_id = ${db.escape(product_id)}`;
  return await query(sqlProductQuery);
}

const getStoreInventory = async (product_id, store_id) => {
  const sqlStoreInventory = `SELECT * FROM store_inventory WHERE product_id = ${db.escape(product_id)} AND store_id = ${db.escape(store_id)}`;
  return await query(sqlStoreInventory);
}

const handleProductExistence = async (store_id, product_name) => {
  // Memeriksa apakah product_name sudah tersedia di db
  const checkProductQuery = `SELECT * FROM products 
    WHERE 
      product_name = ${db.escape(product_name)}`
  const existingProduct = await query(checkProductQuery);

  // Jika product sudah ada, check apakah produk yang diinput sudah ada di inventory
  if (existingProduct.length > 0) {
    const checkStoreInventory = `SELECT * FROM store_inventory 
      WHERE 
        store_id = ${db.escape(store_id)} AND 
        product_id = ${db.escape(existingProduct[0].product_id)}`
    const existingStoreInventory = await query(checkStoreInventory);

    // Jika store_id dan product_id sudah ada, lemparkan error
    if (existingStoreInventory.length > 0) {
      throw {
        status_code: 409,
        message: "Failed to add product. Store already has the chosen product.",
      }
    }
    return existingProduct[0].product_id;
  }
  return null
}

const insertNewProduct = async (product_category_id, product_name, product_description, product_price, product_weight) => {
  const sqlQueryProduct = `INSERT INTO products (
    product_category_id,
    product_name, 
    product_description,
    product_price,
    product_weight
  ) 
  VALUES (
    ${db.escape(product_category_id)},
    ${db.escape(product_name)},
    ${db.escape(product_description)},
    ${db.escape(product_price)},
    ${db.escape(product_weight)}
  )`;
  const resultProduct = await query(sqlQueryProduct)
  return resultProduct.insertId
}

const insertImages = async (productId, product_images) => {
  // 3. Menginput gambar ke DB
  for (let product_image of product_images) {
    const sqlQueryProductImage = `INSERT INTO product_images(product_id, image_url)
    VALUES(
      ${db.escape(productId)},
      ${db.escape(product_image)}
    )`;
    await query(sqlQueryProductImage)
  }
}

const insertInventory = async (store_id, productId, quantity_in_stock) => {
  const sqlQueryStoreInventory = `INSERT INTO store_inventory (
    store_id,
    product_id, 
    quantity_in_stock
  ) 
  VALUES (
    ${db.escape(store_id)},
    ${db.escape(productId)},
    ${db.escape(quantity_in_stock)}
  )`;
  await query(sqlQueryStoreInventory)
}

const getProductImages = async (product_id) => {
  const sqlImageQuery = `SELECT * FROM product_images WHERE product_id = ${db.escape(product_id)}`;
  return await query(sqlImageQuery);
}

module.exports = {
  countProducts,
  getProductById,
  getStoreInventory,
  handleProductExistence,
  insertNewProduct,
  insertImages,
  insertInventory,
  getProductImages
}