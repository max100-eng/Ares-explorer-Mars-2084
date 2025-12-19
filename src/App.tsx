import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css'; // Asegúrate de que el CSS de terminal esté aquí

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // 1. Configuración de la IA con la variable de entorno de Vite
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  async function callGemini() {
    if (!input) return;
    
    setLoading(true);
    setResponse(""); // Limpiar respuesta anterior
    
    try {
      // 2. Definición del modelo con Instrucciones de Sistema (Personalidad Militar)
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash", // Versión rápida y eficiente
      });

      // Prompt con personalidad forzada
      const systemPrompt = `Eres ARES, el sistema de inteligencia artificial de la nave Ares Explorer. 
      Responde de forma técnica, militar y concisa. 
      Usa frases como 'Recibido', 'Transmisión establecida' o 'Sistemas nominales'.
      Consulta del explorador: ${input}`;
      
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      
      setResponse(text);
    } catch (error) {
      console.error("ERROR DE TRANSMISIÓN:", error);
      setResponse("❌ CRÍTICO: Error en el enlace ascendente. Verifique VITE_GEMINI_API_KEY en Vercel.");
    } finally {
      setLoading(false);
    }
  }

  // 3. Interfaz de Usuario (Terminal de Comando)
  return (
    <div className="ares-container">
      <header>
        <h1>ARES EXPLORER v3.2</h1>
        <p>CONSOLA DE COMUNICACIÓN INTERPLANETARIA</p>
      </header>

      <main>
        <div className="chat-window">
          {loading ? (
            <div className="scanning">ANALIZANDO SEÑAL...</div>
          ) : (
            response && (
              <div className="response-box">
                <p style={{ color: '#00ff41', marginBottom: '5px' }}>{'>'} RESPUESTA RECIBIDA:</p>
                <p>{response}</p>
              </div>
            )
          )}
        </div>

        <div className="input-area">
          <span style={{ marginRight: '10px' }}>{'>'}</span>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && callGemini()}
            placeholder="Ingrese comando de misión..."
            disabled={loading}
          />
          <button onClick={callGemini} disabled={loading}>
            {loading ? "..." : "EJECUTAR"}
          </button>
        </div>
      </main>

      <footer style={{ marginTop: '20px', fontSize: '0.7rem', color: '#666' }}>
        ESTADO: {API_KEY ? "ONLINE" : "OFFLINE (Falta API Key)"} | PROTOCOLO: FLASH v1.5
      </footer>
    </div>
  );
}

export default App;