const pool = require("../../db");

const getProducts = async (req, res) => {
  try {
    const { search, type, brand, size, color } = req.query;

    let query = "SELECT * from products WHERE 1=1";
    let values = [];
    let index = 1;

    if (search) {
      query += ` AND LOWER(name) LIKE LOWER($${index})`;
      values.push(`%${search}%`);
      index++;
    }
    if (type) {
      query += ` AND LOWER(type) = LOWER($${index})`;
      values.push(type);
      index++;
    }

    if (brand) {
      query += ` AND LOWER(brand) = LOWER($${index})`;
      values.push(brand);
      index++;
    }

    if (size) {
      query += ` AND LOWER(size) = LOWER($${index})`;
      values.push(size);
      index++;
    }

    if (color) {
      query += ` AND LOWER(color) = LOWER($${index})`;
      values.push(color);
      index++;
    }

    query += " ORDER BY id ASC";

    const products = await pool.query(query, values);
    res.json(products.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever Error");
  }
};

const addProduct = async (req, res) => {
  try {
    const { name, type, brand, size, color, quantity } = req.body;
    const newProduct = await pool.query(
      "INSERT INTO products (name, type, brand, size, color, quantity) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [name, type, brand, size, color, quantity]
    );
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Sever Error");
  }
};

const updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, type, brand, size, color, quantity } = req.body;

    let updates = [];
    let values = [];
    let index = 1;

    if (name) {
      updates.push(`name = $${index}`);
      values.push(name);
      index++;
    }
    if (type) {
      updates.push(`type = $${index}`);
      values.push(type);
      index++;
    }
    if (brand) {
      updates.push(`brand = $${index}`);
      values.push(brand);
      index++;
    }
    if (size) {
      updates.push(`size = $${index}`);
      values.push(size);
      index++;
    }
    if (color) {
      updates.push(`color = $${index}`);
      values.push(color);
      index++;
    }
    if (quantity !== undefined) {
      updates.push(`quantity = $${index}`);
      values.push(quantity);
      index++;
    }

    // If no valid updates, return an error
    if (updates.length === 0) {
      return res.status(400).json({ error: "Invalid input provided" });
    }

    // Add product ID to the query
    values.push(id);

    // Construct query
    const query = `UPDATE products SET ${updates.join(
      ", "
    )} WHERE id = $${index} RETURNING *`;

    // Execute query
    const updatedProduct = await pool.query(query, values);

    if (updatedProduct.rowCount === 0) {
      return res.status(404).json({ error: "Product not found" });
    }

    res.json(updatedProduct.rows[0]); // Return updated product
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Server Error" });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const deleteProduct = await pool.query(
      "DELETE FROM products WHERE id = $1 RETURNING *",
      [id]
    );
    if (deleteProduct.rows.length === 0) {
      return res.status(404).send("Product not found");
    }
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

module.exports = { getProducts, addProduct, updateProduct, deleteProduct };
