import { Column, Entity, ManyToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Topic } from '../topic/topic.enum';

@Entity()
export class Categories extends BaseEntity {
  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @ManyToMany(
    () => Topic,
    topic => topic.categories,
  )
  topics: Topic[];
}
