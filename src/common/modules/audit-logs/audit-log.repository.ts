import { Repository, EntityRepository } from 'typeorm';
import { AuditLog } from 'src/entities/audit-log/audit-log.entity';
import { FilterLogRequestDto } from './dto/filter-log-request.dto';
import { User } from 'src/entities/user/user.entity';
import { AuditLogResponseDto } from './dto/AuditLogResponse.dto';

@EntityRepository(AuditLog)
export class AuditLogRepository extends Repository<AuditLog> {
  async getAuditLogs(
    filterOptionsModel: FilterLogRequestDto,
  ): Promise<[AuditLogResponseDto[], number]> {
    const { skip, take } = filterOptionsModel;

    const [result, count] = await this.createQueryBuilder('audit-log')
      .skip(skip)
      .take(take)
      .leftJoinAndMapOne(
        'audit-log.createdBy',
        User,
        'u',
        'u.id = audit-log.userId',
      )
      .orderBy('audit-log.id', 'DESC')
      .select()
      .getManyAndCount();

    const newResult = result.map(r => new AuditLogResponseDto(r));
    return [newResult, count];
  }
}
