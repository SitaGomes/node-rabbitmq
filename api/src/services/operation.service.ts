import { DbOperation, Operation } from "../models/operation.model";
import database from "./utils/database";

class OperationService {
  constructor() {}

  async addOperationAsync(operation: Operation) {
    try {
      const { data, error } = await database.from("operations").insert({
        stock: operation.stock,
        quantity: operation.quantity,
        value: operation.value,
        operation: operation.operation,
        ownerID: operation.ownerID,
      });
      if (error) throw error;
      console.log("Operation added:", data);
      return data;
    } catch (error) {
      console.error("Error adding operation:", error);
      throw error;
    }
  }

  async removeOperationAsync(id: string) {
    try {
      const { data, error } = await database
        .from("operations")
        .delete()
        .eq("id", id);
      if (error) throw error;
      console.log("Operation removed:", data);
      return data;
    } catch (error) {
      console.error("Error removing operation:", error);
      throw error;
    }
  }

  async getOperationsAsync() {
    try {
      const { data, error } = await database.from("operations").select("*");
      if (error) throw error;
      console.log("Fetched operations:", data);
      return data;
    } catch (error) {
      console.error("Error fetching operations:", error);
      throw error;
    }
  }

  async updateAllOperationsAsync(operations: DbOperation[]) {
    try {
      const updates = operations.map((op) =>
        database.from("operations").update(op).eq("id", op.id)
      );
      const results = await Promise.all(updates);
      console.log("Operations updated:", results);
      return results;
    } catch (error) {
      console.error("Error updating operations:", error);
      throw error;
    }
  }
}

export default new OperationService();
