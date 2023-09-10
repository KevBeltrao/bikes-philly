import { Injectable } from '@nestjs/common';
import axios from 'axios';
import { GetBikesDto } from './dtos/bikes.dto';

const url = 'https://bts-status.bicycletransit.workers.dev/phl';

@Injectable()
export class BikesRepository {
  async getBikes() {
    const { data } = await axios.get<GetBikesDto>(url);
    return data;
  }
}
