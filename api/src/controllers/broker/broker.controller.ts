import express, { Request, Response } from "express";
import { sendToQueue } from "../../services/utils/rabbitMQ";
import { BUY_STOCK_DTO } from "./dtos/buy_stock.dto";
import { RESPONSE_STATUS } from "../../contants/RESPONSE_STATUS";
import operationService from "../../services/operation.service";
import { SELL_STOCK_DTO } from "./dtos/sell_stock.dto";
import visibleStockService from "../../services/visibleStock.service";
import { VisibleStock } from "../../models/visibleStock.model";

const broker = express();

broker.use(express.json());

broker.post("/buy", async (req: Request, res: Response) => {
  const { id, price, quantity, stock }: BUY_STOCK_DTO = req.body;

  if (!id || !stock || !quantity || !price) {
    return res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json({ error: "Id, stock, quantity or price are missing" });
  }

  const message = JSON.stringify({ operation: "buy", stock, quantity, price });

  await operationService.addOperationAsync({
    ownerID: id,
    stock,
    quantity,
    value: price,
    operation: "buy",
  });

  sendToQueue("BROKER", message);

  return res
    .status(RESPONSE_STATUS.SUCCESS)
    .json({ message: "Order sent to broker queue" });
}); // * BUY STOCK

broker.post("/sell", async (req: Request, res: Response) => {
  const { id, price, quantity, stock }: SELL_STOCK_DTO = req.body;

  if (!id || !stock || !quantity || !price) {
    return res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json({ error: "Id, stock, quantity or price are missing" });
  }

  const message = JSON.stringify({ operation: "sell", stock, quantity, price });

  await operationService.addOperationAsync({
    ownerID: id,
    stock,
    quantity,
    value: price,
    operation: "sell",
  });

  sendToQueue("BROKER", message);

  return res
    .status(RESPONSE_STATUS.SUCCESS)
    .json({ message: "Order sent to broker queue" });
}); // * SELL STOCK

broker.get("/operations", async (req: Request, res: Response) => {
  const operations = await operationService.getOperationsAsync();

  return res.status(RESPONSE_STATUS.SUCCESS).json(operations);
}); // * GET OPERATIONS

broker.get("/stocks", async (req: Request, res: Response) => {
  const stocks = await visibleStockService.getVisibleStocksAsync();

  return res.status(RESPONSE_STATUS.SUCCESS).json(stocks);
}); // * GET VISIBLE STOCKS

broker.post("/stocks", async (req: Request, res: Response) => {
  const { stock, price }: VisibleStock = req.body;

  if (!stock || !price) {
    return res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json({ error: "Code or quantity are missing" });
  }

  await visibleStockService.addVisibleStockAsync({ stock, price });

  return res
    .status(RESPONSE_STATUS.SUCCESS)
    .json({ message: "Stock added to visible stocks" });
}); // * ADD VISIBLE STOCK

export default broker;
