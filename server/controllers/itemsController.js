import { connection } from "../database.js";

// Create (POST)
export async function createProduct(req, res) {
  const { product_name, price, profit } = req.body;
  console.log(req.body);

  // Validate required fields
  if (!product_name || price == null || profit == null) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Check if a product with the same name already exists
    const existingProductResult = await connection.query('SELECT * FROM products WHERE product_name = $1', [product_name]);
    
    if (existingProductResult.rowCount > 0) {
      return res.status(409).json({ error: 'Product with this name already exists' });
    }

    // Insert the new product if it does not exist
    const result = await connection.query(
      'INSERT INTO products (product_name, price, profit) VALUES ($1, $2, $3) RETURNING *',
      [product_name, price, profit]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating product', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Read (GET)
async function getProducts(req, res) {
    console.log("Fetcing all products");
  try {
    const result = await connection.query('SELECT * FROM products');
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving products', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update (PATCH)
async function updateProduct(req, res) {
  const { id } = req.params;
  const { product_name, price, profit } = req.body;
  try {
    const result = await connection.query('UPDATE products SET product_name = $1, price = $2, profit = $3 WHERE id = $4 RETURNING *', [product_name, price, profit, id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log("Updated Successfully");
    res.status(200).json({
    message : "Updated Successfully",
    resource: result.rows[0]});
  } catch (err) {
    console.error('Error updating product', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete (DELETE)
async function deleteProduct(req, res) {
  const { id } = req.params;
  try {
    const result = await connection.query('DELETE FROM products WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    console.log("Product deleted successfully");
    res.status(200).json({ message: 'Product deleted successfully' });
  } catch (err) {
    console.error('Error deleting product', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}
export const itemsController = {
    createProduct,
    getProducts,
    updateProduct,
    deleteProduct
};