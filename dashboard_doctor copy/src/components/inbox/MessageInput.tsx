// src/components/MessageInput.tsx
import React, { useState } from 'react';

interface MessageInputProps {
  patientId: string;
  onSendMessage?: (text: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ patientId, onSendMessage }) => {
  const [inputValue, setInputValue] = useState('');

  const handleSend = () => {
    if (inputValue.trim()) {
      onSendMessage?.(inputValue);
      setInputValue('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="p-4 border-t bg-white">
      <div className="flex items-end gap-2">
        <div className="flex-1 bg-gray-50 rounded-lg">
          <textarea
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyDown={handleKeyDown}
            className="w-full p-3 bg-transparent focus:outline-none resize-none max-h-32"
            placeholder="Type your message..."
            rows={1}
          />
        </div>
        <button 
          onClick={handleSend}
          disabled={!inputValue.trim()}
          className={`p-3 rounded-full ${inputValue.trim() ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-400'} transition-colors`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 1.414L10.586 9H7a1 1 0 100 2h3.586l-1.293 1.293a1 1 0 101.414 1.414l3-3a1 1 0 000-1.414z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
      <p className="text-xs text-gray-500 mt-1">
        Press Enter to send, Shift+Enter for new line
      </p>
    </div>
  );
};

export default MessageInput;