import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuración de la API Key usando variables de entorno de Vite
// Esto leerá el valor que configuraste en Vercel como VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarPrompt = async () => {
    if (!prompt.trim()) return;
    if (!API_KEY) {
      setError("Error: No se encontró la API Key. Configura VITE_GEMINI_API_KEY en Vercel.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 2. Usamos el modelo más reciente para evitar errores 404
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      console.log("Generando respuesta...");
      
      // 3. Llamada al método generateContent
      const result = await model.generateContent(prompt);
      const data = await result.response;
      const text = data.text();

      setResponse(text);
    } catch (err: any) {
      console.error("Error detectado:", err.message);
      setError(err.message.includes("404") 
        ? "Error 404: El modelo no está disponible o la versión de la API es incorrecta." 
        : "Error al conectar con Gemini: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', maxWidth: '600px', margin: 'auto' }}>
      <h1>Gemini AI Assistant</h1>
      
      <div style={{ marginBottom: '20px' }}>
        <textarea
          style={{ width: '100%', height: '100px', padding: '10px' }}
          placeholder="Escribe tu pregunta aquí..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button 
          onClick={ejecutarPrompt}
          disabled={loading}
          style={{
            marginTop: '10px',
            padding: '10px 20px',
            backgroundColor: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer'
          }}
        >
          {loading ? "Generando..." : "Enviar a Gemini"}
        </button>
      </div>

      {error && (
        <div style={{ color: 'red', backgroundColor: '#fee', padding: '10px', borderRadius: '5px', marginBottom: '20px' }}>
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ backgroundColor: '#f4f4f4', padding: '20px', borderRadius: '5px', borderLeft: '5px solid #007bff' }}>
          <h3>Respuesta de Gemini:</h3>
          <p style={{ whiteSpace: 'pre-wrap' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;