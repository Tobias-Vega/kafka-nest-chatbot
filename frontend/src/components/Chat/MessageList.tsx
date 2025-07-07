import React, { useEffect, useRef } from 'react';
import type { Message as MessageType } from '../../types/chat';
import { Message } from './Message';
import './MessageList.css';

interface MessageListProps {
  messages: MessageType[];
  isLoading: boolean;
}

export const MessageList: React.FC<MessageListProps> = ({ messages, isLoading }) => {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      <div className="message-list__content">
        {messages.length === 0 && (
          <div className="message-list__empty">
            <div className="message-list__empty-icon">💬</div>
            <h3>¡Hola! ¿En qué puedo ayudarte?</h3>
            <p>Envía un mensaje para comenzar la conversación</p>
          </div>
        )}
        
        {messages.map((message) => (
          <Message key={message.id || Date.now()} message={message} />
        ))}
        
        {isLoading && (
          <div className="message message--bot">
            <div className="message__bubble message__bubble--bot">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};
