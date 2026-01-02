import React, { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// 1. Configuración de la API Key
// Importante: Asegúrate de que en Vercel la variable se llame exactamente VITE_GEMINI_API_KEY
const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const genAI = new GoogleGenerativeAI(API_KEY);

function App() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const ejecutarPrompt = async () => {
    if (!prompt.trim()) return;
    
    // Verificación de la llave antes de llamar a la API
    if (!API_KEY || API_KEY === "") {
      setError("Error: No se encontró la API Key. Verifica las Environment Variables en Vercel.");
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      // 2. Cambio a modelo estándar para evitar Error 404
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

      console.log("Conectando con Gemini...");
      
      // 3. Ejecución de la consulta
      const result = await model.generateContent(prompt);
      const data = await result.response;
      const text = data.text();

      setResponse(text);
    } catch (err: any) {
      console.error("Error en la petición:", err.message);
      
      // Manejo específico del error 404 y otros
      if (err.message.includes("404")) {
        setError("Error 404: El modelo 'gemini-1.5-flash' no fue encontrado o la región no tiene acceso.");
      } else if (err.message.includes("API key")) {
        setError("Error de autenticación: La API Key es inválida o ha expirado.");
      } else {
        setError("Error inesperado: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '40px', fontFamily: 'system-ui, sans-serif', maxWidth: '800px', margin: 'auto' }}>
      <h1 style={{ color: '#1a73e8' }}>Ares Explorer - AI Assistant</h1>
      <p>Prueba de conexión con Google Gemini 1.5</p>
      
      <div style={{ marginTop: '20px' }}>
        <textarea
          style={{ 
            width: '100%', 
            height: '120px', 
            padding: '12px', 
            borderRadius: '8px',
            border: '1px solid #ccc',
            fontSize: '16px'
          }}
          placeholder="Hazle una pregunta a la IA..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        
        <button 
          onClick={ejecutarPrompt}
          disabled={loading}
          style={{
            marginTop: '15px',
            padding: '12px 24px',
            backgroundColor: loading ? '#aaa' : '#1a73e8',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          {loading ? "Generando respuesta..." : "Enviar a Gemini"}
        </button>
      </div>

      {error && (
        <div style={{ 
          marginTop: '20px', 
          color: '#d93025', 
          backgroundColor: '#fce8e6', 
          padding: '15px', 
          borderRadius: '8px',
          border: '1px solid #f5c2c7'
        }}>
          <strong>Aviso:</strong> {error}
        </div>
      )}

      {response && (
        <div style={{ 
          marginTop: '30px', 
          backgroundColor: '#f8f9fa', 
          padding: '25px', 
          borderRadius: '12px', 
          border: '1px solid #e0e0e0',
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h3 style={{ marginTop: 0, color: '#3c4043' }}>Respuesta:</h3>
          <p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6', color: '#202124' }}>{response}</p>
        </div>
      )}
    </div>
  );
}

export default App;