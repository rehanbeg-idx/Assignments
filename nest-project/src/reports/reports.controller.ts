import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Users } from 'src/users/users.entity';
import { Report } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { GetEstimateDto } from './dtos/get-estimate.dto';
import { UpdateReportDto } from './dtos/update-report.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get('/estimate')
  getEstimate(@Query() query : GetEstimateDto){
    return this.reportsService.createEstimate(query);
  }

  @Post()
  @UseGuards(AuthGuard)
  @Serialize(Report)
  createReport(@Body() body: CreateReportDto, @CurrentUser() user: Users) {
    return this.reportsService.create(body, user);
  }

  @Get()
  findReport(@CurrentUser() users : Users) {
    return this.reportsService.findAll(users);
  }

  @Patch('/:id')
  updateReport(@Param('id') id: number, @Body() body: UpdateReportDto) {
    return this.reportsService.update(id, body);
  }
}
