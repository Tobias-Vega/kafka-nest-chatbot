import React from 'react';
import { useChat } from '../../hooks/useChat';
import { MessageList } from './MessageList';
import { ChatInput } from './ChatInput';
import './Chat.css';

export const Chat: React.FC = () => {
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat();

  return (
    <div className="chat">
      <div className="chat__header">
        <div className="chat__header-content">
          <h1 className="chat__title">
            <span className="chat__title-icon">🤖</span>
            Chat con IA
          </h1>
          <div className="chat__header-actions">
            <button
              onClick={clearMessages}
              className="chat__clear-button"
              disabled={messages.length === 0}
              title="Limpiar conversación"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M3 6H21L19 20H5L3 6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M8 6V4C8 3.44772 8.44772 3 9 3H15C15.5523 3 16 3.44772 16 4V6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        <div className="chat__status">
          <div className="chat__status-indicator"></div>
          <span className="chat__status-text">Conectado</span>
        </div>
      </div>

      {error && (
        <div className="chat__error">
          <div className="chat__error-content">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="8" x2="12" y2="12" stroke="currentColor" strokeWidth="2"/>
              <line x1="12" y1="16" x2="12.01" y2="16" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      <MessageList messages={messages} isLoading={isLoading} />
      <ChatInput onSendMessage={sendMessage} isLoading={isLoading} />
    </div>
  );
};
