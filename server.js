const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors"); 
const fetch = (...args) => import("node-fetch").then(({ default: fetch }) => fetch(...args));

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/proxy", async (req, res) => {
  const { ApiKey, MethodName } = req.body;

  try {
    const response = await fetch("https://sycret.ru/service/api/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ApiKey: ApiKey || "011ba11bdcad4fa396660c2ec447ef14",
        MethodName: MethodName || "OSGetGoodList",
      }),
    });

    if (!response.ok) {
      return res.status(response.status).json({ error: "Ошибка на стороне API" });
    }

    const result = await response.json();
    res.status(200).json(result); 
  } catch (error) {
    console.error("Ошибка прокси-сервера:", error);
    res.status(500).json({ error: "Ошибка при подключении к API" });
  }
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Прокси-сервер запущен на http://localhost:${PORT}`);
});
