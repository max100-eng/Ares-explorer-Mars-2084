import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './index.css'; 

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  // Acceso a la clave configurada en Vercel
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY || "");

  async function callGemini() {
    if (!input || !API_KEY) return;
    
    // 1. LIMPIEZA DE MEMORIA: Borramos errores previos antes de la nueva consulta
    setLoading(true);
    setResponse(""); 
    
    try {
      // 2. CONFIGURACIÓN DEL MOTOR: Usamos la versión Flash para mayor velocidad
      const model = genAI.getGenerativeModel({ 
        model: "gemini-1.5-flash" 
      });

      // 3. PERSONALIDAD DE ARES
      const systemPrompt = `Eres ARES, IA de la nave Ares Explorer. 
      Responde de forma técnica, militar y concisa. 
      Confirmación de usuario: ${input}`;
      
      const result = await model.generateContent(systemPrompt);
      const text = result.response.text();
      
      // 4. ACTUALIZACIÓN DE RESPUESTA EXITOSA
      setResponse(text);
      setInput(""); // Limpiamos el input automáticamente
    } catch (error: any) {
      console.error("ERROR DE TRANSMISIÓN:", error);
      
      // Manejo de errores específicos
      if (error.message?.includes("API key not valid")) {
        setResponse("❌ CRÍTICO: La API Key no es válida. Genere una nueva en Google AI Studio.");
      } else {
        setResponse("❌ CRÍTICO: Error de enlace. Reintente la transmisión.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ares-container">
      <header>
        <div className="status-light"></div>
        <h1>ARES EXPLORER v3.2</h1>
        <p>CONSOLA DE COMUNICACIÓN INTERPLANETARIA</p>
      </header>

      <main>
        <div className="chat-window">
          {loading ? (
            <div className="scanning">ANALIZANDO FRECUENCIA...</div>
          ) : (
            <div className="response-box">
              {response && <p className="typing-effect">{response}</p>}
            </div>
          )}
        </div>

        <div className="input-area">
          <span className="cursor">{'>'}</span>
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
        <div className="footer-status">
          <span className={API_KEY ? "online" : "offline"}></span>
          ESTADO: {API_KEY ? "CONECTADO" : "SIN LLAVE API"}
        </div>
        <div className="protocol">PROTOCOLO: FLASH v1.5</div>
      </footer>
    </div>
  );
}

export default App;