/**
 * geminiClient.js
 * Cliente que se comunica con nuestro servidor interno (proxy.js)
 * para proteger la API KEY de Google Gemini.
 */

export const generateContent = async (prompt) => {
  try {
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      let errorData = {};
      try {
        errorData = await response.json();
      } catch {
        // Si la respuesta no es JSON, evitamos que explote
      }
      throw new Error(errorData.details || 'Error en la respuesta del servidor proxy');
    }

    const result = await response.json();

    // Aviso si el proxy está en modo MOCK
    if (result.mock) {
      console.warn("⚠️ Recibiendo respuesta en modo simulación (Mock)");
    }

    // Retornamos los datos en el formato esperado por AnalysisDisplay o Chat
    return result.data;

  } catch (error) {
    console.error('Error en geminiClient:', error);
    throw error;
  }
};

// Actualización forzada: v1.0.1
