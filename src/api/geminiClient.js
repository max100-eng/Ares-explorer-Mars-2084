const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("VITE_GOOGLE_API_KEY no detectada. Asegúrate de configurarla en Vercel y tu .env.local");
}

export const genAI = new GoogleGenerativeAI(apiKey || 'INVALID_KEY');