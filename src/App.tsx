import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);



  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const preguntarAMarte = async () => {
    if (!pregunta) return;
    setCargando(true);
    setRespuesta("📡 Enviando señal a la base...");

    try {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const text = response.text();
      setRespuesta(text);
    } catch (error: any) {
      console.error(error);
      const isKeyPresent = !!import.meta.env.VITE_GOOGLE_API_KEY;
      setRespuesta(`❌ ERROR: ${error.message}\n\n🔑 Key detected: ${isKeyPresent ? "YES" : "NO"}`);
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-5 flex flex-col items-center justify-center">
      <h1 className="text-4xl text-orange-500 font-bold mb-8">🤖 IA Mars 2084</h1>

      <div className="w-full max-w-lg bg-slate-800 p-6 rounded-xl border border-slate-700">
        <textarea
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          placeholder="Ej: ¿Cómo es el clima en Marte hoy?"
          className="w-full p-3 bg-slate-900 rounded text-white mb-4 border border-slate-600 outline-none"
          rows={3}
        />

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className="w-full bg-orange-600 hover:bg-orange-500 font-bold py-3 rounded transition-all"
        >
          {cargando ? "Recibiendo transmisión..." : "Enviar Mensaje 🚀"}
        </button>

        {respuesta && (
          <div className="mt-6 p-4 bg-black/50 rounded border-l-4 border-orange-500">
            <p className="whitespace-pre-wrap">{respuesta}</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default App;