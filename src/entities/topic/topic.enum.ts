import { Column, Entity, ManyToMany, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';

@Entity()
export class Topic extends BaseEntity {
  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(
    () => User,
    user => user.topics,
  )
  user: User;

  @OneToMany(
    () => Comment,
    comment => comment.topic,
  )
  comments: Comment[];

  @Column({ nullable: true })
  createdBy: number;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  likeCount: number;

  @ManyToMany(
    () => User,
    user => user.topicsLiked,
  )
  usersLiked: User[];
}
