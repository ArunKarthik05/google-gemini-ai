import express from 'express';
const router = express.Router();
import { orderItemsController } from '../controllers/orderItemsController.js';

// Route for creating a new order item
router.post('/', orderItemsController.createOrderItems);

// Route for retrieving all order items
router.get('/', orderItemsController.getOrderItems);

// Route for updating an order item
router.patch('/:id', orderItemsController.updateOrderItem);

// Route for deleting an order item
router.delete('/:id', orderItemsController.deleteOrderItem);

export default router;
