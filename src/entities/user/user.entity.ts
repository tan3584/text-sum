import { Entity, DeleteDateColumn, OneToMany } from 'typeorm';
import { Post } from '../post/post.enum';
import { UserCommonEntity } from '../userCommon.entity';

@Entity()
export class User extends UserCommonEntity {
  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(
    () => Post,
    post => post.user,
  )
  posts: Post;
}
