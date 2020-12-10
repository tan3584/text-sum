import { Entity, DeleteDateColumn, OneToMany, ManyToMany } from 'typeorm';
import { Comment } from '../comment/comment.entity';
import { Topic } from '../topic/topic.enum';
import { UserCommonEntity } from '../userCommon.entity';

@Entity()
export class User extends UserCommonEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => Topic,
    topic => topic.user,
  )
  topics: Topic[];

  @OneToMany(
    () => Comment,
    comment => comment.user,
  )
  comments: Comment[];

  @ManyToMany(
    () => Topic,
    topic => topic.usersLiked,
  )
  topicsLiked: Topic[];
}
