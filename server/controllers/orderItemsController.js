import { v4 as uuidv4 } from 'uuid';
import { connection } from "../database.js";

// Create (POST)
export async function createOrderItems(req, res) {
  const { items } = req.body;

  // Validate required fields
  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ error: 'Order items must be an array and cannot be empty' });
  }

  // Validate each item
  for (const item of items) {
    const { order_id,product_id, quantity, price } = item;
    if (order_id==null || product_id == null || quantity == null || price == null) {
      return res.status(400).json({ error: 'Each order item must have product_id, quantity, and price' });
    }
  }

  try {
    // Begin a transaction
    await connection.query('BEGIN');

    // Insert all order items
    const insertPromises = items.map(item => {
      const { order_id, product_id, quantity, price } = item;
      console.log(item);
      return connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES ($1, $2, $3, $4) RETURNING *',
        [order_id, product_id, quantity, price]
      );
    });

    const results = await Promise.all(insertPromises);

    // Commit the transaction
    await connection.query('COMMIT');

    // Collect all inserted rows
    const insertedRows = results.flatMap(result => result.rows);

    res.status(201).json({
      message : "Inserted successfully",
      order_items: insertedRows
    });
  } catch (err) {
    // Rollback the transaction in case of an error
    await connection.query('ROLLBACK');
    console.error('Error creating order items', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Read (GET)
export async function getOrderItems(req, res) {
  console.log("Fetching all order items");
  try {
    const result = await connection.query('SELECT * FROM order_items');
    console.log(result.rows);
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving order items', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Update (PATCH)
export async function updateOrderItem(req, res) {
  const { id } = req.params;
  const { order_id, product_id, product_name, quantity, price } = req.body;

  try {
    const result = await connection.query(
      'UPDATE order_items SET order_id = $1, product_id = $2, product_name = $3, quantity = $4, price = $5 WHERE order_item_id = $6 RETURNING *',
      [order_id, product_id, product_name, quantity, price, id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    console.log("Updated Successfully");
    res.status(200).json({
      message: "Updated Successfully",
      resource: result.rows[0]
    });
  } catch (err) {
    console.error('Error updating order item', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete (DELETE)
export async function deleteOrderItem(req, res) {
  const { id } = req.params;

  try {
    const result = await connection.query('DELETE FROM order_items WHERE order_item_id = $1 RETURNING *', [id]);

    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order item not found' });
    }

    console.log("Order item deleted successfully");
    res.status(200).json({ message: 'Order item deleted successfully' });
  } catch (err) {
    console.error('Error deleting order item', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Create Order (POST)
async function handleOrderCreation(orderData) {
  const { customer_id, total } = orderData;
  const order_id = uuidv4();

  const query = `
    INSERT INTO orders ( order_id, customer_id, order_total )
    VALUES ($1, $2, $3)
    RETURNING order_id;
  `;

  try {
    const result = await connection.query(query, [order_id, customer_id, total]);
    return result.rows[0].order_id;
  } catch (err) {
    console.error('Error creating order', err.stack);
    throw err; // Rethrow error to be handled by the orchestration function
  }
}

export const orderItemsController = {
  handleOrderCreation,
  createOrderItems,
  getOrderItems,
  updateOrderItem,
  deleteOrderItem
};
