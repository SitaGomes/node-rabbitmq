import dotenv from "dotenv";
import express from "express";
import cors from "cors";

import brokerRoutes from "./controllers/broker/broker.controller";
import userRoutes from "./controllers/user/user.controler";
import { consumeFromQueue } from "./services/utils/rabbitMQ";
import { addOrder } from "./services/utils/orderMatching";
import { Operation } from "./models/operation.model";

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use("/broker", brokerRoutes);
app.use("/user", userRoutes);

consumeFromQueue("BROKER", (msg) => {
  console.log(`Received message from BROKER: ${msg}`);
  const order = JSON.parse(msg) as Operation;
  addOrder(order);
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(process.env.PORT || 8080, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});
