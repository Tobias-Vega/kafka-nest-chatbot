// kafka.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Producer, Consumer } from 'kafkajs';
import { Subject, Observable } from 'rxjs';

@Injectable()
export class KafkaService implements OnModuleInit {
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private producer: Producer;
  private consumer: Consumer;

  // Subject para emitir respuestas al ChatController
  private responseSubject = new Subject<{ userId: string; reply: string }>();

  onResponse(): Observable<{ userId: string; reply: string }> {
    return this.responseSubject.asObservable();
  }

  async onModuleInit() {
    // Producer (envía mensajes de usuario a chat-messages)
    this.producer = this.kafka.producer();
    await this.producer.connect();

    // Consumer para recibir las respuestas del chatbot
    this.consumer = this.kafka.consumer({ groupId: 'response-group' });
    await this.consumer.connect();
    await this.consumer.subscribe({ topic: 'chatbot-responses', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const { userId, reply } = JSON.parse(message.value.toString());
        // repaso al subject para que ChatController lo exponga via SSE
        this.responseSubject.next({ userId, reply });
      },
    });
  }

  async sendMessage(payload: { userId: string; message: string }) {
    await this.producer.send({
      topic: 'chat-messages',
      messages: [{ value: JSON.stringify(payload) }],
    });
  }
}
