import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Inicializamos la API con la variable de entorno de Vercel/Vite
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const preguntarAMarte = async () => {
    if (!pregunta) return;
    setCargando(true);
    setRespuesta("📡 Enviando señal a la base...");

    try {
      // ✅ OPCIÓN A: Usando el identificador más actualizado y compatible
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const text = response.text();
      
      setRespuesta(text);
    } catch (error: any) {
      console.error("Error en la transmisión:", error);
      const isKeyPresent = !!import.meta.env.VITE_GOOGLE_API_KEY;
      
      // Mensaje de error detallado para depuración en pantalla
      setRespuesta(
        `❌ ERROR DE CONEXIÓN: ${error.message}\n\n` +
        `🔍 Detalle: Asegúrate de que la API Key sea válida y que el modelo sea compatible con tu región.\n` +
        `🔑 Key detectada en sistema: ${isKeyPresent ? "SÍ" : "NO"}`
      );
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-5 flex flex-col items-center justify-center font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-extrabold mb-2 tracking-tighter">
          ARES EXPLORER
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-sm">Misión Marte 2084 | Enlace Cuántico</p>
      </header>

      <main className="w-full max-w-xl bg-slate-800 p-8 rounded-2xl border border-slate-700 shadow-2xl">
        <div className="mb-6">
          <label className="block text-orange-300 text-sm font-bold mb-2 uppercase">
            Consulta a la Base
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Ej: ¿Cuál es el estado de la atmósfera en el cráter Jezero?"
            className="w-full p-4 bg-slate-950 rounded-lg text-white border border-slate-700 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-all resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-lg transition-all transform active:scale-95 ${
            cargando 
              ? "bg-slate-700 cursor-not-allowed text-slate-400" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20"
          }`}
        >
          {cargando ? "🛰️ PROCESANDO SEÑAL..." : "ENVIAR TRANSMISIÓN 🚀"}
        </button>

        {respuesta && (
          <section className="mt-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xs font-bold text-slate-500 uppercase mb-2">Respuesta recibida:</h3>
            <div className="p-5 bg-slate-900/80 rounded-lg border-l-4 border-orange-500 shadow-inner">
              <p className="whitespace-pre-wrap leading-relaxed text-slate-200">
                {respuesta}
              </p>
            </div>
          </section>
        )}
      </main>

      <footer className="mt-10 text-slate-500 text-xs">
        Terminal v2.1.0 - Protocolo Gemini 1.5 Flash
      </footer>
    </div>
  );
}

export default App;