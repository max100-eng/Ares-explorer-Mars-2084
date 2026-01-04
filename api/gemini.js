export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { prompt } = req.body;

  if (!prompt) {
    return res.status(400).json({ error: 'Missing prompt' });
  }

  // Aquí iría tu lógica con Gemini
  return res.status(200).json({ response: `Respuesta simulada para: ${prompt}` });
}

