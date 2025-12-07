const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

module.exports = async (req, res) => {
  // Configuración de CORS para permitir que tu frontend hable con este backend
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Manejar la solicitud OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  const { method, url } = req;
  const path = req.url || '';

  // 1. Endpoint de prueba (Ping)
  if (path.includes('/api/ping')) {
    return res.status(200).json({ ok: true, env: !!process.env.GEMINI_API_KEY });
  }

  // 2. Endpoint principal (Gemini)
  if (path.includes('/api/gemini')) {
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    
    const body = req.body;
    const prompt = (body && body.prompt) || '';
    
    // Busca la llave en las variables de entorno de Vercel
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_KEY || process.env.VITE_GOOGLE_API_KEY;

    // Si no hay llave, usamos el modo MOCK (Simulación)
    if (!apiKey) {
      console.warn("⚠️ No se encontró API KEY. Usando modo simulación.");
      return res.status(200).json({ 
        ok: true, 
        mock: true, 
        data: {
          candidates: [{
            content: { parts: [{ text: "Modo Simulación: No se detectó la API Key en Vercel. Por favor configura la variable GEMINI_API_KEY en los ajustes del proyecto." }] }
          }]
        }
      });
    }

    try {
      // --- AQUI ESTABA EL ERROR: AHORA USAMOS LA URL REAL DE GOOGLE ---
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`;
      
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        // Google requiere un formato específico: { contents: [{ parts: [{ text }] }] }
        body: JSON.stringify({ 
          contents: [{ 
            parts: [{ text: prompt }] 
          }] 
        })
      });

      if (!r.ok) {
        const errorData = await r.text();
        throw new Error(`Google API Error: ${r.status} - ${errorData}`);
      }

      const data = await r.json();
      return res.status(200).json({ ok: true, mock: false, data });

    } catch (err) {
      console.error('Proxy error:', err);
      return res.status(502).json({ error: 'Error conectando con Google Gemini', details: err.message });
    }
  }

  res.status(404).json({ error: 'Not found' });
};