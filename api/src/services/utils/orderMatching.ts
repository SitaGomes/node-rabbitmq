import { DbOperation, Operation } from "../../models/operation.model";
import operationService from "../operation.service";
import stockService from "../stock.service";
import { sendToQueue } from "./rabbitMQ";

export const addOrder = async (order: Operation) => {
  const operations = await operationService.getOperationsAsync();
  if (!operations) {
    return;
  }

  const buyOrders = operations
    .filter((operation) => operation.operation === "buy")
    .map((op) => ({
      ...op,
      value: op.value || 0,
      quantity: op.quantity || 0,
      stock: op.stock || "",
      ownerID: op.ownerID || "",
      operation: op.operation || "buy",
    }));

  const sellOrders = operations
    .filter((operation) => operation.operation === "sell")
    .map((op) => ({
      ...op,
      value: op.value || 0,
      quantity: op.quantity || 0,
      stock: op.stock || "",
      ownerID: op.ownerID || "",
      operation: op.operation || "sell",
    }));

  await matchOrders(buyOrders, sellOrders);
};

const matchOrders = async (
  buyOrders: DbOperation[],
  sellOrders: DbOperation[]
) => {
  const updatedOperations: DbOperation[] = [];

  for (let i = 0; i < buyOrders.length; i++) {
    for (let j = 0; j < sellOrders.length; j++) {
      if (
        buyOrders[i].stock === sellOrders[j].stock &&
        buyOrders[i].value >= sellOrders[j].value
      ) {
        const transaction = {
          stock: buyOrders[i].stock,
          quantity: Math.min(buyOrders[i].quantity, sellOrders[j].quantity),
          value: (buyOrders[i].value + sellOrders[j].value) / 2,
          buyer: buyOrders[i].ownerID,
          seller: sellOrders[j].ownerID,
        };

        // Publish the transaction
        publishTransaction(transaction);

        await stockService.updateStockAsync({
          ownerID: transaction.buyer,
          stock: transaction.stock,
          quantity: transaction.quantity,
        });

        await stockService.updateStockAsync({
          ownerID: transaction.seller,
          stock: transaction.stock,
          quantity: transaction.quantity,
        });

        // Update or remove orders
        if (buyOrders[i].quantity > sellOrders[j].quantity) {
          buyOrders[i].quantity -= sellOrders[j].quantity;
          updatedOperations.push(buyOrders[i]);
          sellOrders.splice(j, 1);
        } else if (buyOrders[i].quantity < sellOrders[j].quantity) {
          sellOrders[j].quantity -= buyOrders[i].quantity;
          updatedOperations.push(sellOrders[j]);
          buyOrders.splice(i, 1);
        } else {
          buyOrders.splice(i, 1);
          sellOrders.splice(j, 1);
        }

        // Save updated operations
        await operationService.updateAllOperationsAsync(updatedOperations);
        return;
      }
    }
  }
};

const publishTransaction = (transaction: any) => {
  // Publish transaction to RabbitMQ

  sendToQueue("BOLSADEVALORES", JSON.stringify(transaction));
};
