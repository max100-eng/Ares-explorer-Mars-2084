const fetch = (...args) => import('node-fetch').then(({default: f}) => f(...args));

module.exports = async (req, res) => {
  // Simple proxy serverless for Vercel
  const { method, url, headers } = req;
  const path = req.url || '';

  if (path.startsWith('/api/ping')) {
    return res.status(200).json({ ok: true, env: !!process.env.GEMINI_API_KEY });
  }

  if (path.startsWith('/api/gemini')) {
    // Expect POST with { prompt }
    if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
    const body = req.body;
    const prompt = (body && body.prompt) || '';
    const apiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_KEY || process.env.VITE_GOOGLE_API_KEY;

    // If the request explicitly asks for a mock or there's no API key, return a deterministic mock response
    const useMock = !!(req.query && req.query.mock) || !apiKey;
    if (useMock) {
      // Create a realistic mock response similar to what an LLM API might return
      const mock = {
        id: `mock-${Date.now()}`,
        model: 'gemini-mock-1',
        prompt: prompt,
        output: {
          text: `Mock response for prompt: ${prompt}\n\nResumen:\n- This is a simulated itinerary suggestion for demonstration purposes.\n- Replace with real Gemini/LLM response when API key is configured.`
        },
        usage: {
          prompt_tokens: Math.min(50, Math.max(1, Math.floor(prompt.length / 4))),
          completion_tokens: 64,
          total_tokens: Math.min(200, Math.floor(prompt.length / 4) + 64)
        },
        timestamp: Date.now()
      };

      return res.status(200).json({ ok: true, mock: true, data: mock });
    }

    try {
      // Forward to a real upstream Gemini (placeholder URL). Replace with your provider's endpoint.
      const apiUrl = 'https://api.example-gemini.com/v1/generate';
      const r = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({ prompt })
      });

      const data = await r.json();
      return res.status(200).json({ ok: true, mock: false, data });
    } catch (err) {
      console.error('Proxy error:', err);
      return res.status(502).json({ error: 'Upstream request failed' });
    }
  }

  res.status(404).json({ error: 'Not found' });
};
