import React from 'react';
import type { Message as MessageType } from '../../types/chat';
import './Message.css';

interface MessageProps {
  message: MessageType;
}

export const Message: React.FC<MessageProps> = ({ message }) => {
  const isUser = message.from === 'user';
  
  return (
    <div className={`message ${isUser ? 'message--user' : 'message--bot'}`}>
      <div className={`message__bubble ${isUser ? 'message__bubble--user' : 'message__bubble--bot'}`}>
        <p className="message__text">{message.text}</p>
        {message.timestamp && (
          <span className="message__timestamp">
            {message.timestamp.toLocaleTimeString('es-ES', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </span>
        )}
      </div>
    </div>
  );
};
