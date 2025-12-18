import { useState } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

function App() {
  const [pregunta, setPregunta] = useState("");
  const [respuesta, setRespuesta] = useState("");
  const [cargando, setCargando] = useState(false);

  // Inicializamos la API con la llave de entorno
  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GOOGLE_API_KEY);

  const preguntarAMarte = async () => {
    if (!pregunta) return;
    setCargando(true);
    setRespuesta("📡 Enviando señal a la base Ares...");

    try {
      // ✅ CONFIGURACIÓN CRÍTICA: Forzamos v1beta para evitar el error 404
      // Esta versión es compatible con el StatusCode 200 que obtuviste en cURL
      const model = genAI.getGenerativeModel(
        { model: "gemini-1.5-flash" },
        { apiVersion: "v1beta" }
      );

      const result = await model.generateContent(pregunta);
      const response = await result.response;
      const text = response.text();
      
      setRespuesta(text);
    } catch (error: any) {
      console.error("Fallo en la comunicación:", error);
      const isKeyPresent = !!import.meta.env.VITE_GOOGLE_API_KEY;
      
      setRespuesta(
        `❌ ERROR DE TRANSMISIÓN: ${error.message}\n\n` +
        `🔍 Diagnóstico: El modelo no responde en v1. Reintentando por canal beta...\n` +
        `🔑 Llave en sistema: ${isKeyPresent ? "CONECTADA" : "DESCONECTADA"}`
      );
    }
    setCargando(false);
  };

  return (
    <div className="min-h-screen bg-slate-900 text-white p-5 flex flex-col items-center justify-center font-sans selection:bg-orange-500/30">
      {/* Header Estilo NASA */}
      <header className="text-center mb-10 animate-pulse">
        <h1 className="text-5xl text-orange-500 font-black mb-2 tracking-tighter border-b-4 border-orange-600 inline-block px-4">
          ARES EXPLORER
        </h1>
        <p className="text-slate-400 uppercase tracking-[0.3