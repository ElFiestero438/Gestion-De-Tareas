// src/screens/LoginScreen.js
import React, { useState } from "react";
import { View, TextInput, Button, Text, Alert } from "react-native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, signInWithGoogle } from "../Firebase/config";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      Alert.alert("Error", "Credenciales incorrectas");
    }
  };

  const loginGoogle = async () => {
    const user = await signInWithGoogle();
    if (!user) Alert.alert("Error", "No se pudo iniciar sesión con Google");
  };

  return (
    <View style={{ flex: 1, justifyContent: "center", padding: 20 }}>
      <Text style={{ fontSize: 28, textAlign: "center", marginBottom: 20 }}>Iniciar Sesión</Text>
      <TextInput
        placeholder="Correo"
        value={email}
        onChangeText={setEmail}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <TextInput
        placeholder="Contraseña"
        value={password}
        secureTextEntry
        onChangeText={setPassword}
        style={{ borderWidth: 1, padding: 10, marginBottom: 20 }}
      />
      <Button title="Iniciar sesión" onPress={login} />
      <Button title="Iniciar con Google" onPress={loginGoogle} />
      <Text
        style={{ marginTop: 15, textAlign: "center", color: "blue" }}
        onPress={() => navigation.navigate("Register")}
      >
        Crear cuenta
      </Text>
    </View>
  );
}
