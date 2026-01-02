import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarPrompt = async () => {
    if (!prompt.trim() || !API_KEY) return;

    setLoading(true);
    setError(null);
    
    try {
      // CAMBIO CLAVE: Usamos 'gemini-pro', el modelo con mayor compatibilidad global
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(prompt);
      const data = await result.response;
      const text = data.text();

      setResponse(text);
    } catch (err: any) {
      console.error("Error:", err.message);
      // Si falla el Pro, es definitivamente un tema de la API KEY o de la Región en Vercel
      setError("Error de conexión: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: 'auto' }}>
      <h1>Ares Explorer (Stable Mode)</h1>
      <textarea 
        style={{ width: '100%', height: '100px' }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Escribe aquí..."
      />
      <button onClick={ejecutarPrompt} disabled={loading} style={{ display: 'block', marginTop: '10px' }}>
        {loading ? "Cargando..." : "Enviar a Gemini Pro"}
      </button>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {response && <div style={{ marginTop: '20px', background: '#f0f0f0', padding: '15px' }}>{response}</div>}
    </div>
  );
}

export default App;