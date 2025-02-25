const {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  getFilterOptions,
} = require("../controllers/products");
const updateValidator = require("../validators/updateValidator");

const router = require("express").Router();

router.get("/", getProducts);
router.get("/filters", getFilterOptions);
router.post("/", addProduct);
router.put("/:id", updateValidator, updateProduct);
router.delete("/:id", deleteProduct);

module.exports = router;
