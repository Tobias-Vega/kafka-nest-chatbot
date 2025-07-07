import { useState, useEffect, useRef } from 'react';
import type { Message, ChatResponse } from '../types/chat';
import { ChatService } from '../services/chatService';

export const useChat = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const chatService = useRef(ChatService.getInstance());

  useEffect(() => {
    const service = chatService.current;
    
    const handleMessage = (data: ChatResponse) => {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot' as const,
          text: data.reply,
          timestamp: new Date(),
          id: Date.now().toString(),
        },
      ]);
      setIsLoading(false);
    };

    const handleError = (error: Event) => {
      console.error('Chat connection error:', error);
      setError('Connection error. Please try again.');
      setIsLoading(false);
    };

    service.connectToEventStream(handleMessage, handleError);

    return () => {
      service.disconnect();
    };
  }, []);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      from: 'user',
      text,
      timestamp: new Date(),
      id: Date.now().toString(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      await chatService.current.sendMessage({
        userId: 'user1',
        message: text,
      });
    } catch (error) {
      console.error('Error sending message:', error);
      setError('Failed to send message. Please try again.');
      setIsLoading(false);
    }
  };

  const clearMessages = () => {
    setMessages([]);
    setError(null);
  };

  return {
    messages,
    isLoading,
    error,
    sendMessage,
    clearMessages,
  };
};
