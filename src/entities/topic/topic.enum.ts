import {
  Column,
  Entity,
  Generated,
  ManyToMany,
  ManyToOne,
  OneToMany,
} from 'typeorm';
import { BaseEntity } from '../base.entity';
import { User } from '../user/user.entity';
import { Comment } from '../comment/comment.entity';
import { Categories } from '../categories/categories.enum';

@Entity()
export class Topic extends BaseEntity {
  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  description: string;

  @Column({ nullable: true })
  sumarization: string;

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

  @ManyToMany(
    () => Categories,
    categories => categories.topics,
  )
  categories: Categories[];

  @Column({ default: true })
  sendNoti: boolean;

  @Column()
  @Generated('uuid')
  uuid: string;
}
