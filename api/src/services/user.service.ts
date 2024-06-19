import { User } from "../models/user.model";
import database from "./utils/database";

class UserService {
  constructor() {}

  async getUsersAsync() {
    try {
      const { data, error } = await database.from("users").select("*");
      if (error) throw error;
      console.log("Fetched users:", data);
      return data;
    } catch (error) {
      console.error("Error fetching users:", error);
      throw error;
    }
  }

  async addNewUserAsync(user: Omit<User, "id">) {
    try {
      console.log("Adding user -> ", user);
      const { data, error } = await database.from("users").insert({
        name: user.name,
        email: user.email,
        password: user.password,
      });
      if (error) throw error;
      console.log("User added:", data);
    } catch (error) {
      console.error("Error adding user:", error);
      throw error;
    }
  }

  async findUserByIdAsync(id: string) {
    try {
      const { data, error } = await database
        .from("users")
        .select("*")
        .eq("id", id);
      if (error) throw error;
      console.log("User found by ID:", data);
      return data?.[0];
    } catch (error) {
      console.error("Error finding user by ID:", error);
      throw error;
    }
  }

  async findUserByEmailAsync(email: string) {
    try {
      const { data, error } = await database
        .from("users")
        .select("*")
        .eq("email", email);
      if (error) throw error;
      console.log("User found by email:", data);
      return data?.[0];
    } catch (error) {
      console.error("Error finding user by email:", error);
      throw error;
    }
  }

  async updateUserByEmailAsync(user: Omit<User, "id">) {
    try {
      console.log("Updating user -> ", user);
      const { data, error } = await database
        .from("users")
        .update({
          name: user.name,
          email: user.email,
          password: user.password,
        })
        .eq("email", user.email);
      if (error) throw error;
      console.log("User updated:", data);
      return data?.[0];
    } catch (error) {
      console.error("Error updating user:", error);
      throw error;
    }
  }
}

export default new UserService();
