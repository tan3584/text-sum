import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AuditLog } from 'src/entities/audit-log/audit-log.entity';
import { FindManyOptions, Raw, Repository } from 'typeorm';
import { FilterLogRequestDto } from './dto/filter-log-request.dto';
import { AuditLogRepository } from './audit-log.repository';
import { AuditLogResponseDto } from './dto/AuditLogResponse.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly logRepository: Repository<AuditLog>,
    private readonly auditLogRepository: AuditLogRepository,
  ) {}

  async writeLog(
    module: string,
    action: string,
    user: Record<string, any>,
  ): Promise<number> {
    const log = new AuditLog();

    log.userId = user ? user.id : null;

    log.action = action;
    log.module = module;

    const result = await this.logRepository.save(log);

    return result.id;
  }

  async getList(filterOptionsModel: FilterLogRequestDto): Promise<any> {
    const { skip, take, search, userId } = filterOptionsModel;
    const order = {};
    let where = [];

    if (filterOptionsModel.orderBy) {
      order[filterOptionsModel.orderBy] = filterOptionsModel.orderDirection;
    } else {
      (order as any).createdDate = 'DESC';
    }

    if (search) {
      const rawWhere = Raw(
        alias => `LOWER(${alias}) like '%${search.toLowerCase()}%'`,
      );

      where = [{ module: rawWhere }, { action: rawWhere }];
    }

    if (userId) {
      where = where.map(condition => ({ ...condition, userId }));
    }

    const options: FindManyOptions<AuditLog> = {
      where,
      skip,
      take,
      order,
    };
    return await this.logRepository.findAndCount(options);
  }

  async getAuditLogs(
    filterOptionsModel: FilterLogRequestDto,
  ): Promise<[AuditLogResponseDto[], number]> {
    return await this.auditLogRepository.getAuditLogs(filterOptionsModel);
  }
}
