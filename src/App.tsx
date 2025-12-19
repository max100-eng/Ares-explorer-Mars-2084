import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './App.css';

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Acceso a la API Key configurada en Vercel/Vite
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  async function callGemini() {
    if (!input) return;
    
    setLoading(true);
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(input);
      const text = result.response.text();
      setResponse(text);
    } catch (error) {
      console.error("Error en la comunicación con ARES:", error);
      setResponse("❌ Error: No se pudo establecer conexión con el núcleo de IA. Revisa la API Key.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ares-container">
      <header>
        <h1>ARES EXPLORER v3.2</h1>
        <p>Sistema de Comunicación Interplanetaria</p>
      </header>

      <main>
        <div className="chat-window">
          {response && (
            <div className="response-box">
              <strong>ARES:</strong>
              <p>{response}</p>
            </div>
          )}
        </div>

        <div className="input-area">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Introduce comando o consulta..."
            disabled={loading}
          />
          <button onClick={callGemini} disabled={loading}>
            {loading ? "Transmitiendo..." : "Enviar Transmisión"}
          </button>
        </div>
      </main>

      <footer style={{ marginTop: '20px', fontSize: '0.8rem', opacity: 0.6 }}>
        Estado del Sistema: {API_KEY ? "🟢 Conectado" : "🔴 VITE_GEMINI_API_KEY Faltante"}
      </footer>
    </div>
  );
}

export default App;