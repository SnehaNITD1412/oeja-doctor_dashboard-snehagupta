// src/components/MessageItem.tsx
import React from 'react';
import { PatientThread } from '../data/dummyData';

interface MessageItemProps {
    thread: PatientThread;
    onSelectPatient: (patientId: string) => void;
    isSelected: boolean;
}

const MessageItem: React.FC<MessageItemProps> = ({ thread, onSelectPatient, isSelected }) => {
    const latestMessage = thread.messages[thread.messages.length - 1];
    const isUnread = latestMessage.sender === 'Patient'; // Example logic for unread status
    const time = new Date(latestMessage.timestamp);
    const now = new Date();
    const isToday = time.toDateString() === now.toDateString();

    const formatTime = () => {
        if (isToday) {
            return time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        return time.toLocaleDateString([], { month: 'short', day: 'numeric' });
    };

    return (
        <div
            className={`p-4 cursor-pointer flex items-start gap-3 hover:bg-gray-50 transition-colors ${
                isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
            }`}
            onClick={() => onSelectPatient(thread.patientId)}
        >
            <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center ${
                isUnread ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
            }`}>
                {thread.patientName.charAt(0)}
            </div>
            <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline gap-2">
                    <h3 className={`text-sm font-medium truncate ${
                        isUnread ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                        {thread.patientName}
                    </h3>
                    <span className="text-xs text-gray-500 whitespace-nowrap">
                        {formatTime()}
                    </span>
                </div>
                <p className={`text-sm truncate ${
                    isUnread ? 'text-gray-900 font-medium' : 'text-gray-500'
                }`}>
                    {latestMessage.text}
                </p>
            </div>
            {isUnread && (
                <div className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full"></div>
            )}
        </div>
    );
};

export default MessageItem;