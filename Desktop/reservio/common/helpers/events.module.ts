// events.module.ts
import { Module } from '@nestjs/common';
import { EventsGateway } from './EventsGateway';

@Module({
  providers: [EventsGateway],
  exports: [EventsGateway],
})
export class EventsModule {}
