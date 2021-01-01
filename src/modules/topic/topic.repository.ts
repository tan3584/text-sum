import { Topic } from 'src/entities/topic/topic.enum';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {
  async getFiltered(findOptions: {
    take: number;
    skip: number;
    search: any;
  }): Promise<any> {
    const topics = await this.createQueryBuilder('topic')
      .where('subject ILIKE :searchTerm', {
        searchTerm: `%${findOptions.search}%`,
      })
      .orWhere('description ILIKE :searchTerm', {
        searchTerm: `%${findOptions.search}%`,
      })
      .select()
      .getManyAndCount();
    return topics;
  }
}
