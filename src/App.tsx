import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Intentamos obtener la nueva variable para romper el caché de configuración
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const preguntarAMarte = async () => {
    if (!pregunta) return;

    if (!API_KEY) {
      setRespuesta("❌ ERROR: No se detecta VITE_GEMINI_API_KEY. Configúrala en Vercel y haz Redeploy.");
      return;
    }

    setCargando(true);
    setRespuesta("📡 TRANSMITIENDO VÍA PROTOCOLO v1beta...");

    try {
      // Forzamos la inicialización dentro de la función para asegurar frescura
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // CONFIGURACIÓN CRÍTICA: Forzamos el modelo y la versión de API
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" }
      );

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      setRespuesta(response.text());

    } catch (error: any) {
      console.error("Fallo en la comunicación:", error);
      
      // Si el error sigue mencionando /v1/, el navegador te está engañando con caché antiguo
      setRespuesta(
        `❌ ERROR DE ENLACE: ${error.message}\n\n` +
        `Si ves '/v1/' arriba, por favor presiona Ctrl+F5 o usa Incógnito.`
      );
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-5 flex flex-col items-center justify-center font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER v3.1
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-xs mt-2">
          SISTEMA DE COMUNICACIÓN DE EMERGENCIA | PROTOCOLO GEMINI-FLASH
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-900/40 p-8 rounded-3xl border border-orange-900/20 shadow-2xl backdrop-blur-sm">
        <div className="mb-6">
          <label className="block text-orange-400 text-xs font-bold mb-3 uppercase tracking-widest">
            Transmisión de Datos
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="¿Estado de los paneles solares en el Sector 4?"
            className="w-full p-4 bg-black/50 rounded-xl text-white border border-slate-700 focus:border-orange-500 outline-none transition-all resize-none font-mono"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-xl transition-all tracking-[0.2em] ${
            cargando 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_20px_rgba(234,88,12,0.3)]"
          }`}
        >
          {cargando ? "ENVIANDO SEÑAL..." : "FORZAR CONEXIÓN FINAL 🚀"}
        </button>

        {respuesta && (
          <section className="mt-8 bg-orange-950/20 p-6 rounded-2xl border-l-4 border-orange-500 animate-pulse-slow">
            <h3 className="text-[10px] font-bold text-orange-500 uppercase mb-2 tracking-widest">Respuesta Recibida:</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-sm">
              {respuesta}
            </p>
          </section>
        )}
      </main>

      <footer className="mt-10 text-slate-700 text-[9px] tracking-[0.4em] uppercase">
        Ares System v3.1 | Build: Forced-v1beta | Model: Flash-1.5
      </footer>
    </div>
  );
}

export default App;