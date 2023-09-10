import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { BikesModule } from './bikes/bikes.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [ConfigModule.forRoot(), ScheduleModule.forRoot(), BikesModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
