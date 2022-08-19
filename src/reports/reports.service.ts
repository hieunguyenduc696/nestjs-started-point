import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UserEntity } from 'users';
import { ApproveReportDto, CreateReportDto, GetEstimateDto } from './dto';
import { ReportEntity } from './reports.entity';

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(ReportEntity) private repo: Repository<ReportEntity>,
  ) {}

  async createEstimate({
    make,
    model,
    lng,
    lat,
    year,
    mileage,
  }: GetEstimateDto) {
    return await this.repo
      .createQueryBuilder()
      .select('AVG(price)', 'price')
      .where('make = :make', { make })
      .andWhere('model = :model', { model })
      .andWhere('lng - :lng BETWEEN -5 AND 5', { lng })
      .andWhere('lat - :lat BETWEEN -5 AND 5', { lat })
      .andWhere('year - :year BETWEEN -3 AND 3', { year })
      .orderBy('ABS(mileage - :mileage)', 'DESC')
      .setParameters({ mileage })
      .limit(3)
      .getRawOne();
  }

  async findAll() {
    return await this.repo.find({
      relations: {
        user: true,
      },
    });
  }

  async findOne(id: string) {
    return await this.repo.findOne({ where: { id } });
  }

  async approveReport(id: string, body: ApproveReportDto) {
    const report = await this.findOne(id);

    if (!report) {
      throw new NotFoundException(`Report with id: ${id} not found!`);
    }

    report.approved = body.approve;

    await this.repo.save(report);
    return;
  }

  async create(user: UserEntity, createReportDto: CreateReportDto) {
    const reports = await this.repo.create(createReportDto);

    reports.user = user;

    const result = await this.repo.save(reports);

    return { id: result.id };
  }
}
