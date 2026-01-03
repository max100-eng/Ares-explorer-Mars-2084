require('dotenv').config({ path: './.env.local' });
const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

module.exports = async (req, res) => {
  // Configuración de CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar preflight (OPTIONS)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const path = req.url || '';

  // 1. Endpoint de verificación (Ping)
  if (path.includes('/api/ping')) {
    const hasKey = !!(process.env.API_KEY || process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY);
    return res.status(200).json({ 
      ok: true, 
      message: "Proxy activo",
      env_detected: hasKey 
    });
  }

  // 2. Lógica del Proxy para Gemini
  if (path.includes('/api/proxy') || path.includes('/api/gemini')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const body = req.body;
    const prompt = (body && body.prompt) || '';
    
    // Prioridad de llaves
    const apiKey = process.env.API_KEY || 
                   process.env.GEMINI_API_KEY || 
                   process.env.VITE_GEMINI_API_KEY || 
                   process.env.VITE_GOOGLE_API_KEY;

    // Modo MOCK si no hay llave
    if (!apiKey) {
      console.warn("⚠️ No se detectó API_KEY.");
      return res.status(200).json({ 
        ok: true, 
        mock: true, 
        data: {
          candidates: [{
            content: { parts: [{ text: "Modo Simulación: No se encontró la variable API_KEY en Vercel." }] }
          }]
        }
      });
    }

    try {
      // USAMOS v1beta y gemini-1.5-flash para evitar el error 404
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
      
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          contents: [{ parts: [{ text: prompt }] }] 
        })
      });

      if (!r.ok) {
        const errorText = await r.text();
        // Si el error es 404, Google nos dirá por qué en el JSON de respuesta
        throw new Error(`Google API Error: ${r.status} - ${errorText}`);
      }

      const data = await r.json();
      return res.status(200).json({ ok: true, mock: false, data });

    } catch (err) {
      console.error('Proxy Error:', err);
      return res.status(502).json({ error: 'Error en la conexión con la IA', details: err.message });
    }
  }

  res.status(404).json({ error: 'Ruta no encontrada' });
};