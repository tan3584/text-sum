import { Exclude, Expose } from 'class-transformer';
import { User } from 'src/entities/user/user.entity';

export class AuditLogResponseDto {
  id: number;
  action: string;
  module: string;
  content: string;
  createdDate: Date;

  @Exclude()
  createdBy: User;

  @Expose({
    name: 'actionBy',
  })
  get actionBy(): string {
    if (this.createdBy) {
      return this.createdBy.email;
    }
    return '';
  }

  constructor(partial: Partial<AuditLogResponseDto>) {
    Object.assign(this, partial);
  }
}
