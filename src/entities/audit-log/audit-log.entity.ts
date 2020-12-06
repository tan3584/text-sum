import { Entity, Column } from 'typeorm';
import { BaseEntity } from '../base.entity';

@Entity()
export class AuditLog extends BaseEntity {
  @Column()
  action: string;

  @Column()
  module: string;

  @Column({ nullable: true })
  content: string;

  @Column({ nullable: true })
  userId: number;
}
