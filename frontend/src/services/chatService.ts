import type { SendMessageRequest } from '../types/chat';

const BASE_URL = 'http://localhost:3000';

export class ChatService {
  private static instance: ChatService;
  private eventSource: EventSource | null = null;

  static getInstance(): ChatService {
    if (!ChatService.instance) {
      ChatService.instance = new ChatService();
    }
    return ChatService.instance;
  }

  async sendMessage(request: SendMessageRequest): Promise<void> {
    try {
      const response = await fetch(`${BASE_URL}/chat/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(request),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    } catch (error) {
      console.error('Error sending message:', error);
      throw error;
    }
  }

  connectToEventStream(onMessage: (data: any) => void, onError: (error: Event) => void): void {
    this.eventSource = new EventSource(`${BASE_URL}/chat/events`);

    this.eventSource.onmessage = (event: MessageEvent) => {
      try {
        const data = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error('Error parsing SSE message:', error);
        onError(error as Event);
      }
    };

    this.eventSource.onerror = (err) => {
      console.error('SSE error:', err);
      onError(err);
    };
  }

  disconnect(): void {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}
