import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  ScrollView,
} from "react-native";
import axios from "axios";
import { ActivityIndicator } from "react-native";

export default function Index() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSend = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "http://192.168.15.149:3000/ask",
        JSON.stringify({ question: input }),
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      const data = await res.data;
      setResponse(data.answer || "Sem resposta");
      setInput("");
    } catch (err) {
      console.log(err.response ? err.response.data : err.message);
      setResponse("Erro ao conectar com o servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Assistente Virtual com LLM</Text>
      <TextInput
        style={styles.input}
        placeholder="Digite sua pergunta"
        value={input}
        onChangeText={setInput}
      />
      <Button icon="search" title="Enviar" onPress={handleSend} />
      <Text style={styles.responseTitle}>Resposta:</Text>
      {isLoading ? (
        <ActivityIndicator size="large" />
      ) : (
        <Text style={styles.response}>{response}</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flexGrow: 1,
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: "center",
  },
  input: {
    height: 50,
    borderColor: "gray",
    borderWidth: 1,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  responseTitle: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
  },
  response: {
    fontSize: 16,
    marginTop: 10,
  },
});
