const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 3001;
const API_URL = "http://universities.hipolabs.com/search?country=Peru";

app.use(cors());

// Caché simple en memoria (10 minutos) para no golpear la API externa cada vez
let cache = null;
let cacheTime = 0;
const CACHE_MS = 10 * 60 * 1000;

app.get("/api/universities", async (req, res) => {
  try {
    if (!cache || Date.now() - cacheTime > CACHE_MS) {
      const response = await fetch(API_URL);
      if (!response.ok) throw new Error(`API externa respondió ${response.status}`);
      cache = await response.json();
      cacheTime = Date.now();
    }

    // Filtro opcional por nombre: /api/universities?q=lima
    const q = (req.query.q || "").toLowerCase().trim();
    const data = q
      ? cache.filter((u) => u.name.toLowerCase().includes(q))
      : cache;

    res.json(data);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ error: "No se pudo obtener la lista de universidades" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`);
})