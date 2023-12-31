import { Controller, Get } from '@nestjs/common';
import {
  ClientProxy,
  ClientProxyFactory,
  EventPattern,
  Payload,
  Transport,
} from '@nestjs/microservices';
import { Observable } from 'rxjs';
import { GetBikesDto, GetBikesResponseDto } from './dtos/bikes.dto';
import { AppGateway } from './app.gateway';

@Controller()
export class AppController {
  private clientAdminBackend: ClientProxy;

  constructor(private readonly appGateway: AppGateway) {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: 'bikes',
      },
    });
  }

  @Get('bikes')
  getBikes(): Observable<GetBikesDto> {
    return this.clientAdminBackend.send('get-bikes', { data: null });
  }

  @EventPattern('get-bikes-cron')
  async getBikesCron(@Payload() data: GetBikesResponseDto) {
    return this.appGateway.updateBikes(data);
  }
}
