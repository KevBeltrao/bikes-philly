import { GetBikesResponseDto } from './dtos/bikes.dto';
import {
  WebSocketGateway,
  OnGatewayInit,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets';
import { Logger } from '@nestjs/common';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket/socket.service';

@WebSocketGateway(0, {
  cors: {
    credentials: true,
    methods: ['GET', 'POST'],
    origin: [process.env.CLIENT_URL],
  },
})
export class AppGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private socketService: SocketService) {}

  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('AppGateway');

  afterInit(server: Server) {
    this.socketService.socket = server;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`);
  }

  updateBikes(data: GetBikesResponseDto) {
    this.socketService.socket.emit('update-bikes', data);
  }
}
