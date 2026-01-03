import React, { useState } from 'react';
import { generateContent } from '../api/geminiClient';

const AnalysisDisplay: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;

    setLoading(true);
    setError(null);
    setResponse('');

    try {
      // Llamamos al cliente que ahora usa el proxy /api/proxy
      const data = await generateContent(prompt);
      
      // Extraemos el texto de la respuesta siguiendo la estructura de Google Gemini
      const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || 'No se recibió respuesta.';
      
      setResponse(aiText);
    } catch (err: any) {
      console.error('Error en el análisis:', err);
      setError(err.message || 'Hubo un error al conectar con la IA');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 max-w-2xl mx-auto bg-white rounded-xl shadow-md space-y-4">
      <h2 className="text-xl font-bold text-gray-800">Análisis con Gemini 1.5 Flash</h2>
      
      <textarea
        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
        rows={4}
        placeholder="Escribe tu consulta médica o técnica aquí..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={handleAnalyze}
        disabled={loading || !prompt.trim()}
        className={`w-full py-2 px-4 rounded-lg font-semibold text-white transition-colors ${
          loading ? 'bg-gray-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
        }`}
      >
        {loading ? 'Analizando...' : 'Enviar a Gemini Pro'}
      </button>

      {error && (
        <div className="p-3 bg-red-100 text-red-700 rounded-lg border border-red-200">
          <strong>Error:</strong> {error}
        </div>
      )}

      {response && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h3 className="text-sm font-semibold text-gray-500 uppercase mb-2">Resultado:</h3>
          <div className="text-gray-800 whitespace-pre-wrap leading-relaxed">
            {response}
          </div>
        </div>
      )}
    </div>
  );
};

export default AnalysisDisplay;