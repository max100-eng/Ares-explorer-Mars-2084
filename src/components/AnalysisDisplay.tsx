import { AnalysisResult } from '../types';

interface Props {
  result: AnalysisResult;
}

export default function AnalysisDisplay({ result }: Props) {
  const urgencyColors = {
    BAJA: 'bg-green-500/20 text-green-400 border-green-500/50',
    MEDIA: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/50',
    ALTA: 'bg-orange-500/20 text-orange-400 border-orange-500/50',
    CRÍTICA: 'bg-red-500/20 text-red-400 border-red-500/50',
  };

  return (
    <div className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className={`p-4 rounded-xl border-2 ${urgencyColors[result.urgency]}`}>
        <div className="flex justify-between items-center">
          <span className="text-sm font-bold uppercase tracking-wider">Nivel de Urgencia</span>
          <span className="text-lg font-black">{result.urgency}</span>
        </div>
      </div>

      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 shadow-xl">
        <h3 className="text-blue-400 font-bold text-xl mb-2">Diagnóstico Preliminar</h3>
        <p className="text-white text-lg leading-relaxed">{result.diagnosis}</p>
        
        <hr className="my-4 border-slate-700" />
        
        <h4 className="text-slate-400 font-bold mb-2">Detalles Técnicos</h4>
        <p className="text-slate-300 text-sm leading-relaxed">{result.details}</p>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
          <h4 className="text-green-400 font-bold mb-3">Recomendaciones</h4>
          <ul className="space-y-2">
            {result.recommendations.map((rec, i) => (
              <li key={i} className="flex items-start text-slate-300 text-sm">
                <span className="mr-2">•</span> {rec}
              </li>
            ))}
          </ul>
        </div>

        {result.technicalMetrics && (
          <div className="bg-slate-800 border border-slate-700 rounded-xl p-6">
            <h4 className="text-purple-400 font-bold mb-3">Métricas Técnicas</h4>
            <div className="space-y-2">
              {Object.entries(result.technicalMetrics).map(([key, val]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-slate-500 capitalize">{key}:</span>
                  <span className="text-slate-300 font-mono">{val}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}