import { VisibleStock } from "../models/visibleStock.model";
import database from "./utils/database";

class VisibleStockService {
  async addVisibleStockAsync(stock: VisibleStock) {
    try {
      const { data, error } = await database.from("visible_stocks").insert({
        price: stock.price,
        stock: stock.stock,
      });
      if (error) throw error;
      console.log("Visible stock added:", data);
      return data;
    } catch (error) {
      console.error("Error adding visible stock:", error);
      throw error;
    }
  }

  async removeVisibleStockAsync(id: number) {
    try {
      const { data, error } = await database
        .from("visible_stocks")
        .delete()
        .eq("id", id);
      if (error) throw error;
      console.log("Visible stock removed:", data);
      return data;
    } catch (error) {
      console.error("Error removing visible stock:", error);
      throw error;
    }
  }

  async getVisibleStocksAsync() {
    try {
      const { data, error } = await database.from("visible_stocks").select("*");
      if (error) throw error;
      console.log("Fetched visible stocks:", data);
      return data;
    } catch (error) {
      console.error("Error fetching visible stocks:", error);
      throw error;
    }
  }
}

export default new VisibleStockService();
