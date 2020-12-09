import { User } from 'src/entities/user/user.entity';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async getLoginUserWithOptions(findOptions: { email: string }): Promise<User> {
    const user = await this.createQueryBuilder('user')
      .where('user.email = :email', {
        ...findOptions,
      })
      .select([
        'user.email',
        'user.phoneNumber',
        'user.deletedAt',
        'user.emailVerified',
        'user.id',
        'user.email',
        'user.password',
        'user.firstName',
        'user.lastName',
        'user.status',
        'user.preferLanguage',
      ])
      .withDeleted()
      .getOne();
    return user;
  }
}
