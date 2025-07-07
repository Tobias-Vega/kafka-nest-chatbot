// app.service.ts
import { Injectable, OnModuleInit } from '@nestjs/common';
import { Kafka } from 'kafkajs';

@Injectable()
export class AppService implements OnModuleInit {
  private kafka = new Kafka({
    brokers: ['localhost:9092'],
  });

  async onModuleInit() {
    const producer = this.kafka.producer();
    await producer.connect();

    await producer.send({
      topic: 'test-topic',
      messages: [{ value: 'Hola desde NestJS Kafka!' }],
    });

    console.log('Mensaje enviado al topic test-topic');
  }
}
