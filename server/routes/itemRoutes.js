import express from "express";
const router = express.Router();
import {itemsController} from "../controllers/itemsController.js"

// Route for creating a product
router.post('/', itemsController.createProduct);

// Route for retrieving all products
router.get('/', itemsController.getProducts);

// Route for updating a product
router.patch('/:id', itemsController.updateProduct);

// Route for deleting a product
router.delete('/:id', itemsController.deleteProduct);

export default router;