import { connection } from "../database.js";

// Create (POST) - Add a new order
export async function createOrder(req, res) {
  const { customer_id, total } = req.body;

  // Validate required fields
  if (customer_id == null || total == null  ) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    // Insert the new order
    const result = await connection.query(
      'INSERT INTO orders (customer_id, order_total ) VALUES ($1, $2 ) RETURNING *',
      [customer_id, total ]
    );

    // Respond with the newly created order
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Error creating order', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Read (GET) - Retrieve all orders
export async function getOrders(req, res) {
  try {
    // Fetch all orders
    const result = await connection.query('SELECT * FROM orders');

    console.log(result.rows);
    // Respond with the retrieved orders
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error retrieving orders', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

// Delete (DELETE) - Remove an order by order_id
export async function deleteOrder(req, res) {
  const { id } = req.params; // Get the order_id from request parameters

  if (!id) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    // Delete the order with the specified order_id
    const result = await connection.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);

    // Check if any rows were affected
    if (result.rowCount === 0) {
      return res.status(404).json({ error: 'Order not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Order deleted successfully', deletedOrder: result.rows[0] });
  } catch (err) {
    console.error('Error deleting order', err.stack);
    res.status(500).json({ error: 'Internal server error' });
  }
}

