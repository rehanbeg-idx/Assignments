import { Injectable } from "@nestjs/common";
import { IsString, IsNumber, Min, Max, IsLongitude, IsLatitude } from "class-validator";
import { Type } from "class-transformer";

@Injectable()
export class CreateReportDto{

    @IsString()
    make: string;

    @IsString()
    model: string;

    @Type(() => Number)          
    @IsNumber()
    @Min(1900)
    @Max(2026)
    year: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    @Max(1000000)
    mileage: number;

    @Type(() => Number)
    @IsLongitude()
    lng: number;

    @Type(() => Number)
    @IsLatitude()
    lat: number;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;
}
