import { Module } from '@nestjs/common';
import { ChatbotService } from './chat.service';
import { ChatController } from './chat.controller';
import { KafkaService } from './kafka.service';

@Module({
  controllers: [ChatController],
  providers: [ChatbotService, KafkaService],
})
export class ChatModule {}
