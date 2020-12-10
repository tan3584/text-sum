import { Column, Entity, ManyToOne } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { Topic } from '../topic/topic.enum';
import { User } from '../user/user.entity';

@Entity()
export class Comment extends BaseEntity {
  @Column({ nullable: false })
  content: string;

  @ManyToOne(
    () => Topic,
    topic => topic.comments,
  )
  topic: Topic;

  @ManyToOne(
    () => User,
    user => user.comments,
  )
  user: User;

  @Column({ nullable: true })
  createdBy: number;

  @Column({ default: 0 })
  likeCount: number;
}
