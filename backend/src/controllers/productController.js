let nextId = 1;
const products = [];

const getAllProducts = (req, res) => {
  return res.json({
    success: true,
    data: products,
  });
};

const createProduct = (req, res) => {
  const { name, price, description } = req.body || {};

  if (!name || price === undefined) {
    return res.status(400).json({
      success: false,
      message: "name and price are required",
    });
  }

  const numericPrice = Number.parseFloat(price);
  if (Number.isNaN(numericPrice)) {
    return res.status(400).json({
      success: false,
      message: "price must be a valid number",
    });
  }

  const product = {
    id: nextId++,
    name,
    price: numericPrice,
    description: description || "",
  };

  products.push(product);

  return res.status(201).json({
    success: true,
    data: product,
  });
};

const getProductById = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a number",
    });
  }

  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  return res.json({
    success: true,
    data: product,
  });
};

const updateProduct = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a number",
    });
  }

  const product = products.find((item) => item.id === id);
  if (!product) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  const { name, price, description } = req.body || {};

  if (name !== undefined) {
    product.name = name;
  }

  if (price !== undefined) {
    const numericPrice = Number.parseFloat(price);
    if (Number.isNaN(numericPrice)) {
      return res.status(400).json({
        success: false,
        message: "price must be a valid number",
      });
    }
    product.price = numericPrice;
  }

  if (description !== undefined) {
    product.description = description;
  }

  return res.json({
    success: true,
    data: product,
  });
};

const deleteProduct = (req, res) => {
  const id = Number.parseInt(req.params.id, 10);
  if (Number.isNaN(id)) {
    return res.status(400).json({
      success: false,
      message: "id must be a number",
    });
  }

  const index = products.findIndex((item) => item.id === id);
  if (index === -1) {
    return res.status(404).json({
      success: false,
      message: "product not found",
    });
  }

  const removed = products.splice(index, 1)[0];

  return res.json({
    success: true,
    data: removed,
  });
};

module.exports = {
  getAllProducts,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
};
