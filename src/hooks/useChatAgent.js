// src/hooks/useChatAgent.js

import { useState, useCallback } from 'react';
import { genAI } from '../api/geminiClient';
import { roverToolDefinition, llamarMiAPIExterna } from '../api/roverApi';

export const useChatAgent = () => {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const model = 'gemini-2.5-flash';

    const sendMessage = useCallback(async (promptUsuario) => {
        setIsLoading(true);
        const userMessage = { role: "user", text: promptUsuario };
        
        // El historial incluye el mensaje actual y todos los mensajes anteriores
        const conversationHistory = [...messages, userMessage];

        try {
            // --- 1. Primera Llamada: Envío del Prompt y las Herramientas ---
            let response = await genAI.models.generateContent({
                model: model,
                contents: conversationHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
                config: {
                    tools: [roverToolDefinition] // El modelo sabe qué puede hacer
                },
            });

            // --- 2. Detección y Ejecución de la Herramienta (Ciclo de Tool Calling) ---
            if (response.functionCalls && response.functionCalls.length > 0) {
                const call = response.functionCalls[0];
                const args = call.args; 
                
                if (call.name === "getEstadoExploracionMarte") {
                    
                    // Ejecutar la función simulada de la API real
                    const apiResult = await llamarMiAPIExterna(args.roverId || 'Rover ID no especificado');
                    
                    // Agregar el resultado de la función al historial (para la segunda llamada)
                    conversationHistory.push(
                        { role: "function", parts: [{ text: apiResult }], name: "getEstadoExploracionMarte", text: `Función ejecutada: ${apiResult}` }
                    );
                    
                    // --- 3. Segunda Llamada: Generar la Respuesta Final ---
                    const finalResponse = await genAI.models.generateContent({
                        model: model,
                        contents: conversationHistory.map(msg => ({ role: msg.role, parts: [{ text: msg.text }] })),
                    });

                    // Actualizar la UI con el mensaje del usuario y la respuesta final del agente
                    setMessages(prev => [
                        ...prev, 
                        userMessage, 
                        { role: "model", text: finalResponse.text }
                    ]);
                    
                }
            } else {
                // --- 4. Si NO hubo llamada a función, usa la respuesta original ---
                setMessages(prev => [
                    ...prev, 
                    userMessage, 
                    { role: "model", text: response.text }
                ]);
            }

        } catch (error) {
            console.error("Error en la conversación con Gemini:", error);
            setMessages(prev => [
                ...prev, 
                userMessage, 
                { role: "model", text: "❌ Lo siento, ocurrió un error en la conexión o la lógica del agente." }
            ]);
        } finally {
            setIsLoading(false);
        }
    }, [messages]);

    return { messages, isLoading, sendMessage };
};