import { BaseEntity, Column, Entity } from 'typeorm';

@Entity()
export class Categories extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;
}
