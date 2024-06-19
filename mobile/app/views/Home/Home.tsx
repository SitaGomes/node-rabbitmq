import React, { useEffect, useState } from "react";
import {
  Button,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { VIEWS } from "@/constants/VIEWS";
import api from "@/services/api";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/app/types/User";
import { UserStock } from "@/app/types/UserStock";
import { AvailableStock } from "@/app/types/AvailableStock";

import StockItem from "../../../components/StockItem";
import { Operation } from "@/app/types/Operation";
import OperationItem from "@/components/OperationItem";

const App = () => {
  const { navigate } = useNavigation();
  const [user, setUser] = useState({} as User);
  const [userStocks, setUserStocks] = useState([] as UserStock[]);
  const [availableStocks, setAvailableStocks] = useState(
    [] as AvailableStock[]
  );
  const [operations, setOperations] = useState([] as Operation[]);

  const handleLogout = () => {
    navigate(VIEWS.LOGIN as never);
  };

  const [refresh, setRefresh] = useState(false);

  const handleRefresh = () => setRefresh(!refresh);

  useEffect(() => {
    const getUser = async () => {
      const userId = await AsyncStorage.getItem("userId");

      const { data } = (await api.get(`/user/${userId}`)) as {
        data: User & {
          stocks: UserStock[];
        };
      };

      setUser({
        created_at: data.created_at,
        email: data.email,
        id: data.id,
        name: data.name,
        password: data.password,
      });
      setUserStocks(data.stocks);
    };

    const getAvailableStocks = async () => {
      const { data } = (await api.get("/broker/stocks")) as {
        data: AvailableStock[];
      };

      setAvailableStocks(data);
    };

    const getOperations = async () => {
      const { data } = (await api.get("/broker/operations")) as {
        data: Operation[];
      };

      setOperations(data);
    };

    getUser();
    getAvailableStocks();
    getOperations();
  }, [api, AsyncStorage, refresh]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Bem vindo, {user.name} ({user.email})
          </Text>
          <Text style={styles.header}>Carteira de Ações</Text>
        </View>

        <View>
          <Text style={styles.sectionTitle}>Ações Disponíveis</Text>
          {availableStocks.map((stock) => (
            <StockItem
              id={user.id}
              key={stock.id}
              name={stock.stock}
              price={stock.price.toString()}
              type="buy"
              handleRefresh={handleRefresh}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Historico de operações</Text>
          {operations.map((stock) => (
            <OperationItem
              key={stock.id}
              name={stock.stock}
              price={stock.value.toString()}
              type={stock.operation}
              quantity={stock.quantity}
            />
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Minhas Ações</Text>
          {userStocks.map((stock) => (
            <StockItem
              id={user.id}
              key={stock.id}
              name={stock.name}
              price={stock.price.toString()}
              type="sell"
              handleRefresh={handleRefresh}
            />
          ))}
        </View>
      </ScrollView>
      <Button title="Sair" color={"#a22"} onPress={handleLogout} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f4f4f4",
    paddingHorizontal: 20,
    paddingTop: 40,
    padding: 20,
  },
  content: {
    gap: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#ddd",
    paddingBottom: 5,
    marginBottom: 10,
  },
});

export default App;
