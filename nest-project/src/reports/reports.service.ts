import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Reports } from './reports.entity';
import { CreateReportDto } from './dtos/create-report.dto';
import { Users } from 'src/users/users.entity';
import { GetEstimateDto } from './dtos/get-estimate.dto';

@Injectable()
export class ReportsService {
  constructor(@InjectRepository(Reports) private repo: Repository<Reports>) {}

  createEstimate(estimateDto: GetEstimateDto) {
    return this.repo.createQueryBuilder().select('*').getRawMany();
  }

  create(reportDto: CreateReportDto, user: Users) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  findAll() {
    return this.repo.find();
  }

  async update(id: number, attrs: Partial<Reports>) {
    const report = await this.repo.findOneBy({ id });
    if (!report) {
      throw new BadRequestException('Report not found');
    }
    Object.assign(report, attrs);
    return this.repo.save(report);
  }
}
