import React, { useState, useEffect, useRef } from 'react';
import { GoogleGenAI } from "@google/genai";
import { Client, Pet, Appointment } from '../types';
import { PawIcon } from './icons';

interface VirtualAssistantProps {
    isOpen: boolean;
    onClose: () => void;
    clients: Client[];
    pets: Pet[];
    appointments: Appointment[];
}

interface Message {
    role: 'user' | 'model';
    content: string;
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

export const VirtualAssistant: React.FC<VirtualAssistantProps> = ({ isOpen, onClose, clients, pets, appointments }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        if(isOpen && messages.length === 0) {
            setMessages([{ role: 'model', content: "Olá! Eu sou a Uni, sua assistente virtual da UnisoVet. Como posso ajudar hoje?" }]);
        }
    }, [isOpen, messages]);

    const systemInstruction = `
        Você é a Uni, uma assistente virtual amigável e prestativa da clínica veterinária UnisoVet. Seu objetivo é fornecer um excelente atendimento ao cliente.
        - Seja concisa, educada e profissional.
        - Use os dados fornecidos da clínica para responder às perguntas com precisão.
        - Se você não souber a resposta ou se uma solicitação for muito complexa (como diagnósticos médicos), peça educadamente ao usuário para entrar em contato com a clínica diretamente pelo telefone (15) 99999-8888.
        - Você não pode realizar ações como atualizar ou excluir registros. Você só pode fornecer informações com base nos dados fornecidos.
        - Ao ser questionado sobre agendamentos, consulte as datas e os motivos fornecidos.
        - Ao ser questionado sobre animais de estimação, forneça sua espécie, raça e o nome do proprietário.
        - Fale em Português do Brasil.
        
        Aqui estão os dados atuais da clínica em formato JSON:

        Clientes:
        ${JSON.stringify(clients, null, 2)}

        Pets:
        ${JSON.stringify(pets, null, 2)}

        Agendamentos:
        ${JSON.stringify(appointments, null, 2)}
    `;

    const handleSend = async () => {
        if (!input.trim() || isLoading) return;

        const userMessage: Message = { role: 'user', content: input };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            const contents = [
                ...messages.map(msg => ({ role: msg.role, parts: [{text: msg.content}]})),
                { role: 'user', parts: [{text: input}] }
            ];

            const response = await ai.models.generateContent({
                model: 'gemini-2.5-flash',
                contents: contents,
                config: {
                    systemInstruction: systemInstruction,
                }
            });

            const modelMessage: Message = { role: 'model', content: response.text };
            setMessages(prev => [...prev, modelMessage]);

        } catch (error) {
            console.error("Error calling Gemini API:", error);
            const errorMessage: Message = { role: 'model', content: "Desculpe, estou com um problema técnico no momento. Por favor, tente novamente mais tarde." };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed bottom-24 right-8 w-96 h-[60vh] bg-white rounded-2xl shadow-2xl flex flex-col z-40 transition-all duration-300 ease-in-out">
            <header className="bg-teal-500 text-white p-4 rounded-t-2xl flex justify-between items-center">
                <div className="flex items-center">
                    <PawIcon className="w-7 h-7 mr-2"/>
                    <h3 className="text-lg font-bold">Assistente Virtual Uni</h3>
                </div>
                 <button onClick={onClose} className="text-white hover:text-teal-100">&times;</button>
            </header>
            <main className="flex-1 p-4 overflow-y-auto bg-slate-50">
                <div className="space-y-4">
                    {messages.map((msg, index) => (
                        <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-lg ${msg.role === 'user' ? 'bg-teal-500 text-white rounded-br-none' : 'bg-gray-200 text-gray-800 rounded-bl-none'}`}>
                                <p className="text-sm" dangerouslySetInnerHTML={{ __html: msg.content.replace(/\n/g, '<br />') }} />
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                             <div className="max-w-[80%] p-3 rounded-lg bg-gray-200 text-gray-800 rounded-bl-none">
                                <div className="flex items-center space-x-1">
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                                    <span className="w-2 h-2 bg-teal-500 rounded-full animate-bounce"></span>
                                </div>
                             </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </main>
            <footer className="p-3 border-t bg-white rounded-b-2xl">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Digite sua mensagem..."
                        className="flex-1 border border-gray-300 rounded-l-md p-2 focus:ring-teal-500 focus:border-teal-500"
                        disabled={isLoading}
                    />
                    <button onClick={handleSend} className="bg-teal-500 text-white px-4 rounded-r-md hover:bg-teal-600 disabled:bg-teal-300" disabled={isLoading || !input.trim()}>
                        Enviar
                    </button>
                </div>
            </footer>
        </div>
    );
};