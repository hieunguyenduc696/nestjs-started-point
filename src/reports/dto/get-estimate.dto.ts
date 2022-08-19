import {
  IsLatitude,
  IsLongitude,
  IsNumber,
  IsString,
  Max,
  Min,
} from 'class-validator';
import { ToFloat, ToInteger } from 'common';

export class GetEstimateDto {
  @IsString()
  make: string;

  @IsString()
  model: string;

  @ToInteger()
  @IsNumber()
  @Min(1930)
  @Max(2050)
  year: number;

  @ToInteger()
  @IsNumber()
  @Min(0)
  @Max(1000000)
  mileage: number;

  @ToFloat()
  @IsLongitude()
  lng: number;

  @ToFloat()
  @IsLatitude()
  lat: number;
}
