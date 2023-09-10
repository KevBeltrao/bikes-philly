import { Controller } from '@nestjs/common';
import { BikesService } from './bikes.service';
import { GetBikesResponseDto } from './dtos/bikes.dto';
import { MessagePattern } from '@nestjs/microservices';

@Controller('bikes')
export class BikesController {
  constructor(private readonly bikesService: BikesService) {}

  @MessagePattern('get-bikes')
  getBikes(): Promise<GetBikesResponseDto> {
    return this.bikesService.getBikes();
  }
}
