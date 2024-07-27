import express from 'express';
const router = express.Router();
import { createCustomer,getCustomers } from '../controllers/customerController.js';

// Route for creating a new order
router.post('/', createCustomer);

// Route for retrieving all orders
router.get('/', getCustomers);

export default router;