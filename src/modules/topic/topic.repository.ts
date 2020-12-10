import { Topic } from 'src/entities/topic/topic.enum';
import { EntityRepository, Repository } from 'typeorm';

@EntityRepository(Topic)
export class TopicRepository extends Repository<Topic> {}
