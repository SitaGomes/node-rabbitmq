import React from "react";
import { View, Text, TextInput, Button, StyleSheet } from "react-native";
import { useForm, Controller } from "react-hook-form";
import { useNavigation } from "@react-navigation/native";
import { VIEWS } from "@/constants/VIEWS";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "@/services/api";

import { z } from "zod";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "@/app/types/User";

const loginSchema = z.object({
  email: z.string().email({ message: "Email inválido" }),
  password: z.string().min(3).max(20),
});

type LoginSchema = z.infer<typeof loginSchema>;

const LoginScreen: React.FC = () => {
  const { navigate } = useNavigation();

  const handleGoToRegister = () => navigate(VIEWS.REGISTER as never);
  const handleGoToHome = () => navigate(VIEWS.HOME as never);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginSchema) => {
    console.log(data);

    try {
      const {
        data: { id },
      } = (await api.post("/user/login", {
        email: data.email,
        password: data.password,
      })) as {
        data: User;
      };

      await AsyncStorage.setItem("userId", id);

      alert("Usuário logado com sucesso!");
      handleGoToHome();
      reset();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Login</Text>
      <Text>Email</Text>
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            keyboardType="email-address"
          />
        )}
      />
      {errors.email && (
        <Text style={styles.errorText}>{errors.email.message}</Text>
      )}

      <Text>Senha</Text>
      <Controller
        control={control}
        name="password"
        render={({ field: { onChange, onBlur, value } }) => (
          <TextInput
            style={styles.input}
            onChangeText={onChange}
            onBlur={onBlur}
            value={value}
            secureTextEntry
          />
        )}
      />
      {errors.password && (
        <Text style={styles.errorText}>{errors.password.message}</Text>
      )}

      <Button title="Login" onPress={handleSubmit(onSubmit)} />
      <Text onPress={handleGoToRegister}>Criar conta</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 16,
    gap: 12,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 12,
    padding: 10,
  },
  errorText: {
    color: "red",
  },
});

export default LoginScreen;
