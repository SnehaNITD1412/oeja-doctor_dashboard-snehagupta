// src/components/Inbox.tsx
import React, { useState } from 'react';
import { dummyData, PatientThread } from '@/Data/dummyData';
import MessageList from './MessageList';
import MessageView from './MessageView';
import MessageInput from './MessageInput';

const Inbox: React.FC = () => {
    const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
    const [threads] = useState<PatientThread[]>(dummyData);

    const handleSelectPatient = (patientId: string) => {
        setSelectedPatientId(patientId);
    };

    return (
        <div className="flex h-[calc(100vh-80px)] bg-gray-50 rounded-lg shadow-sm overflow-hidden">
            <MessageList 
                threads={threads} 
                onSelectPatient={handleSelectPatient} 
                selectedPatientId={selectedPatientId}
            />
            <div className="flex-1 flex flex-col">
                {selectedPatientId ? (
                    <>
                        <MessageView patientId={selectedPatientId} threads={threads} />
                        <MessageInput patientId={selectedPatientId} />
                    </>
                ) : (
                    <div className="flex-1 flex flex-col items-center justify-center bg-white p-8 text-center">
                        <svg
                            className="w-16 h-16 text-gray-400 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1.5}
                                d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                            />
                        </svg>
                        <h3 className="text-lg font-medium text-gray-900 mb-2">No conversation selected</h3>
                        <p className="text-gray-500 max-w-md">
                            Select a patient from the sidebar to view and send messages
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Inbox;