const express = require("express");
const { adminCategoryController } = require("../../controllers");
const { check } = require("express-validator");
const upload = require("../../middleware/uploadMiddleware");
const { adminVerifyToken } = require("../../middleware/adminAuth");
const router = express.Router();

router.get("/categories", adminCategoryController.getCategories);
router.post("/categories", adminVerifyToken, upload.single("image"), check("product_category_name").notEmpty().withMessage("Category name is required"), adminCategoryController.createCategory);
router.put("/categories/:categoryId", adminVerifyToken, upload.single("product_category_image"), check("product_category_name").notEmpty().withMessage("Category name is required"), adminCategoryController.updateCategory);
router.delete("/categories/:categoryId", adminVerifyToken, adminCategoryController.deleteCategory);
router.delete("/categories/:categoryId/permanently", adminVerifyToken, adminCategoryController.hardDeleteCategory);

module.exports = router;
