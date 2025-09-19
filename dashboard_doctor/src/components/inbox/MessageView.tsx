// src/components/MessageView.tsx
import React from 'react';
import { PatientThread } from '@/Data/dummyData';

interface MessageViewProps {
    patientId: string;
    threads: PatientThread[];
}

const MessageView: React.FC<MessageViewProps> = ({ patientId, threads }) => {
    const thread = threads.find(t => t.patientId === patientId);

    if (!thread) return null;

    const formatTime = (timestamp: string) => {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
            <div className="sticky top-0 bg-gray-50 py-2 mb-4 border-b">
                <h3 className="text-lg font-semibold text-gray-800">{thread.patientName}</h3>
                <p className="text-sm text-gray-500">Patient ID: {thread.patientId}</p>
            </div>
            <div className="space-y-4">
                {thread.messages.map(message => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === 'Doctor' ? 'justify-end' : 'justify-start'}`}
                    >
                        <div
                            className={`max-w-xs md:max-w-md lg:max-w-lg px-4 py-2 rounded-lg ${
                                message.sender === 'Doctor'
                                    ? 'bg-blue-500 text-white rounded-br-none'
                                    : 'bg-white border border-gray-200 rounded-bl-none'
                            }`}
                        >
                            <div className="text-sm">{message.text}</div>
                            <div
                                className={`text-xs mt-1 ${
                                    message.sender === 'Doctor' ? 'text-blue-100' : 'text-gray-500'
                                }`}
                            >
                                {formatTime(message.timestamp)}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default MessageView;