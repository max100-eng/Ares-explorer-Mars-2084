import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuración de la API Key y Versión de API
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

// Forzamos la apiVersion 'v1' para evitar el Error 404 de la v1beta
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarPrompt = async () => {
    if (!prompt.trim()) return;
    
    if (!API_KEY) {
      setError("Error: No se encontró la API Key en Vercel (VITE_GEMINI_API_KEY).");
      return;
    }

    setLoading(true);
    setError(null);
    setResponse("");
    
    try {
      // 2. Definimos el modelo forzando la API v1 para máxima compatibilidad
      // Esto soluciona el error 404 en la mayoría de las regiones
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1" } 
      );

      console.log("Iniciando petición a Google Gemini v1...");
      
      const result = await model.generateContent(prompt);
      const data = await result.response;
      const text = data.text();

      setResponse(text);
      console.log("¡Respuesta recibida con éxito (200 OK)!");
    } catch (err: any) {
      console.error("Error en la API:", err);
      
      if (err.message.includes("404")) {
        setError("Error 404: Google no encuentra el modelo en esta región. Intenta cambiar la región de Vercel a 'Washington D.C. (iad1)'.");
      } else if (err.message.includes("403") || err.message.includes("API key")) {
        setError("Error 403: Tu API Key no es válida o no tiene permisos.");
      } else {
        setError("Error: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <header style={{ borderBottom: '2px solid #eee', marginBottom: '30px', paddingBottom: '10px' }}>
        <h1 style={{ color: '#1a73e8', margin: 0 }}>Ares Explorer AI</h1>
        <p style={{ color: '#666' }}>Conectado a Gemini 1.5 Flash (API v1)</p>
      </header>
      
      <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
        <textarea
          style={{ 
            width: '100%', 
            height: '150px', 
            padding: '15px', 
            borderRadius: '12px',
            border: '1px solid #ddd',
            fontSize: '16px',
            boxSizing: 'border-box'
          }}
          placeholder="Escribe tu mensaje aquí..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={ejecutarPrompt}
          disabled={loading}
          style={{
            padding: '15px',
            backgroundColor: loading ? '#ccc' : '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '18px',
            fontWeight: '600',
            transition: 'background 0.3s'
          }}
        >
          {loading ? "Procesando con IA..." : "Enviar a Gemini"}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '25px', 
          color: '#b71c1c', 
          backgroundColor: '#ffebee', 
          padding: '20px', 
          borderRadius: '10px',
          border: '1px solid #ffcdd2'
        }}>
          <strong>⚠️ Atención:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#fff', 
          padding: '25px', 
          borderRadius: '15px', 
          border: '1px solid #e0e0e0',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginTop: 0, color: '#1a73e8' }}>Resultado:</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.7', color: '#333' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;