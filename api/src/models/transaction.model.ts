import { Operation } from "./operation.model";

export type Transaction = Omit<
  Operation,
  "broker" | "operation" | "ownerID"
> & {
  buyer: string;
  seller: string;
};
