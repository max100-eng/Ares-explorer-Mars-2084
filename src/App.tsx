import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

// Definimos la API KEY con una aserción de tipo para TypeScript
const API_KEY = (import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY) as string;

function App() {
  const [pregunta, setPregunta] = useState<string>("");
  const [respuesta, setRespuesta] = useState<string>("");
  const [cargando, setCargando] = useState<boolean>(false);

  const preguntarAMarte = async () => {
    if (!pregunta) return;

    if (!API_KEY) {
      setRespuesta("❌ ERROR: No se detecta la API KEY en el entorno.");
      return;
    }

    setCargando(true);
    setRespuesta("📡 ESTABLECIENDO CONEXIÓN CUÁNTICA CON LA BASE ARES...");

    try {
      const genAI = new GoogleGenerativeAI(API_KEY);
      // Forzamos v1beta para asegurar compatibilidad con modelos flash
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" }
      );

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const text = response.text();
      
      setRespuesta(text);
    } catch (error: any) {
      console.error("Fallo de transmisión:", error);
      setRespuesta(`❌ ERROR DE TRANSMISIÓN: ${error.message}`);
    } finally {
      setCargando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 flex flex-col items-center justify-center font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER v3.2
        </h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] mt-2">
          SISTEMA DE COMUNICACIÓN INTERPLANETARIA
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative">
        <div className="mb-6">
          <label className="block text-orange-400 text-[10px] font-bold mb-3 uppercase tracking-widest">
            Entrada de Transmisión
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Escribe tu mensaje para la base en Marte..."
            className="w-full p-4 bg-slate-950/80 rounded-xl text-white border border-slate-800 focus:border-orange-500/50 outline-none transition-all resize-none font-mono text-sm"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-xl transition-all tracking-widest uppercase text-sm ${
            cargando 
              ? "bg-slate-800 text-slate-600 cursor-wait" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_25px_rgba(234,88,12,0.2)]"
          }`}
        >
          {cargando ? "📡 Sincronizando..." : "ENVIAR A MARTE 🚀"}
        </button>

        {respuesta && (
          <section className="mt-8 bg-black/40 p-6 rounded-2xl border-l-2 border-orange-600">
            <h3 className="text-[9px] font-bold text-orange-500 uppercase mb-3 tracking-[0.2em]">
              Respuesta Recibida
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-sm">
              {respuesta}
            </p>
          </section>
        )}
      </main>
    </div>
  );
}

export default App;