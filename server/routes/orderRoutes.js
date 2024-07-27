import express from 'express';
const router = express.Router();
import { createOrder, getOrders, deleteOrder} from '../controllers/orderController.js';

// Route for creating a new order
router.post('/', createOrder);

// Route for retrieving all orders
router.get('/', getOrders);

router.delete('/:id',deleteOrder)

export default router;
