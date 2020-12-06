import { Entity, DeleteDateColumn } from 'typeorm';
import { UserCommonEntity } from '../userCommon.entity';

@Entity()
export class User extends UserCommonEntity {
  @DeleteDateColumn()
  deletedAt?: Date;
}
