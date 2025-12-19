import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './index.css'; 

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Vercel inyecta la variable durante el despliegue
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY || "");

  async function callGemini() {
    if (!input) return;
    
    // Si no hay API_KEY, notificamos antes de intentar la conexión
    if (!API_KEY) {
      setResponse("❌ SISTEMA OFFLINE: Falta VITE_GEMINI_API_KEY en Vercel.");
      return;
    }

    setLoading(true);
    setResponse(""); // Limpiamos pantalla para nueva transmisión
    
    try {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });

      const systemPrompt = `Eres ARES, la IA de combate y exploración de la nave Ares Explorer. 
      Tus respuestas son breves, militares y técnicas. Confirmación de mando: ${input}`;
      
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      
      setResponse(text);
      setInput(""); // Limpiamos el campo de entrada
    } catch (error: any) {
      console.error("Fallo de enlace:", error);
      setResponse("❌ CRÍTICO: Error de autenticación o cuota excedida.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ares-container">
      <header>
        <div className={`status-led ${API_KEY ? 'led-on' : 'led-off'}`}></div>
        <h1>ARES EXPLORER v3.2</h1>
        <p>CONSOLA DE COMUNICACIÓN INTERPLANETARIA</p>
      </header>

      <main>
        <div className="chat-window">
          {loading ? (
            <div className="scanning">ENCRIPTANDO SEÑAL...</div>
          ) : (
            <div className="response-box">
              {response && <p className="ares-text">{response}</p>}
            </div>
          )}
        </div>

        <div className="input-area">
          <span className="prompt">{'>'}</span>
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && callGemini()}
            placeholder="Ingrese comando de misión..."
            disabled={loading}
          />
          <button onClick={callGemini} disabled={loading || !input}>
            {loading ? "..." : "EJECUTAR"}
          </button>
        </div>
      </main>

      <footer>
        <div className="status-bar">
          ESTADO: <span className={API_KEY ? "online-txt" : "offline-txt"}>
            {API_KEY ? "SISTEMA ONLINE" : "SISTEMA OFFLINE"}
          </span>
        </div>
        <div className="protocol-tag">NÚCLEO: GEMINI 1.5 FLASH</div>
      </footer>
    </div>
  );
}

export default App;