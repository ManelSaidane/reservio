import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  SubscribeMessage,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway()
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly maxListeners: number = 20;

  afterInit(server: Server) {
    server.setMaxListeners(this.maxListeners);
  }

  handleConnection(client: Socket) {
    console.log('Client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
    client.removeAllListeners(); // Clean up listeners on disconnect
  }

  @SubscribeMessage('addService')
  handleAddService(@MessageBody() data: any): void {
    console.log('Service added:', data);
    this.server.emit('serviceAdded', data); // Notify all clients
  }

  @SubscribeMessage('updateService')
  handleUpdateService(@MessageBody() data: any): void {
    console.log('Service updated:', data);
    this.server.emit('serviceUpdated', data); // Notify all clients
  }

  @SubscribeMessage('deleteService')
  handleDeleteService(@MessageBody() data: any): void {
    console.log('Service deleted:', data);
    this.server.emit('serviceDeleted', data); // Notify all clients
  }
}
