// src/components/MessageList.tsx
import React from 'react';
import { PatientThread } from '@/Data/dummyData';
import MessageItem from './MessageItem';

interface MessageListProps {
    threads: PatientThread[];
    onSelectPatient: (patientId: string) => void;
    selectedPatientId: string | null;
}

const MessageList: React.FC<MessageListProps> = ({ threads, onSelectPatient, selectedPatientId }) => {
    return (
        <div className="w-80 border-r bg-white overflow-y-auto">
            <div className="sticky top-0 z-10 bg-white border-b p-4">
                <h2 className="text-xl font-bold text-gray-800">Messages</h2>
                <div className="mt-2 relative">
                    <input
                        type="text"
                        placeholder="Search conversations..."
                        className="w-full pl-8 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <svg
                        className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                        />
                    </svg>
                </div>
            </div>
            <div className="divide-y">
                {threads.map(thread => (
                    <MessageItem
                        key={thread.patientId}
                        thread={thread}
                        onSelectPatient={onSelectPatient}
                        isSelected={thread.patientId === selectedPatientId}
                    />
                ))}
            </div>
        </div>
    );
};

export default MessageList;