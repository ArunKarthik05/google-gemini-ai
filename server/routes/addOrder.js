import { orderHandler } from "../orchestration/orderhandler.js";
import express from 'express';
const router = express.Router();

router.post('/',orderHandler);

export default router;