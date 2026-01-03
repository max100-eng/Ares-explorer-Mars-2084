const { GoogleGenerativeAI } = require("@google/generative-ai");

module.exports = async (req, res) => {
  if (!req.body?.prompt || typeof req.body.prompt !== "string") {
    return res.status(400).json({ error: "El campo 'prompt' es obligatorio y debe ser texto" });
  }

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({
      error: "API KEY no configurada",
      mock: true,
      data: "⚠️ Respuesta simulada: falta GEMINI_API_KEY"
    });
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent(req.body.prompt);
    const text = result.response.text();

    return res.status(200).json({
      mock: false,
      data: text
    });

  } catch (error) {
    console.error("Error en proxy.js:", error);

    return res.status(500).json({
      error: "Error interno en el servidor proxy",
      details: error.message,
      mock: true,
      data: "⚠️ Respuesta simulada por error interno"
    });
  }
};


