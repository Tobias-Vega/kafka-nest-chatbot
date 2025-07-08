// chatbot.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka, Consumer, Producer } from 'kafkajs';

@Injectable()
export class ChatbotService implements OnModuleInit {
  private kafka = new Kafka({ brokers: ['localhost:9092'] });
  private consumer: Consumer;
  private producer: Producer;

  async onModuleInit() {
    this.consumer = this.kafka.consumer({ groupId: 'chatbot-group' });
    this.producer = this.kafka.producer();

    await this.consumer.connect();
    await this.producer.connect();

    await this.consumer.subscribe({ topic: 'chat-messages', fromBeginning: false });

    await this.consumer.run({
      eachMessage: async ({ message }) => {
        if (!message.value) return;
        const payload = JSON.parse(message.value.toString());
        const reply = await this.processMessage(payload.message);

        // Enviar respuesta al topic ia-responses
        await this.producer.send({
          topic: 'ia-responses',
          messages: [{ value: JSON.stringify({ userId: payload.userId, reply }) }],
        });
      },
    });
  }

  private async processMessage(message: string): Promise<string> {
    // Aquí podés integrar tu IA, por ahora demo:
    return `Echo IA: ${message}`;
  }
}
