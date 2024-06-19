import { Stock } from "../models/stock.model";
import database from "./utils/database";

class StockService {
  async addStockAsync(stock: Stock) {
    try {
      const { data, error } = await database.from("stocks").insert({
        code: stock.stock,
        quantity: stock.quantity,
        ownerID: stock.ownerID,
      });
      if (error) throw error;
      console.log("Stock added:", data);
      return data;
    } catch (error) {
      console.error("Error adding stock:", error);
      throw error;
    }
  }

  async removeStockAsync(id: string) {
    try {
      const { data, error } = await database
        .from("stocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      console.log("Stock removed:", data);
      return data;
    } catch (error) {
      console.error("Error removing stock:", error);
      throw error;
    }
  }

  async getStocksAsync() {
    try {
      const { data, error } = await database.from("stocks").select("*");
      if (error) throw error;
      console.log("Fetched stocks:", data);
      return data;
    } catch (error) {
      console.error("Error fetching stocks:", error);
      throw error;
    }
  }

  async findUserStocksAsync(userId: string) {
    try {
      const { data, error } = await database
        .from("stocks")
        .select("*")
        .eq("ownerID", userId);
      if (error) throw error;
      console.log("Fetched user stocks:", data);
      return data;
    } catch (error) {
      console.error("Error fetching user stocks:", error);
      throw error;
    }
  }

  async updateStockAsync(stock: Stock) {
    try {
      const { data, error } = await database
        .from("stocks")
        .update({
          code: stock.stock,
          quantity: stock.quantity,
        })
        .eq("ownerID", stock.ownerID)
        .eq("code", stock.stock);
      if (error) throw error;
      console.log("Stock updated:", data);
      return data;
    } catch (error) {
      console.error("Error updating stock:", error);
      throw error;
    }
  }
}

export default new StockService();
