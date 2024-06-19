import React, { useState } from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import api from "@/services/api";

// Define the validation schema using zod
const stockItemSchema = z.object({
  quantity: z.number().positive().min(1, "Quantity must be at least 1"),
  sellPrice: z.number().positive().optional(),
  buyPrice: z.number().positive().optional(),
});

type StockItemSchema = z.infer<typeof stockItemSchema>;

type Props = {
  id: string;
  name: string;
  price?: string;
  type: "buy" | "sell";
  handleRefresh: () => void;
};

const StockItem = ({ name, price, type, id, handleRefresh }: Props) => {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<StockItemSchema>({
    resolver: zodResolver(stockItemSchema),
  });

  const handleBuyStock = async (data: StockItemSchema) => {
    try {
      await api.post("/broker/buy", {
        id: id,
        price: data.buyPrice || 0,
        stock: name,
        quantity: data.quantity,
      });
    } catch (error) {
      console.error(error);
    }
  };

  const handleSellStock = async (data: StockItemSchema) => {
    try {
      await api.post("/broker/sell", {
        id: id,
        price: data.sellPrice || 0,
        stock: name,
        quantity: data.quantity,
      });
    } catch (error) {
      console.error;
    }
  };

  const onSubmit = (data: StockItemSchema) => {
    if (type === "buy") {
      handleBuyStock(data);
    } else {
      handleSellStock(data);
    }

    alert("Operação realizada com sucesso!");
    handleRefresh();
  };

  return (
    <View style={styles.stock}>
      <View>
        <Text style={styles.name}>Codigo: {name}</Text>
        {price && <Text style={styles.price}>Preço do mercado R$ {price}</Text>}
      </View>
      <View>
        <Text>Quantidade: </Text>
        <Controller
          control={control}
          name="quantity"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={[styles.input, errors.quantity && styles.errorInput]}
              placeholder="Quantidade"
              keyboardType="numeric"
              onBlur={onBlur}
              onChangeText={(value) => onChange(parseFloat(value))}
              value={value ? value.toString() : ""}
            />
          )}
        />
        {errors.quantity && (
          <Text style={styles.errorText}>{errors.quantity.message}</Text>
        )}
      </View>
      {type === "sell" ? (
        <View>
          <Text>Preço de venda: </Text>
          <Controller
            control={control}
            name="sellPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.sellPrice && styles.errorInput]}
                placeholder="Preço de Venda"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(parseFloat(value))}
                value={value ? value.toString() : ""}
              />
            )}
          />
          {errors.sellPrice && (
            <Text style={styles.errorText}>{errors.sellPrice.message}</Text>
          )}
        </View>
      ) : (
        <View>
          <Text>Preço de compra: </Text>

          <Controller
            control={control}
            name="buyPrice"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={[styles.input, errors.sellPrice && styles.errorInput]}
                placeholder="Preço de compra"
                keyboardType="numeric"
                onBlur={onBlur}
                onChangeText={(value) => onChange(parseFloat(value))}
                value={value ? value.toString() : ""}
              />
            )}
          />
          {errors.buyPrice && (
            <Text style={styles.errorText}>{errors.buyPrice.message}</Text>
          )}
        </View>
      )}

      <Button
        title={type === "buy" ? "Comprar" : "Vender"}
        color={type === "buy" ? "#4CAF50" : "#f44336"}
        onPress={handleSubmit(onSubmit)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  stock: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
    padding: 20,
    flexWrap: "wrap",
    backgroundColor: "#f9f9f9",
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
  errorInput: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
  },
});

export default StockItem;
