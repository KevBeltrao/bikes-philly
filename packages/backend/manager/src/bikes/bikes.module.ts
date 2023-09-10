import { Module } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { BikesController } from './bikes.controller';
import { BikesRepository } from './bikes.repository';

@Module({
  providers: [BikesService, BikesRepository],
  controllers: [BikesController],
})
export class BikesModule {}
