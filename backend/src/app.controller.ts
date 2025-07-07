import { Controller } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';

@Controller()
export class AppController {
  @MessagePattern('test-topic')
  handleKafkaMessage(@Payload() message: any) {
    console.log('📩 Mensaje recibido de Kafka:', message.value);
  }
}
