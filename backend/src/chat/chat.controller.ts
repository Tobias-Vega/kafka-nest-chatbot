// chat.controller.ts
import { Controller, Post, Body, Sse } from '@nestjs/common';
import { KafkaService } from './kafka.service';
import { Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

@Controller('chat')
export class ChatController {
  private responseStream = new Subject<{ userId: string; reply: string }>();

  constructor(private readonly kafkaService: KafkaService) {
    // Aquí suscribo el stream de respuestas de KafkaService
    this.kafkaService.onResponse().subscribe((resp) => {
      this.responseStream.next(resp);
    });
  }

  @Post('send')
  async sendMessage(@Body() body: { userId: string; message: string }) {
    await this.kafkaService.sendMessage(body);
    return { status: 'mensaje enviado' };
  }

  @Sse('events')
  sse(): Observable<{ data: string }> {
    return this.responseStream.asObservable().pipe(
      map((data) => ({ data: JSON.stringify(data) })),
    );
  }
}
