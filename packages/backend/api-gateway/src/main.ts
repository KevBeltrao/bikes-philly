import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport } from '@nestjs/microservices';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { ServerOptions } from 'socket.io';

class SocketAdapter extends IoAdapter {
  createIOServer(
    port: number,
    options?: ServerOptions & {
      namespace?: string;
      server?: any;
    },
  ) {
    const server = super.createIOServer(port, { ...options, cors: true });
    return server;
  }
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.connectMicroservice({
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URI],
      queue: 'bikes',
      prefetchCount: 1,
    },
  });
  app.useWebSocketAdapter(new SocketAdapter(app));

  app.enableCors({
    origin: [process.env.CLIENT_URL],
    methods: ['GET'],
    credentials: true,
  });

  await app.startAllMicroservices();
  await app.listen(3000);
}
bootstrap();
