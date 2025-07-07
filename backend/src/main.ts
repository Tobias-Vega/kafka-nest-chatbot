// main.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  // 1) Arranco el app HTTP normal
  const app = await NestFactory.create(AppModule);
  app.enableCors();                  // si lo necesitas
  await app.listen(3000);            // arranco HTTP en el puerto 3000
  console.log('HTTP server listening on port 3000');

  // 2) Conecto el microservicio Kafka al mismo app
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.KAFKA,
    options: {
      client: { brokers: ['localhost:9092'] },
      consumer: { groupId: 'nestjs-consumer' },
    },
  });

  // 3) Arranco TODOS los microservicios conectados (Kafka)
  await app.startAllMicroservices();
  console.log('Kafka microservice is listening...');
}

bootstrap();
