// src/api/roverApi.js

// La función que ejecuta la acción real
export async function llamarMiAPIExterna(roverId) {
    // Aquí es donde realizarías la llamada a tu backend/API REST:
    // const response = await fetch(`/api/status?rover=${roverId}`);
    // const data = await response.json();
    // return JSON.stringify(data);

    // --- SIMULACIÓN DE DATOS DE MARTE ---
    await new Promise(resolve => setTimeout(resolve, 500)); // Simula latencia
    
    const id = roverId ? roverId.toLowerCase() : '';

    if (id === 'perseverance') {
        return JSON.stringify({
            estado: "Operacional",
            ubicacion: "Cráter Jezero, cerca del delta del río.",
            bateria_porcentaje: 92,
            ultima_actualizacion: new Date().toISOString()
        });
    } else if (id === 'curiosity') {
        return JSON.stringify({
            estado: "Operacional (Modo de bajo consumo)",
            ubicacion: "Monte Sharp, cerca del borde del cráter Gale.",
            bateria_porcentaje: 78,
            ultima_actualizacion: new Date().toISOString()
        });
    } else {
        return JSON.stringify({
            error: `Rover '${roverId}' no encontrado. Intente con 'Perseverance' o 'Curiosity'.`
        });
    }
}


// Definición formal de la herramienta para Gemini (Formato JSON)
export const roverToolDefinition = {
    functionDeclarations: [
        {
            name: "getEstadoExploracionMarte",
            description: "Obtiene el estado actual, ubicación y el nivel de batería de un rover específico de la misión Ares-Explorer en Marte.",
            parameters: {
                type: "OBJECT",
                properties: {
                    roverId: {
                        type: "STRING",
                        description: "El ID específico del rover para la consulta (ej. 'Perseverance' o 'Curiosity')."
                    }
                },
                required: ["roverId"],
            },
        },
    ],
};