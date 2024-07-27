import { connection } from "../database.js";

import { createOrder } from "../controllers/orderController.js";
import { createOrderItems } from "../controllers/orderItemsController.js";

// Function to handle the transaction
export async function orderHandler() {
  const { orderData, orderItems } = req.body();
  const { customer_id, total } = orderData;

  try {
    await connection.connect();
    await connection.query('BEGIN'); // Start transaction

    // Step 1: Create order and get the order ID
    const order_id = await createOrder({ customer_id, total });
    
    // Add order_id to each item
    const itemsWithOrderId = orderItems.map(item => ({ ...item, order_id }));
    
    // Step 2: Create order items
    await createOrderItems(itemsWithOrderId);
    
    await connection.query('COMMIT'); // Commit transaction
    console.log('Order and order items created successfully');
    return { order_id };
  } catch (err) {
    await connection.query('ROLLBACK'); // Rollback transaction on error
    console.error('Transaction failed, rolled back:', err.stack);
    throw err; // Rethrow error to be handled by the caller
  }
}
