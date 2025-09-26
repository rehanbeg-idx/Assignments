import { Expose, Transform } from 'class-transformer';
import { IsOptional } from 'class-validator';

export class Report {
  @Expose()
  id: number;

  @Expose()
  @IsOptional()
  approved: boolean;

  @Expose()
  make: string;

  @Expose()
  model: string;

  @Expose()
  year: number;

  @Expose()
  mileage: number;

  @Expose()
  lng: number;

  @Expose()
  lat: number;

  @Expose()
  price: number;

  @Transform(({ obj }) => obj.user.id)
  @Expose()
  userId: number;
}
