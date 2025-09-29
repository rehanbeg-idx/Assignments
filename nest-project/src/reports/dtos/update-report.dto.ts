import { CreateReportDto } from "./create-report.dto";
import { IsBoolean, IsOptional} from "class-validator";
import { Type } from "class-transformer";
import { PartialType } from '@nestjs/mapped-types';

export class UpdateReportDto extends PartialType(CreateReportDto){
    @IsOptional()
    @Type(() => Boolean)
    @IsBoolean()
    approved ?: boolean;
}