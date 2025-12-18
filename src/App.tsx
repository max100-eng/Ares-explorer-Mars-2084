import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Inicialización con la variable de entorno de Vercel
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const preguntarAMarte = async () => {
    if (!pregunta) return;

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      setRespuesta("❌ ERROR: No se detecta la API KEY. Revisa Vercel Settings.");
      return;
    }

    setCargando(true);
    setRespuesta("📡 CONECTANDO CON BASE ARES V3.0 (FORZANDO V1BETA)...");

    try {
      // ✅ CONFIGURACIÓN TOTAL: Forzamos el modelo y la versión v1beta explícitamente
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" } 
      );

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      setRespuesta(response.text());

    } catch (error: any) {
      console.error("Error de red:", error);
      // Este mensaje te confirmará en pantalla si el navegador sigue usando la ruta vieja
      setRespuesta(`❌ FALLO DE ENLACE: ${error.message}. Verifica en consola (F12) si la URL dice v1 o v1beta.`);
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-black text-white p-5 flex flex-col items-center justify-center font-sans">
      <header className="text-center mb-10">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER v3.0 FINAL
        </h1>
        <p className="text-slate-400 uppercase tracking-widest text-xs mt-2">
          SISTEMA DE COMUNICACIÓN CUÁNTICA | RE-BUILD TOTAL
        </p>
      </header>

      <main className="w-full max-w-xl bg-slate-900/80 p-8 rounded-3xl border border-orange-900/30 shadow-[0_0_50px_rgba(234,88,12,0.1)]">
        <div className="mb-6">
          <label className="block text-orange-400 text-xs font-bold mb-3 uppercase tracking-widest">
            Mensaje para Marte
          </label>
          <textarea
            value={pregunta}
            onChange={(e) => setPregunta(e.target.value)}
            placeholder="Escribe aquí tu transmisión..."
            className="w-full p-4 bg-black rounded-xl text-white border border-slate-800 focus:border-orange-500 outline-none transition-all resize-none font-mono"
            rows={4}
          />
        </div>

        <button
          onClick={preguntarAMarte}
          disabled={cargando}
          className={`w-full font-bold py-4 rounded-xl transition-all tracking-widest ${
            cargando 
              ? "bg-slate-800 text-slate-500 cursor-not-allowed" 
              : "bg-orange-600 hover:bg-orange-500 text-white shadow-lg shadow-orange-900/20"
          }`}
        >
          {cargando ? "ENVIANDO SEÑAL..." : "CONECTAR CON MARTE AHORA 🚀"}
        </button>

        {respuesta && (
          <section className="mt-8 bg-black/60 p-6 rounded-2xl border-l-4 border-orange-600">
            <h3 className="text-[10px] font-bold text-orange-500 uppercase mb-2">Respuesta Recibida:</h3>
            <p className="whitespace-pre-wrap leading-relaxed text-slate-300 font-mono text-sm">
              {respuesta}
            </p>
          </section>
        )}
      </main>

      <footer className="mt-10 text-slate-700 text-[10px] tracking-[0.3em] uppercase">
        Hardware: Terminal Ares-1 | Protocol: Gemini-Flash-v1beta
      </footer>
    </div>
  );
}

export default App;