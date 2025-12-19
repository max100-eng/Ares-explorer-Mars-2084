const apiKey = import.meta.env.VITE_GEMINI_API_KEY || import.meta.env.VITE_GOOGLE_API_KEY;

if (!apiKey) {
    console.warn("API KEY no detectada (VITE_GEMINI_API_KEY o VITE_GOOGLE_API_KEY).");
}

export const genAI = new GoogleGenerativeAI(apiKey || 'INVALID_KEY');