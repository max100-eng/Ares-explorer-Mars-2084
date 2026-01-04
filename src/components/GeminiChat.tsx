// /src/components/GeminiChat.tsx
import { useState } from "react";
import { getGeminiResponse } from "../api/geminiClient";

export default function GeminiChat() {
  const [prompt, setPrompt] = useState<string>("");
  const [response, setResponse] = useState<string>("");

  const handleSend = async () => {
    try {
      const output = await getGeminiResponse(prompt);
      setResponse(output);
    } catch (error) {
      console.error("Error al obtener respuesta de Gemini:", error);
    }
  };

  return (
    <div>
      <h2>Gemini Chat</h2>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="Escribe tu pregunta..."
      />

      <button onClick={handleSend}>Enviar</button>

      {response && (
        <div>
          <h3>Respuesta:</h3>
          <p>{response}</p>
        </div>
      )}
    </div>
  );
}
