// src/components/ChatInterface.jsx

import React, { useState } from 'react';
import { useChatAgent } from '../hooks/useChatAgent';

const ChatInterface = () => {
    const [input, setInput] = useState('');
    const { messages, isLoading, sendMessage } = useChatAgent();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim() && !isLoading) {
            sendMessage(input);
            setInput('');
        }
    };

    return (
        <div className="chat-container">
            <h1>🤖 IA Mars 2084 - Ares Explorer</h1>
            
            <div className="messages-display">
                {messages.length === 0 && (
                    <p>¡Hola! Pregúntame sobre el estado de los rovers. Por ejemplo: "¿Cuál es la batería de Perseverance?"</p>
                )}
                {messages.map((msg, index) => (
                    <div key={index} className={`message ${msg.role}`}>
                        <strong>{msg.role === 'user' ? 'Tú' : 'Agente'}:</strong> {msg.text}
                    </div>
                ))}
                {isLoading && <div className="loading">Cargando respuesta...</div>}
            </div>

            <form onSubmit={handleSubmit} className="input-form">
                <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder="Enviar Mensaje 🚀"
                    disabled={isLoading}
                />
                <button type="submit" disabled={isLoading}>
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default ChatInterface;