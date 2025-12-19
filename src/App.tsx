import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import './index.css'; // CAMBIADO: Antes decía App.css y causaba error

function App() {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const genAI = new GoogleGenerativeAI(API_KEY);

  async function callGemini() {
    if (!input) return;
    setLoading(true);
    setResponse(""); 
    
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const systemPrompt = `Eres ARES, IA de la nave Ares Explorer. Responde de forma técnica, militar y concisa. Usuario: ${input}`;
      
      const result = await model.generateContent(systemPrompt);
      setResponse(result.response.text());
    } catch (error) {
      console.error("ERROR:", error);
      setResponse("❌ CRÍTICO: Error de enlace. Revisa la API Key en Vercel.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="ares-container">
      <header>
        <h1>ARES EXPLORER v3.2</h1>
        <p>CONSOLA DE COMUNICACIÓN INTERPLANETARIA</p>
      </header>
      <main>
        <div className="chat-window">
          {loading ? <div className="scanning">ANALIZANDO...</div> : <p>{response}</p>}
        </div>
        <div className="input-area">
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && callGemini()}
            placeholder="Comando de misión..." 
          />
          <button onClick={callGemini} disabled={loading}>EJECUTAR</button>
        </div>
      </main>
      <footer style={{ marginTop: '20px', fontSize: '0.7rem', opacity: 0.5 }}>
        ESTADO: {API_KEY ? "CONECTADO" : "SIN LLAVE API"}
      </footer>
    </div>
  );
}

export default App;