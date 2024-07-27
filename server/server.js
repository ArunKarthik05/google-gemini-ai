import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

//ROUTES
import itemsRoute from "./routes/itemRoutes.js"
import orderItemRoutes from "./routes/orderItemsRoutes.js"
import orderRoutes from "./routes/orderRoutes.js"
import customerRoutes from "./routes/customerRoutes.js";
import addOrder from "./routes/addOrder.js";

//CONFIGS
import { appConfig } from "./config/appConfig.js";
import { aiController } from "./controllers/aiController.js";

//MIDDLEWARE
const app = express();
const PORT = process.env.PORT;

app.use(
  cors({
    origin: appConfig.corsConfig.origin,
    methods: appConfig.corsConfig.methods,
    allowedHeaders: ["Content-Type", "application/json"],
  })
);
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

//ROUTE HANDLERS
app.get("/",(req,res)=>{
  res.json({"message":"Welcome to Arun's Chat Model"})
})

// Get Gemini API Response
app.post("/api/model", aiController);

//ROUTES
app.use("/api/products",itemsRoute);
app.use("/api/order_items",orderItemRoutes);
app.use("/api/orders",orderRoutes);
app.use("/api/customers",customerRoutes);
app.use("/api/addOrder",addOrder);

// App listening
app.listen(PORT, () => {
  console.log("Gemini AI Server is listening on port number", PORT);
});
