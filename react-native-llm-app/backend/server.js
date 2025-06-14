const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const axios = require("axios");
require("dotenv/config");

const app = express();
const port = 3000;

app.use(cors());
app.use(bodyParser.json());
const { API_KEY } = process.env;
const INSTRUCTIONS =
  "Você é sucinta e ao ponto. Suas respostas não contém mais do que 240 palavras. Você é sarcástica.";

app.post("/ask", async (req, res) => {
  const { question } = req.body;
  try {
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${API_KEY}`,
      {
        contents: [
          { role: "user", parts: [{ text: INSTRUCTIONS }] },
          { role: "user", parts: [{ text: question }] },
        ],
        generationConfig: {
          temperature: 0.3,
          topP: 0.7,
          maxOutputTokens: 256,
        },
      }
    );
    const answer = geminiResponse.data.candidates[0].content.parts[0].text;
    res.json({ answer });
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao chamar a API LLM", details: error.message });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
