import express, { Request, Response } from "express";
import { RESPONSE_STATUS } from "../../contants/RESPONSE_STATUS";
import userService from "../../services/user.service";
import stockService from "../../services/stock.service";

import { LoginDTO } from "./dtos/login.dto";
import { SignupDTO } from "./dtos/signup.dto";

const user = express();

user.use(express.json());

user.get("/:id", async (req: Request, res: Response) => {
  const id = req.params.id;

  if (!id) {
    return res
      .status(RESPONSE_STATUS.NOT_FOUND)
      .json({ message: "User not found" });
  }

  const user = await userService.findUserByIdAsync(id);

  if (!user) {
    return res
      .status(RESPONSE_STATUS.NOT_FOUND)
      .json({ message: "User not found" });
  }

  const stocks = await stockService.findUserStocksAsync(id);

  const response = {
    ...user,
    stocks,
  };

  return res.status(RESPONSE_STATUS.SUCCESS).json(response);
}); //* GET USER BY ID

user.post("/singup", async (req: Request, res: Response) => {
  const user: SignupDTO = req.body;

  try {
    if (!user.name || !user.email || !user.password) {
      return res
        .status(RESPONSE_STATUS.BAD_REQUEST)
        .json({ message: "Name, email or password are missing." });
    }

    const response = await userService.addNewUserAsync(user);
    console.log(response);
    return res.status(RESPONSE_STATUS.SUCCESS).json({ message: "User added" });
  } catch (error) {
    return res
      .status(RESPONSE_STATUS.SERVER_ERROR)
      .json({ message: "Internal server error" });
  }
}); //* SIGNUP

user.post("/login", async (req: Request, res: Response) => {
  const { email, password }: LoginDTO = req.body;

  if (!email || !password) {
    return res
      .status(RESPONSE_STATUS.BAD_REQUEST)
      .json({ message: "Email or password are missing." });
  }

  const user = await userService.findUserByEmailAsync(email);

  if (!user) {
    return res
      .status(RESPONSE_STATUS.NOT_FOUND)
      .json({ message: "User not found" });
  }

  if (user.password !== password) {
    return res
      .status(RESPONSE_STATUS.UNAUTHORIZED)
      .json({ message: "Invalid password" });
  }

  return res.status(RESPONSE_STATUS.SUCCESS).json(user);
}); //* LOGIN

export default user;
