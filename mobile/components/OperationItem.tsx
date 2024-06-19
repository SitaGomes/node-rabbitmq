import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";

type Props = {
  name: string;
  price: string;
  quantity: number;
  type: "buy" | "sell";
};

const OperationItem = ({ name, price, type, quantity }: Props) => {
  return (
    <View style={styles.stock}>
      <Text style={styles.name}>{name}</Text>
      <Text>Quantidade: {quantity}</Text>
      <Text>
        {type === "sell" ? <>Preço de Venda</> : <>Preço da compra</>}
      </Text>
      {price && <Text style={styles.price}>R$ {price}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  stock: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  name: {
    width: "15%",
    fontSize: 16,
  },
  price: {
    width: "20%",
    fontSize: 16,
  },
  input: {
    width: "20%",
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 5,
    marginHorizontal: 5,
  },
});

export default OperationItem;
