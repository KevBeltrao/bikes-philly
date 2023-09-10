import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { AppGateway } from './app.gateway';
import { SocketModule } from './socket/socket.module';

@Module({
  imports: [ConfigModule.forRoot(), SocketModule],
  controllers: [AppController],
  providers: [AppService, AppGateway],
})
export class AppModule {}
