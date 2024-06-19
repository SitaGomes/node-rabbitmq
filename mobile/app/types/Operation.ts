export type Operation = {
  id: string;
  created_at: string;
  ownerID: string;
  stock: string;
  quantity: number;
  value: number;
  operation: "buy" | "sell";
};
