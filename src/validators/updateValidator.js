const updateValidator = (req, res, next) => {
  const { name, type, brand, size, color, quantity } = req.body;

  // Ensure at least one field is being updated
  if (!name && !type && !brand && !size && !color && quantity === undefined) {
    return res
      .status(400)
      .json({ error: "At least one field must be updated" });
  }

  // Validate text fields (only allow letters, numbers, and spaces)
  const textFields = { name, type, brand, size, color };
  for (const key in textFields) {
    if (textFields[key] && !/^[a-zA-Z0-9\s]+$/.test(textFields[key])) {
      return res.status(400).json({ error: `Invalid characters in ${key}` });
    }
  }

  // Validate quantity (must be an integer)
  if (quantity !== undefined && (!Number.isInteger(quantity) || quantity < 0)) {
    return res
      .status(400)
      .json({ error: "Quantity must be a non-negative integer" });
  }

  next(); // Proceed to controller if validation passes
};

module.exports = updateValidator;
