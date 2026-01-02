import { GoogleGenerativeAI } from "@google/generative-ai";

// Configuración de la API Key desde las variables de entorno de Vercel
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY || "");

export async function analyzeClinicalImage(imageBuffer: Buffer, mimeType: string, specialty: string) {
  // Usamos el modelo Flash que es el más rápido para análisis de imágenes
  const model = genAI.getGenerativeModel({ 
    model: "gemini-1.5-flash",
    generationConfig: {
        temperature: 0.2, // Temperatura baja para mayor precisión médica
        topP: 1,
        maxOutputTokens: 2048,
    }
  });

  // Configuración de prompts por especialidad
  let prompt = "";
  
  if (specialty === "EKG") {
    prompt = `Actúa como Cardiólogo experto. Analiza la imagen de EKG y responde con esta estructura:
    1. Frecuencia cardiaca (lpm).
    2. Análisis del ritmo.
    3. Valoración PR (ms).
    4. Valoración QT (ms).
    5. Eje Eléctrico.
    6. Segmento ST.
    7. Otras Alteraciones.
    Finaliza con una sección de "Diagnóstico Codificado" breve.`;
  } else if (specialty === "Radiología") {
    prompt = "Actúa como Radiólogo. Analiza la imagen (RX/CT) describiendo hallazgos óseos, espacios articulares y tejidos blandos.";
  } else if (specialty === "Dermatoscopia") {
    prompt = "Actúa como Dermatólogo. Analiza la lesión cutánea usando la regla ABCD (Asimetría, Borde, Color, Diámetro).";
  } else if (specialty === "Retina") {
    prompt = "Actúa como Oftalmólogo. Describe la papila, mácula y vascularización de la retina.";
  } else {
    prompt = "Realiza un análisis clínico detallado de esta imagen médica.";
  }

  const imageParts = [
    {
      inlineData: {
        data: imageBuffer.toString("base64"),
        mimeType
      },
    },
  ];

  // Generación del contenido
  const result = await model.generateContentStream([prompt, ...imageParts]);

  /** * CORRECCIÓN DEL ERROR DE VERCEL:
   * Cambiamos toDataStreamResponse (que no existe en este tipo) 
   * por una respuesta de texto compatible con el streaming.
   **/
  return result.stream; 
}