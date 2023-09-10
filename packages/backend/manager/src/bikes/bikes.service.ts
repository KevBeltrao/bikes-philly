import { Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { BikesRepository } from './bikes.repository';
import { GetBikesResponseDto } from './dtos/bikes.dto';
import {
  ClientProxy,
  ClientProxyFactory,
  Transport,
} from '@nestjs/microservices';

const breakPointCritical = 0.1;
const breakPointWarning = 0.2;

@Injectable()
export class BikesService {
  private clientAdminBackend: ClientProxy;

  constructor(private bikesRepository: BikesRepository) {
    this.clientAdminBackend = ClientProxyFactory.create({
      transport: Transport.RMQ,
      options: {
        urls: [process.env.RABBITMQ_URI],
        queue: 'bikes',
      },
    });
  }

  async getBikes(): Promise<GetBikesResponseDto> {
    const { features: kiosks, last_updated: lastUpdated } =
      await this.bikesRepository.getBikes();

    const featuresByCapacity: GetBikesResponseDto['kiosksData'] = kiosks.reduce(
      (accumulator, current) => {
        const { properties } = current;
        const { totalDocks, bikesAvailable } = properties;

        const bikesAvailablePercentage = bikesAvailable / totalDocks;

        if (bikesAvailablePercentage <= breakPointCritical)
          return {
            ...accumulator,
            critical: [...accumulator.critical, current],
          };

        if (bikesAvailablePercentage <= breakPointWarning)
          return {
            ...accumulator,
            warning: [...accumulator.warning, current],
          };

        return {
          ...accumulator,
          available: [...accumulator.available, current],
        };
      },
      {
        available: [],
        warning: [],
        critical: [],
      },
    );

    return {
      kiosksData: featuresByCapacity,
      lastUpdated,
    };
  }

  @Cron(CronExpression.EVERY_10_SECONDS)
  async handleCron() {
    const result = await this.getBikes();
    this.clientAdminBackend.emit('get-bikes-cron', result);
  }
}
