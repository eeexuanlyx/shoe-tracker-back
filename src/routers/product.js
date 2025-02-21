const {
  getProducts,
  addProduct,
  updateProduct,
} = require("../controllers/products");
const updateValidator = require("../validators/updateValidator");

const router = require("express").Router();

router.get("/", getProducts);
router.post("/", addProduct);
router.put("/:id", updateValidator, updateProduct);

module.exports = router;
