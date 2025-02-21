require("dotenv").config();

const express = require("express");
const cors = require("cors");
const app = express();

const products = require("./src/routers/product.js");

app.use(cors());
app.use(express.json());

app.use("/products", products);

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => {
  console.log(`Sever running on port ${PORT}`);
});
