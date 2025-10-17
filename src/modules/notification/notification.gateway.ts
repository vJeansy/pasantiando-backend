import { WebSocketGateway, WebSocketServer, SubscribeMessage, } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({ cors: true })
export class NotificationGateway {
  @WebSocketServer()
  server: Server;

  sendToUser(userId: string, payload: any) {
    this.server.to(userId).emit('notification', payload);
  }

  @SubscribeMessage('register')
  handleRegister(client: any, userId: string) {
    client.join(userId); // El usuario se une a su propio canal
  }
}