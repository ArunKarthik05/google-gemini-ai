import { orderHandler } from "../orchestration/orderhandler";

const router = express.Router();

router.post('/',orderHandler);

export default router;