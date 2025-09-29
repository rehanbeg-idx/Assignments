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

  createEstimate({make, model, lng, lat, year, mileage} : GetEstimateDto) {
    return this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('year - :year BETWEEN -3 AND 3', {year})
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({mileage})
      .limit(3)
      .getRawOne();
  }

  create(reportDto: CreateReportDto, user: Users) {
    const report = this.repo.create(reportDto);
    report.user = user;
    return this.repo.save(report);
  }

  findAll(user : Users) {
    
    if(user.admin){
      return this.repo.find({relations:['user']})
    }
    else{
      return this.repo.find({where :{user:{id: user.id}},relations:['user']})
    }
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
