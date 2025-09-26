import { Controller, Get, Patch, Post, Body, Param, Query } from '@nestjs/common';
import { CreateReportDto } from './dtos/create-report.dto';
import { ReportsService } from './reports.service';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/gurads/auth.guard';
import { CurrentUser } from 'src/users/decorators/current-user.decorator';
import { Users } from 'src/users/users.entity';
import { Report } from './dtos/report.dto';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { AdminGuard } from 'src/gurads/admin.guard';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
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
  findReport() {
    return this.reportsService.findAll();
  }

  @Patch('/:id')
  updateReport(@Param('id') id: number, @Body() body: CreateReportDto) {
    return this.reportsService.update(id, body);
  }
}
