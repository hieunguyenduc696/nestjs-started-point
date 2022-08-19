import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { AdminGuard, AuthGuard, CurrentUser, Serialize } from 'common';
import { UserEntity } from 'users';
import {
  ApproveReportDto,
  CreateReportDto,
  GetEstimateDto,
  ReportDto,
} from './dto';
import { ReportsService } from './reports.service';

@Serialize(ReportDto)
@Controller('reports')
export class ReportsController {
  constructor(private reportsService: ReportsService) {}

  @Get()
  getEstimate(@Query() query: GetEstimateDto) {
    return this.reportsService.createEstimate(query);
  }

  @Get()
  getReports() {
    return this.reportsService.findAll();
  }

  @Patch(':id')
  @UseGuards(AdminGuard)
  approveReport(@Param('id') id: string, @Body() body: ApproveReportDto) {
    return this.reportsService.approveReport(id, body);
  }

  @Post()
  @UseGuards(AuthGuard)
  createReport(
    @CurrentUser() user: UserEntity,
    @Body() createReportDto: CreateReportDto,
  ) {
    return this.reportsService.create(user, createReportDto);
  }
}
