/**
 * geminiClient.js
 * Este cliente ahora se comunica con nuestro servidor (proxy.js)
 * en lugar de llamar directamente a Google, protegiendo la API KEY.
 */

export const generateContent = async (prompt) => {
  try {
    // Llamamos a nuestra propia API interna en Vercel
    const response = await fetch('/api/proxy', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.details || 'Error en la respuesta del servidor proxy');
    }

    const result = await response.json();

    // Verificamos si el proxy devolvió datos en modo MOCK o REAL
    if (result.mock) {
      console.warn("⚠️ Recibiendo respuesta en modo simulación (Mock)");
    }

    // Retornamos los datos en el formato que espera tu componente AnalysisDisplay o Chat
    return result.data;

  } catch (error) {
    console.error('Error en geminiClient:', error);
    throw error;
  }
}; // ← ✔️ cierre correcto

// Actualización forzada: v1.0.1

