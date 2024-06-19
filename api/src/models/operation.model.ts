export type Operation = {
  stock: string;
  quantity: number;
  value: number;
  ownerID: string;
  operation: "buy" | "sell";
};

export type DbOperation = {
  id: string;
  created_at: string;
  stock: string;
  quantity: number;
  value: number;
  ownerID: string;
  operation: string;
};
