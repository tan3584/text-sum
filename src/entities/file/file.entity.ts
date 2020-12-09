import {
  Entity,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { REFERENCE_TYPE } from './enums/referenceType.enum';
import { Min } from 'class-validator';

@Entity()
export class File {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @UpdateDateColumn()
  updatedDate: Date;

  @CreateDateColumn()
  createdDate: Date;

  @Column({
    enum: REFERENCE_TYPE,
    nullable: true,
  })
  referenceType: REFERENCE_TYPE;

  @Column({
    nullable: false,
    default: 0,
  })
  @Min(0)
  referenceId: number;

  @Column({
    nullable: true,
  })
  extension: string;

  @Column({
    nullable: true,
  })
  fileName: string;
}
