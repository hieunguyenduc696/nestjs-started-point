import { Expose, Transform } from 'class-transformer';
import { ReportEntity } from '../reports.entity';

export class ReportDto {
  @Expose()
  id: string;

  @Expose()
  price: number;

  @Expose()
  year: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  mileage: number;

  @Expose()
  approved: boolean;

  @Transform(({ obj }: { obj: ReportEntity }) => obj?.user?.id)
  @Expose()
  userId: string;
}
