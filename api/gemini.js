export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { prompt } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Missing prompt' });
    }

    // Respuesta temporal para probar que funciona
    return res.status(200).json({
      message: `Recibido correctamente: ${prompt}`
    });

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
