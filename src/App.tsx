import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Inicializamos la API
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const preguntarAMarte = async () => {
    if (!pregunta) return;
    setCargando(true);
    setRespuesta("📡 Conectando con el satélite orbital...");

    try {
      // ✅ USAMOS EL MODELO ESTABLE DE LA V1
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const text = response.text();
      
      setRespuesta(text);
    } catch (error: any) {
      console.error("Error de enlace:", error);
      setRespuesta(
        `❌ ERROR DE SISTEMA: ${error.message}\n\n` +
        `Sugerencia: Verifica que el modelo 'gemini-pro' esté habilitado en tu consola de Google AI.`
      );
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-5 flex flex-col items-center justify-center font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-xs mt-2">
          ESTACIÓN BASE MARTE | PROTOCOLO GEMINI-PRO
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-800/50 backdrop-blur-md p-8 rounded-3xl border border-slate-700 shadow-2xl">
        <div className="mb-6">
          <label className="block text-orange-400 text-xs font-bold mb-3 uppercase tracking-widest">
            Consulta Operacional
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Ej: Informe de recursos del sector Alpha..."
            className="w-full p-4 bg-slate-950 rounded-xl text-white border border-slate-700 focus:border-orange-500 outline-none transition-all resize-none"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-xl transition-all ${
            cargando 
              ? "bg-slate-700 text-slate-500 cursor-not-allowed" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg"
          }`}
        >
          {cargando ? "RECIBIENDO DATOS..." : "SOLICITAR INFORME 🚀"}
        </button>

        {respuesta && (
          <section className="mt-8 bg-black/40 p-6 rounded-2xl border-l-4 border-orange-500 animate-in fade-in slide-in-from-top-2">
            <h3 className="text-[10px] font-bold text-orange-500 uppercase mb-2 tracking-widest">Respuesta de la IA:</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-sm">
              {respuesta}
            </p>
          </section>
        )}
      </main>

      <footer className="mt-10 text-slate-600 text-[10px] tracking-widest uppercase">
        Enlace Estable: v1-PRO | Latencia: 3.2s (Simulada)
      </footer>
    </div>
  );
}

export default App;