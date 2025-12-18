import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Usamos el nuevo nombre de la variable para asegurar que refresque el sistema
  const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  const preguntarAMarte = async () => {
    if (!pregunta) return;

    if (!API_KEY) {
      setRespuesta("❌ ERROR DE CONFIGURACIÓN: No se detecta 'VITE_GEMINI_API_KEY' en Vercel.");
      return;
    }

    setCargando(true);
    setRespuesta("📡 ESTABLECIENDO CONEXIÓN CUÁNTICA CON LA BASE ARES...");

    try {
      // Inicializamos la API dentro de la función para mayor seguridad
      const genAI = new GoogleGenerativeAI(API_KEY);
      
      // ✅ CONFIGURACIÓN MAESTRA: Forzamos v1beta para evitar el Error 404
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
      
      // Si el error persiste, damos instrucciones de limpieza
      setRespuesta(
        `❌ ERROR DE TRANSMISIÓN: ${error.message}\n\n` +
        `Acción recomendada: Si el error menciona '/v1/', limpia el caché (Ctrl+F5) o usa una ventana de incógnito.`
      );
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-5 flex flex-col items-center justify-center font-sans selection:bg-orange-500/30">
      
      {/* Encabezado Estilo Terminal */}
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER v3.2
        </h1>
        <p className="text-slate-500 uppercase tracking-[0.3em] text-[10px] mt-2">
          SISTEMA DE COMUNICACIÓN INTERPLANETARIA | PROTOCOLO FLASH
        </p>
      </header>

      {/* Módulo de Comunicación */}
      <main className="w-full max-w-xl bg-slate-900/50 backdrop-blur-xl p-8 rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-orange-500 to-transparent opacity-20"></div>
        
        <div className="mb-6">
          <label className="block text-orange-400 text-[10px] font-bold mb-3 uppercase tracking-widest">
            Entrada de Transmisión
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Escribe tu mensaje para la base en Marte..."
            className="w-full p-4 bg-slate-950/80 rounded-xl text-white border border-slate-800 focus:border-orange-500/50 outline-none transition-all resize-none font-mono text-sm placeholder:text-slate-700"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-xl transition-all tracking-widest uppercase text-sm ${
            cargando 
              ? "bg-slate-800 text-slate-600 cursor-wait" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-[0_0_25px_rgba(234,88,12,0.2)] active:scale-[0.98]"
          }`}
        >
          {cargando ? "📡 Sincronizando..." : "FORZAR CONEXIÓN FINAL 🚀"}
        </button>

        {/* Monitor de Datos de Salida */}
        {respuesta && (
          <section className="mt-8 bg-black/40 p-6 rounded-2xl border-l-2 border-orange-600 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <h3 className="text-[9px] font-bold text-orange-500 uppercase mb-3 tracking-[0.2em] flex items-center gap-2">
              <span className="w-2 h-2 bg-orange-500 rounded-full animate-pulse"></span>
              Respuesta Recibida
            </h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-sm">
              {respuesta}
            </p>
          </section>
        )}
      </main>

      <footer className="mt-10 flex flex-col items-center gap-2">
        <div className="flex gap-4">
          <span className="h-1 w-8 bg-slate-800 rounded-full"></span>
          <span className="h-1 w-8 bg-orange-600 rounded-full"></span>
          <span className="h-1 w-8 bg-slate-800 rounded-full"></span>
        </div>
        <p className="text-slate-700 text-[9px] tracking-[0.5em] uppercase mt-2">
          Terminal Status: Ready | Core: Gemini-Flash-1.5
        </p>
      </footer>
    </div>
  );
}

export default App;