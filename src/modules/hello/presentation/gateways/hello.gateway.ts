import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class HelloGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(HelloGateway.name);

  afterInit() {
    this.logger.log('WebSocket Gateway initialized');
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('hello')
  handleHello(
    @MessageBody() data: { name?: string },
    @ConnectedSocket() client: Socket,
  ) {
    const name = data?.name || 'World';
    const message = `Hello, ${name}!`;

    this.logger.log(`Received hello from ${client.id} with name: ${name}`);

    // Send response back to the client
    return {
      event: 'hello_response',
      data: {
        message,
        timestamp: new Date().toISOString(),
      },
    };
  }

  @SubscribeMessage('ping')
  handlePing(@ConnectedSocket() client: Socket) {
    this.logger.log(`Received ping from ${client.id}`);

    return {
      event: 'pong',
      data: {
        timestamp: new Date().toISOString(),
      },
    };
  }

  /**
   * Broadcast a message to all connected clients
   */
  broadcastMessage(event: string, data: unknown) {
    this.server.emit(event, data);
    this.logger.log(`Broadcasted ${event} to all clients`);
  }
}
