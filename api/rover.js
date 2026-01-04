// /api/rover.js

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  try {
    const NASA_KEY = process.env.NASA_API_KEY;

    if (!NASA_KEY) {
      return res.status(500).json({ error: "Falta NASA_API_KEY en Vercel" });
    }

    const url = `https://api.nasa.gov/mars-photos/api/v1/rovers/curiosity/latest_photos?api_key=${NASA_KEY}`;

    const response = await fetch(url);
    const data = await response.json();

    return res.status(200).json(data);
  } catch (error) {
    console.error("Error en /api/rover:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
}
