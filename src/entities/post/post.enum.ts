import { BaseEntity, Column, Entity, ManyToOne } from 'typeorm';
import { User } from '../user/user.entity';

@Entity()
export class Post extends BaseEntity {
  @Column({ nullable: false })
  subject: string;

  @Column({ nullable: false })
  description: string;

  @ManyToOne(
    () => User,
    user => user.posts,
  )
  user: User;

  @Column({ nullable: true })
  createdBy: number;
}
